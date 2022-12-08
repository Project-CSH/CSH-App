#import json
# import requests
#import os 
from mysql_db import DBMysql
from collections import defaultdict
import math
import traceback
import requests
class Govern:
    def __init__(self) -> None:
        self.dbmysql = None
        self.con = None
        self.cursor = None

    def get_restaurant_list(self):
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_restaurant_sql = f"SELECT * FROM infos"
        self.cursor.execute(get_restaurant_sql)
        # for item in self.cursor.fetchall():

        # return [[item[0] )]
        fields = [field_md[0] for field_md in self.cursor.description]
        result = [dict(zip(fields,row)) for row in self.cursor.fetchall()]
        return result
    def get_hygiene_info(self,restaurant_id):
        
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        return_data ={}
        get_images_sql = f"""select
            v.v_id,
            v.total_tool_type,
            v.total_hygiene_type,
            img.img_id,
            img.img_path,
            img.tool_type,
            img.hygiene_type,
            i.judgement_grade
            from
            infos as i
            join videos as v ON i.restaurant_id = %s
            and i.restaurant_id = v.r_id
            join images as img ON img.r_id = %s and  v.v_id = img.v_id 
         """ 
     
        if self.cursor.execute(get_images_sql,(restaurant_id,restaurant_id)):
            return_data["restaurant_id"] = str(restaurant_id)
            
            result_image_data = defaultdict(list)
            result_video_data = {}
           
            for value in self.cursor.fetchall():  
                return_data["judgement_grade"] = value[7]     
                result_image_data[value[0]].append(
                {"img_id": value[3],
                "tool_type":value[5] ,
                "hygiene_type":value[6] ,"img_path":"http://cshserver.ga:8000/"+value[4]}) #"http://cshserver.ga:8000/"+value[4]
                if not value[0] in result_video_data:
                    print("video_id",value[0])
                    result_video_data[value[0]]= {
                          "video_id": value[0],
                  "total_tool_type": value[1] ,
                  "total_hygiene_type": value[2],
                    }
            print("result_video_data",result_video_data)
            for v_id, img_list in result_image_data.items():
                if result_video_data[v_id]["total_tool_type"] == "판별대기":
                    result_video_data[v_id]["clean_per_total"] = "판별대기"
                    result_video_data[v_id]["acc_hygiene"] = "판별대기"
                   
                else:
                    clean_type_img = 0
                    for img in img_list:
                        if img["hygiene_type"] == "clean":
                            clean_type_img+= 1
                    print("result video total tool type", result_video_data[v_id]["total_tool_type"])
                    if result_video_data[v_id]["total_tool_type"] != "비주방도구":
                        result_video_data[v_id]["clean_per_total"] = f"{clean_type_img}/{len(img_list)}"
                        result_video_data[v_id]["acc_hygiene"] = math.trunc(round(clean_type_img/len(img_list),2) * 100)
                    else:
                        result_video_data[v_id]["clean_per_total"] = "판별불가"
                        result_video_data[v_id]["acc_hygiene"] = "판별불가"
                result_video_data[v_id]["images"] = img_list
            return_data["videos"] = list(result_video_data.values())

            return return_data
        else:
            return False
    def get_image_info(self,img_id):
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_image_info_sql = f"SELECT * from images WHERE img_id = %s"
        if self.cursor.execute(get_image_info_sql,(img_id)):
            print("존재하는 이미지: ",img_id)
            find_image_info = self.cursor.fetchone()
            print("image",find_image_info)
            return {"img_id":img_id,"img_path":find_image_info[1],"tool_type":find_image_info[2],"hygiene_type":find_image_info[3]}
        else:
            print("존재하지 않는 이미지",img_id)
            return False
    def get_hygiene_result(self):
        print("==============[AI 위생 검사 시작]==============")
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_uncheck_images_sql = f"""select
            v.v_id,
            img.img_id,
            img.img_path,
            img.tool_type,
            img.hygiene_type
            from
            infos as i
            join videos as v ON 
            v.total_tool_type = %s
            and i.restaurant_id = v.r_id
            join images as img ON v.v_id = img.v_id 
        """
  
        total_img_info_dict = defaultdict(list)
        total_video_info_dict = defaultdict(dict)
        update_video_value_list = []
        update_image_value_list = []
        if self.cursor.execute(get_uncheck_images_sql,("판별대기")):
            uncheck_value_list = self.cursor.fetchall()
            print("판별 이미지 개수:",len(uncheck_value_list))
            for uncheck_value in uncheck_value_list:
                total_img_info_dict[uncheck_value[0]].append({"img_id":uncheck_value[1],"img_path":uncheck_value[2],"tool_type":uncheck_value[3],"hygiene_type":uncheck_value[4]})

            # for value in self.cursor.fetchall():
            #     # 변경 필요
            # self.send_to_ai_server(total_img_info_dict) #img_path
            # 변경 필요 
            if not self.send_to_ai_server(total_img_info_dict):
                return False
                # append => insert 
                # total_img_info_dict[value[0]].append({"img_id":value[3],"hygiene_type":hygiene_type,"tool_type":tool_type}) 
            for video_id, img_value_list in total_img_info_dict.items():
                total_video_info_dict[video_id]["video_id"] = video_id
                total_video_info_dict[video_id]["total_count"] = len(img_value_list)
                total_video_info_dict[video_id]["clean_count"] = 0
                total_video_info_dict[video_id]["tool_types"] = []
                for img_value in img_value_list:
                    # print("img_value",img_value)
                    update_image_value_list.append(
                    (img_value["tool_type"],img_value["hygiene_type"],"판별대기",video_id)
                )  # img_tool_type, img_hygiene_type, total_tool_type, v.v_id 
                    if img_value["hygiene_type"] == "clean":
                        total_video_info_dict[video_id]["clean_count"] += 1
                    total_video_info_dict[video_id]["tool_types"].append(img_value["tool_type"])
                print("tool_types",total_video_info_dict[video_id]["tool_types"])
                print("max tool type",max(total_video_info_dict[video_id]["tool_types"], key=total_video_info_dict[video_id]["tool_types"].count))
                total_video_info_dict[video_id]["total_tool_type"] = max(total_video_info_dict[video_id]["tool_types"], key=total_video_info_dict[video_id]["tool_types"].count)
                print("total_video_tool_type",total_video_info_dict[video_id]["total_tool_type"])
                # 50보다 크면 정확한 판단으로 봄 
                clean_per_total = round(total_video_info_dict[video_id]["clean_count"]/total_video_info_dict[video_id]["total_count"],2) * 100
                if total_video_info_dict[video_id]["total_tool_type"] == "비주방도구":
                    total_video_info_dict[video_id]["total_hygiene_type"] = "판별불가"
                elif clean_per_total > 50:
                    total_video_info_dict[video_id]["total_hygiene_type"] = "clean"
                else:
                    total_video_info_dict[video_id]["total_hygiene_type"] = "dirty"

                update_video_value_list.append(
                    ("관리자 미승인","1111-11-11",total_video_info_dict[video_id]["total_tool_type"],
                    total_video_info_dict[video_id]["total_hygiene_type"],video_id
                )) #i.judgement_grade,v.total_tool_type,v.total_hygiene_type,v.v_id
              
            update_image_sql = f"""UPDATE
                videos v
                INNER JOIN images img ON img.r_id = v.r_id and v.v_id = img.v_id
                SET
                img.tool_type = %s,
                img.hygiene_type = %s
                WHERE
                v.total_tool_type = %s
                AND v.v_id = %s"""
            print("update_image_value_list",update_image_value_list)
            self.cursor.executemany(update_image_sql,update_image_value_list)
            update_video_sql= f"""UPDATE infos i 
                INNER JOIN videos v ON i.restaurant_id = v.r_id SET i.judgement_grade = %s,i.visit_date = %s,
                v.total_tool_type = %s, v.total_hygiene_type = %s
                WHERE v.v_id = %s """
            self.cursor.executemany(update_video_sql,update_video_value_list)
            self.con.commit()
            print("==============[AI 위생 검사 완료]==============")
        else:
            print("AI 위생 판별이 모두 완료된 상태입니다.")
            return False
    # input ( img_path - > img value list)
    # output (hygiene, tool_type) -> img value list 
    def send_to_ai_server(self,total_img_info_dict):
        for video_id, img_info_list in total_img_info_dict.items():
            print("대상 Video :",video_id)
            request_result = {}
            img_file_list = []

            try:
                check_hygiene_url = "http://1fb0-35-247-140-143.ngrok.io"
                # print("img_info_list",img_info_list)
                for img_info in img_info_list:
                    print(img_info["img_path"])
                    
                    # with (img_info["img_path"], 'rb') as img_file:
                    img_file_list.append(('file',open(img_info["img_path"],'rb')))
                print("AI 판별중..")
                request_result = requests.post(check_hygiene_url, files = img_file_list)
                res = request_result.json() # {'img_path' : 'result'}
                result_img_info_list = []
                for img_info in img_info_list[:]:
                    
                    types = res[img_info["img_id"]+".jpg"]

                    if types == "Fail":
                        img_info["tool_type"] = "비주방도구"
                        img_info["hygiene_type"] = "판별불가"
                    else:
                        type_list = types.split("_")        
                        img_info["hygiene_type"] = type_list[0]
                        img_info["tool_type"] = type_list[1]
                    result_img_info_list.append(img_info)
                total_img_info_dict[video_id] = result_img_info_list

                print(f"AI 판별 완료 : {video_id}\n결과:\n",res)
            except Exception as e:
                print(traceback.format_exc())
                print("error!","서버 연결실패")
                return False
        print("모두 판별 완료! DB에 저장")
        return True
    def fix_restaurant_hugiene(self,restaurant_id,judgement_grade):
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        judgement_grade_list = ["우수","불량"]
        if judgement_grade in judgement_grade_list:
            try:
                update_judgement_grade_sql = f"""
                        UPDATE
                        infos i
                        SET
                        i.judgement_grade = %s
                        WHERE  
                        i.restaurant_id = %s           
                """
                self.cursor.execute(update_judgement_grade_sql,(judgement_grade, restaurant_id))
                self.con.commit()
                return True 
            except Exception as e:
                print("Error fix judgement_grade",e)
                return False
        else:
            return False
    def enroll_visit_date(self, date, restaurant_id):
        
        try:
            self.dbmysql = DBMysql().set_db("restaurant")
            self.con, self.cursor = self.dbmysql.connect()
            update_visit_date = f"""
                            UPDATE
                            infos i
                            SET
                            i.visit_date = %s
                            WHERE  
                            i.restaurant_id = %s         
                            """
            if self.cursor.execute(update_visit_date,(date,restaurant_id)):
                self.con.commit()
                return True
            else:
                return False
        except Exception as e:
            print("error enroll_visit_date",e)
            return False




if __name__ == "__main__":
    g = Govern()
    g.get_hygiene_result()