
import pymysql
import ujson
import csv
import shutil

## show dbs
## restaurant
## government

class DBMysqlInit():
    def __init__(self,db_name,basic_dbconfig) -> None:
        self.db_name = db_name
        self.basic_dbconfig = basic_dbconfig
    def connect(self):
        if not self.basic_dbconfig:
            print("설정 파일을 불러오지 못했습니다. 파일 경로 또는, 파일 내용이 올바르지 않습니다.")
            return False   
        print("DB 연결 완료") 
        con = pymysql.connect(**{**{"db":self.db_name},**self.basic_dbconfig})
        return (con, con.cursor())
    def get_dbconfig(self,type,target_config_name=None):
            try:
                if not target_config_name:
                    target_config_name = "./dbconfig.json"
                with open(target_config_name,"r",encoding="utf-8") as f:            
                    return ujson.load(f)[type]
            except Exception as e: 
                print("error:",e)
                return False

class DBMysql():
    def __init__(self) -> None:
        self.restaurant_csv_filename = "./모범음식점_전체.csv"
        pass
    def set_db(self,db_name,is_update=False,target_config_name=None) -> None:
        basic_dbconfig = self.__get_dbconfig("basic",target_config_name)

        if not self.__check_db(db_name, basic_dbconfig,is_update):
            print("DB 구성 설정을 완료하지 못했습니다.")
            return None
        else:
            print("DB 구성 체크 완료")
            return DBMysqlInit(db_name,basic_dbconfig)
    
    def __get_dbconfig(self,type,target_config_name=None):
            try:
                if not target_config_name:
                    target_config_name = "./dbconfig.json"
                with open(target_config_name,"r",encoding="utf-8") as f:            
                    return ujson.load(f)[type]
            except Exception as e: 
                print("error:",e)
                return False
    def __check_db(self,db_name,basic_dbconfig,is_update):
            try:
                con = pymysql.connect(**basic_dbconfig)
                cursor = con.cursor()
                #db 체크 및 생성 작업
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
                #테이블 생성 작업 
                con = pymysql.connect(**{**{"db":db_name},**basic_dbconfig})
                cursor = con.cursor()
                for create_table_sql in self.__get_dbconfig(db_name)["create_tables"]:
                    cursor.execute(create_table_sql)
                if not cursor.execute("SELECT * from infos limit 1") or is_update:
                    print("식당 데이터 업로드 중..") 
                    # restaurant_list 형식
                    # {'address': '강원도 원주시 일산동 77-3 ', 'enroll_date': '20211021144038', 'name': '상훈집', 'allow_number': '19740383012'}
                    restaurant_list = self.get_csv_restaurant_data()
                    insert_value_list = []
                    for csv_restaurant_value in restaurant_list:
                        # restaurant table 형식
                        # ('restaurant_id', 'restaurant_name', 'is_check_hygiene','judgement_grade', 'restaurant_address', 'is_visited_restaurant', 'bz_num')
                        insert_value_list.append((csv_restaurant_value["name"],0, "자료 미등록",csv_restaurant_value["address"],0,csv_restaurant_value["allow_number"],'0000-00-00'))
                    cursor.execute("desc infos")
                    field_name_set  = tuple(column[0] for column in cursor.fetchall()[1:])
                    sql_field_name = f"""{field_name_set}""".replace("\'","")
                    sql_insert_value_format = self.auto_formatter(field_name_set).replace("\'","")
                    update_field_set = ""
                    for field_name in list(field_name_set)[1:]:
                        update_field_set += f"{field_name} = VALUES({field_name}),"
                    update_field_set = update_field_set[:-1]
                    set_infos_sql = f"INSERT INTO infos {sql_field_name} VALUES {sql_insert_value_format} ON DUPLICATE KEY UPDATE {update_field_set}"
                    #cursor.execute(set_infos_sql,(restaurant_list[0]["name"],0, "미검사",restaurant_list[0]["address"],0,restaurant_list[0]["allow_number"]))
                    cursor.executemany(set_infos_sql,insert_value_list)
                    con.commit()
                    con.close()
                return True
            except Exception as e:
                print("check_db error:",e)
                return False
    #테이블 필드에 맞춰 csv 불러오기 
    def grvn_csv_read(self):
        with open(self.restaurant_csv_filename,'r',encoding='utf-8') as f:
                r_data = csv.reader(f)
                firstLine = False
                all_store_dict = {}
                address_index_list = []
                store_name_index =0 
                allow_number_index =0 
                enroll_date_index =0

                for line in r_data:
                        if firstLine == False:
                                firstLine = True
                                for idx, element in enumerate(line):
                                        if '업소명' in element:
                                                store_name_index = idx
                                                continue
                                        if '인허가번호' in element:
                                                allow_number_index = idx
                                                continue
                                        if '도로명주소' in element or '소재지' in element:                
                                                address_index_list.append(idx)        
                                                continue
                                        if '영업상태명' in element:
                                                status_index = idx
                                                continue       
                                        if '최종수정일자' in element:
                                                enroll_date_index = idx
                                                continue
                                continue
                        if line[status_index] == '폐업':
                                continue
                        name = line[store_name_index]
                        address = line[address_index_list[0]] if line[address_index_list[0]] == "" else line[address_index_list[1]]
                        allow_number = line[allow_number_index]
                        enroll_date = line[enroll_date_index]
                        all_store_dict[allow_number] = {"address" : address, "enroll_date":enroll_date,"name":name,"allow_number":allow_number}
        return all_store_dict 
     
    def get_csv_restaurant_data(self):
        store_list = []
        all_store_dict = self.grvn_csv_read()

        for store_dict in all_store_dict.values():

                if "원주시" in store_dict["address"]:
                        store_list.append(store_dict)
        if not store_dict:
                pass
        return store_list
    def auto_formatter(self, insert_data_list):
        return_tuple = ()
        format_dic = {
            type(""): "%s",
            type(0):"%d", 
        }
        for insert_data_value in list(insert_data_list):
            return_tuple += (format_dic[type(insert_data_value)],)
        return f"""{return_tuple}""" 
    def set_rest_id(self):
        basic_dbconfig = self.__get_dbconfig("basic")
        con = pymysql.connect(**{**{"db":"restaurant"},**basic_dbconfig})
        cursor = con.cursor()
        for sql in self.__get_dbconfig("restaurant")["set_id_tables"]:
            cursor.execute(sql)
        con.commit()
        try:
            shutil.rmtree("./data")
        except:
            pass
         

if __name__ == "__main__":
    DBMysql().set_rest_id()
    DBMysql().set_db("restaurant",True)