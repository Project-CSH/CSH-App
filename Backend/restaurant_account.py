from mysql_db import DBMysql
import requests
import json
class RestaurantAccount:
    def __init__(self) -> None:
        self.dbmysql = DBMysql()
        #추후 아예 account 클래스로 만들어서 처리하면 더 확장성 있는 개발이 가능할 것으로 보임 
        self.table_name = "account"
    def login(self,req_data):
        self.con, self.cursor = self.dbmysql.connect("restaurant")
        login_sql = f"SELECT * FROM {self.table_name} WHERE bz_num = %s and password = %s"
        
        self.cursor.execute(login_sql,tuple(key for key in list(req_data.values())))
        #hashlib.sha1("test".encode("utf-8")).hexdigest()
        account = self.cursor.fetchone()
        if account:
            print("로그인 성공!")
            return True
        else:
            print("로그인 실패!")
            return False
    def signup(self,req_data):
        try:
            if not self.check_bz_num:
                return False
            self.con, self.cursor = self.dbmysql.connect("restaurant")
            field_name_set = tuple(key for key in list(req_data.keys()))
            insert_data_set = tuple(key for key in list(req_data.values()))
            sql_field_name =f"""{field_name_set}""".replace("\'","")
            sql_insert_data = self.auto_formatter(list(req_data.values())).replace("\'","")
            signup_sql = f"INSERT INTO {self.table_name} {sql_field_name} VALUES {sql_insert_data}"
            #추후 (auto) 포멧터 형식으로 바꾸면 sql injection 대비가 될것임 => 일단 했으나, 효율적인지는 몰겠음.
            self.cursor.execute(signup_sql,insert_data_set)
            self.con.commit()
            self.con.close()
            return True
        except Exception as e:
            print("signup error:",e)
            return False
    def check_bz_num(self,bz_num):
        payload = json.dumps({"b_no": [bz_num] })
        url = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=dDnkLTCmV%2BuSIvD6iE4DYT0ZDZJyGKfnm%2Felq9H7iR%2BPHkCWcCZF7hhyHoJH1IFlbXKHdjbVsa6nXf2aBoyHkA%3D%3D"
        headers = {'Content-Type': 'application/json'}  
        res_data = json.loads(requests.request("POST", url, headers=headers, data=payload).text)["data"][0]
        if not res_data["b_stt"]:
            print(res_data["tax_type"])
            return False
        else:
            print("존재하는 사업자입니다.")
            return True
        
    def auto_formatter(self, insert_data_list):
        return_tuple = ()
        format_dic = {
            type(""): "%s",
            type(0):"%d", 
        }
        for insert_data_value in list(insert_data_list):
            return_tuple += (format_dic[type(insert_data_value)],)
        return f"""{return_tuple}"""       
        

if __name__ == "__main__":
    RA = RestaurantAccount()
    #RA.signup({"name":"테스트계정","email":"test@gmail.com","password":hashlib.sha1("test".encode("utf-8")).hexdigest(),"bz_num": "12345"})
    #RA.login({"name":"테스트계정","password":hashlib.sha1("test".encode("utf-8")).hexdigest()})
    RA.check_bz_num("1208765763")