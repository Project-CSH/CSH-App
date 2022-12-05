#import json
#import requests
#import os 
from mysql_db import DBMysql
from collections import defaultdict
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
                "tool_type":value[5] if value[5] != "None" else "미검사",
                "hygiene_type":value[6] if value[6] != "None" else "미검사","img_path":"http://cshserver.ga:8000/img/"+value[3]})
                if not value[0] in result_video_data:
                    result_video_data[value[0]]= {
                          "video_id": value[0],
                  "total_tool_type": value[1] if value[1] != "None" else "미검사",
                  "total_hygiene_type": value[2] if value[2] != "None" else "미검사",
                    }
            for v_id, img_list in result_image_data.items():
                if result_video_data[v_id]["total_hygiene_type"] == "미검사":
                    result_video_data[v_id]["clean_per_total"] = "미검사"
                    result_video_data[v_id]["acc_hygiene"] = "미검사"
                   
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
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_uncheck_images_sql = f"""
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
            join videos as v ON 
            i.restaurant_id = v.r_id and v.total_hygiene_type = %s
            join images as img ON v.v_id = img.v_id
        """
        if self.cursor.execute(get_uncheck_images_sql,("None")):
            print(self.cursor.fetchall())
        else:
            return False
        # check_hygiene_url = "http://01e4-34-80-27-235.ngrok.io"

        # img_file = open('./data/2/f47c596aab7d7cb742e95257a36c82fd7a6763ab_5.jpg', 'rb')

        # res = requests.post(check_hygiene_url, files = {'file': img_file})
        # print("res",res.json())


if __name__ == "__main__":
    g = Govern()
    g.get_hygiene_result()