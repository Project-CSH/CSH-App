#import json
#import requests
#import os 
from mysql_db import DBMysql

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
    def get_image_info(self,img_id):
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_image_info_sql = f"SELECT * from images WHERE img_id = %s"
        if self.cursor.execute(get_image_info_sql,(img_id)):
            print("존재하는 이미지: ",img_id)
            find_image_info = self.cursor.fetchone()
            print("image_path",find_image_info[1])
            return {"img_id":img_id,"img_path":find_image_info[1]}
        else:
            print("존재하지 않는 이미지",img_id)
            return False
    def get_hygiene_result():
        request_url = ""


