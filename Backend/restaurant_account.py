from mysql_db import DBMysql
class ResaurantAccount:
    def __init__(self) -> None:
        self.dbmysql = DBMysql()
    def login(self):
        self.con, self.cursor = self.dbmysql.connect("restaurant")
    def signup(self,account_data):
        self.con, self.cursor = self.dbmysql.connect("restaurant")
        table_name_set = tuple(key for key in list(account_data.keys()))
        insert_data_set = tuple(key for key in list(account_data.values()))
        sql_table_name =f"""{table_name_set}""".replace("\'","")
        sql_insert_data = f"""{insert_data_set}"""
        signup_sql = f"INSERT INTO {sql_table_name} VALUES {sql_insert_data}"
        print("insert_data_set:",insert_data_set," type:",type(insert_data_set))
        #추후 (auto) 포멧터 형식으로 바꾸면 sql injection 대비가 될것임
        self.cursor.execute(signup_sql)
        self.con.commit()
        self.con.close()
    def auto_formatter(self):
        format_list = {
            type(""): "%s",
            type(0):"%d", 
        }

if __name__ == "__main__":
    RA = ResaurantAccount()
    RA.signup({"name":"테스트계정","email":"test@gmail.com","password":"test","bz_num": "12345"})