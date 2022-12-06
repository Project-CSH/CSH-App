#import json
# import requests
#import os 
import requests
from mysql_db import DBMysql
from collections import defaultdict
from time import sleep
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
        get_images_sql = f"""
            select
            v.v_id,
            v.total_tool_type,
            v.total_hygiene_type,
            img.img_id,
            img.img_path,
            img.tool_type,
            img.hygiene_type
            from
            infos as i
            join videos as v ON i.restaurant_id = %s
            and i.restaurant_id = v.r_id
            join images as img ON v.v_id = img.v_id
        """
  
        if self.cursor.execute(get_images_sql,(restaurant_id)):
            return_data["restaurant_id"] = str(restaurant_id)
            result_image_data = defaultdict(list)
            result_video_data = {}
            for value in self.cursor.fetchall():          
                result_image_data[value[0]].append({"img_id": value[3],
                "tool_type":value[5] ,
                "hygiene_type":value[6] ,"img_path":"http://cshserver.ga:8000/"+value[4]}) #"http://cshserver.ga:8000/"+value[4]
                if not value[0] in result_video_data:
                    result_video_data[value[0]]= {
                          "video_id": value[0],
                  "total_tool_type": value[1] ,
                  "total_hygiene_type": value[2],
                    }
            for v_id, img_list in result_image_data.items():
                if result_video_data[v_id]["total_hygiene_type"] == "판별대기":
                    result_video_data[v_id]["clean_per_total"] = "판별대기"
                    result_video_data[v_id]["acc_hygiene"] = "판별대기"
                   
                else:
                    clean_type_img = 0
                    for img in img_list:
                        if img["hygiene_type"] == "clean":
                            clean_type_img+= 1
                    
                    result_video_data[v_id]["clean_per_total"] = f"{clean_type_img}/{len(img_list)}"
                    result_video_data[v_id]["acc_hygiene"] = round(clean_type_img/len(img_list))
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
            v.total_tool_type,
            v.total_hygiene_type,
            img.img_id,
            img.img_path,
            img.tool_type,
            img.hygiene_type
            from
            infos as i
            join videos as v ON 
            (i.judgement_grade = %s or v.total_tool_type = %s)
            and i.restaurant_id = v.r_id 
            join images as img ON v.v_id = img.v_id
        """
        total_img_info_dict = defaultdict(list)
        total_video_info_dict = defaultdict(dict)
        update_video_value_list = []
        update_image_value_list = []
        if self.cursor.execute(get_uncheck_images_sql,("판별대기","판별대기")):
            for value in self.cursor.fetchall():
                hygiene_type, tool_type = self.send_to_ai_server(value[4]) #img_path
                sleep(0.8)
                if hygiene_type == False or tool_type == False:
                    return False
                total_img_info_dict[value[0]].append({"img_id":value[3],"hygiene_type":hygiene_type,"tool_type":tool_type}) 
            for video_id, img_value_list in total_img_info_dict.items():
                total_video_info_dict[video_id]["video_id"] = video_id
                total_video_info_dict[video_id]["total_count"] = len(img_value_list)
                total_video_info_dict[video_id]["clean_count"] = 0
                total_video_info_dict[video_id]["tool_types"] = []
                for img_value in img_value_list:
                    update_image_value_list.append(
                    (img_value["hygiene_type"],img_value["tool_type"],"판별대기",video_id)
                )  # img_tool_type, img_hygiene_type, total_tool_type, v.v_id 
                    if img_value["hygiene_type"] == "clean":
                        total_video_info_dict[video_id]["clean_count"] += 1
                    total_video_info_dict[video_id]["tool_types"].append(img_value["tool_type"])
                # 50보다 크면 정확한 판단으로 봄 
                clean_per_total = round(total_video_info_dict[video_id]["clean_count"]/total_video_info_dict[video_id]["total_count"],2) * 100
                if clean_per_total > 50:
                    total_video_info_dict[video_id]["total_hygiene_type"] = "clean"
                else:
                    total_video_info_dict[video_id]["total_hygiene_type"] = "dirty"
                total_video_info_dict[video_id]["total_tool_type"] =max(total_video_info_dict[video_id]["tool_types"], key=total_video_info_dict[video_id]["tool_types"].count)

                update_video_value_list.append(
                    ("관리자 미승인",total_video_info_dict[video_id]["total_tool_type"],
                    total_video_info_dict[video_id]["total_hygiene_type"],video_id
                )) #i.judgement_grade,v.total_tool_type,v.total_hygiene_type,v.v_id
              
            update_image_sql = f"""UPDATE
                videos v
                INNER JOIN images img ON img.r_id = v.r_id
                SET
                img.tool_type = %s,
                img.hygiene_type = %s
                WHERE
                v.total_tool_type = %s
                AND v.v_id = %s"""
            self.cursor.executemany(update_image_sql,update_image_value_list)
            update_video_sql= f"""UPDATE infos i 
                INNER JOIN videos v ON i.restaurant_id = v.r_id SET i.judgement_grade = %s,
                v.total_tool_type = %s, v.total_hygiene_type = %s
                WHERE v.v_id = %s """
            self.cursor.executemany(update_video_sql,update_video_value_list)
            self.con.commit()
            print("==============[AI 위생 검사 완료]==============")
        else:
            print("AI 위생 판별이 모두 완료된 상태입니다.")
            return False
        
    def send_to_ai_server(self,img_path):
        print("ai send",img_path)
        request_result = {}
        try:
            check_hygiene_url = "http://41a8-35-240-182-240.ngrok.io"

            img_file = open(img_path, 'rb')
            request_result = requests.post(check_hygiene_url, files = {'file': img_file})
            res = request_result.json()["Result"]
            print("AI 판별 결과",res)
            if res == "Fail":
                return ("판별불가","비주방도구") # hygiene_type, tool_type
            else:
                type_list = res.split("_")
    
                return type_list[0], type_list[1] # hygiene_type, tool_type
        except Exception as e:
            print("error",request_result)
            return (False,False)


if __name__ == "__main__":
    g = Govern()
    g.get_hygiene_result()