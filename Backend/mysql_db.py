
import pymysql
import ujson

## show dbs
## restaurant
## government
class DBMysql():
    def __init__(self,target_config_name=None) -> None:
        self.con = None
        self.target_config_name = target_config_name
        self.basic_dbconfig = self.get_dbconfig("basic")
    def get_dbconfig(self,type):
        try:
            if not self.target_config_name:
                self.target_config_name = "./dbconfig.json"
            with open(self.target_config_name,"r",encoding="utf-8") as f:            
                return ujson.load(f)[type]
        except Exception as e: 
            print("error:",e)
            return False
    def connect(self,db_name):
        if not self.basic_dbconfig:
            print("설정 파일을 불러오지 못했습니다. 파일 경로 또는, 파일 내용이 올바르지 않습니다.")
            return False    
        if self.check_db(db_name):
            print("DB 구성 설정을 완료하지 못했습니다.")
            return False   
        self.con = pymysql.connect(**{**{"db":db_name},**self.basic_dbconfig})
        return (self.con,self.con.cursor())
    def check_db(self,db_name):
        try:
            self.con = pymysql.connect(**self.basic_dbconfig)
            #db 체크 및 생성 작업
            self.con.cursor().execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            #테이블 생성 작업 
            self.con = self.con = pymysql.connect(**{**{"db":db_name},**self.basic_dbconfig})
            for create_table_sql in self.get_dbconfig(db_name)["create_tables"]:
                self.con.cursor().execute(create_table_sql)
            return True
        except Exception as e:
            print("check_db error:",e)
            return False