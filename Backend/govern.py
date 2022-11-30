#import json
#import requests
#import os 
from mysql_db import DBMysql

class Govern:
    def __init__(self) -> None:
        self.dbmysql = None
        self.con = None
        self.cursor = None

    def restaurant_list(self):
        self.dbmysql = DBMysql().set_db("restaurant")
        self.con, self.cursor = self.dbmysql.connect()
        get_restaurant_sql = f"SELECT * FROM infos"
        self.cursor.execute(get_restaurant_sql)
        # for item in self.cursor.fetchall():

        # return [[item[0] )]
        fields = [field_md[0] for field_md in self.cursor.description]
        result = [dict(zip(fields,row)) for row in self.cursor.fetchall()]
        return result
