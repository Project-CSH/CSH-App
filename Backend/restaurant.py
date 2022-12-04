import requests
import json
import hashlib
import os
from werkzeug.utils import secure_filename
from pathlib import Path
import traceback
import cv2
import pymysql
class Restaurant:
    def __init__(self,dbmysql) -> None:
        self.dbmysql = dbmysql
        #추후 아예 account 클래스로 만들어서 처리하면 더 확장성 있는 개발이 가능할 것으로 보임 
        self.table_name = "account"
        self.file_path = "" 
        self.file_name = ""
        self.con, self.cursor = self.dbmysql.connect()
        self.insert_image_values = []
    def login(self,req_data):
        #Todo  check parameter로직 추가 예
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
            if not self.check_bz_num(req_data["bz_num"]):
                return False
            req_data["password"] = hashlib.sha1(req_data["password"].encode("utf-8")).hexdigest() 
            field_name_set = tuple(key for key in list(req_data.keys()))
            insert_value_set = tuple(key for key in list(req_data.values()))
            sql_field_name =f"""{field_name_set}""".replace("\'","")
            sql_insert_data = self.auto_formatter(list(req_data.values())).replace("\'","")
            signup_sql = f"INSERT INTO {self.table_name} {sql_field_name} VALUES {sql_insert_data}"
            #추후 (auto) 포멧터 형식으로 바꾸면 sql injection 대비가 될것임 => 코드 단축, 유연성 확보 사항으로 변경 완료, 효율적인지는 몰겠음.
            self.cursor.execute(signup_sql,insert_value_set)
            self.con.commit()
            return (True, "회원가입 성공!")
        except pymysql.IntegrityError as e:
            print("signup error:",e)
            if e.args[0] == 1062:
                return (False,"회원가입에 실패했습니다. 이미 가입된 사업자입니다. 다시확인해주세요.")
        except Exception as e:
            print("signup error:",e)
            return (False,"회원가입에 실패했습니다. 사업자 번호를 다시 확인해주세요.")
    
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
    def save_rec_data(self,rest_id,file):  
        # 이미지 아이디를 만들어주기
        # restaurant id 이미 뿌려주기 
        # 인공지능 에이전트와 어떻게 판별결과를 Update 할지  
        self.file_path = Path("./data/"+rest_id+"/")
        #Path(os.path.dirname(os.path.abspath(__file__))+"/data/"+rest_id+"/")
        print("image path", self.file_path)
        try:
            result = False
            if not os.path.exists(self.file_path):
                os.makedirs(self.file_path) 
            video_id = self.get_hash_id(file.read()) 
            # read 한 뒤로는 메모리 포인터가 파일 그 다음을 가리키기 때문에 원상복귀해줘야함   
            file.seek(0)  
            hash_file_name = video_id+os.path.splitext(file.filename)[1]
            self.file_name = secure_filename(hash_file_name)
          
            #video_id = self.get_hash_id(open(os.path.join(self.file_path, self.file_name),'rb').read())
            save_video_path = os.path.join(self.file_path, hash_file_name)
            #cv2.VideoWriter(save_video_path, cv2.VideoWriter_fourcc(*'MP4V'), 24, (160, 120))
            file.save(save_video_path)
            print("영상 파일 저장을 완료했습니다.")
            print("file  path",os.path.join(self.file_path,self.file_name))
            
            vidcap = cv2.VideoCapture(os.path.join(self.file_path,self.file_name))
            cursor = self.con.cursor()
            cursor.execute("desc videos")
            field_name_set  = tuple(column[0] for column in cursor.fetchall())
            update_field_set = ""
            for field_name in list(field_name_set)[1:]:
                update_field_set += f"{field_name} = %s,"
            update_field_set = update_field_set[:-1]
            sql_field_name = f"""{field_name_set}""".replace("\'","")
            sql_insert_value_format = self.auto_formatter(field_name_set).replace("\'","")
            sql_videos_sql = f"INSERT INTO videos {sql_field_name} VALUES {sql_insert_value_format} ON DUPLICATE KEY UPDATE {update_field_set}"
            print("sql_videos_sql",sql_videos_sql)
            print("filename",file.filename)
            # video_id 
            # cursor.execute(sql_videos_sql,(video_id, save_video_path, "None", "None",file.filename ,int(rest_id),video_id))
            cursor.execute(sql_videos_sql,(video_id, save_video_path, "None", "None",file.filename ,int(rest_id),save_video_path, "None", "None",file.filename ,int(rest_id)))
            self.con.commit()
            
            if self.video_to_img(vidcap,rest_id,video_id):
                print("비디오 to 사진 분할 [성공]!")
                print("DB에 해당 이미지 업로드")
                cursor.execute("desc images")
                field_name_set  = tuple(column[0] for column in cursor.fetchall())
                update_field_set = ""
                for field_name in list(field_name_set)[1:]:
                    update_field_set += f"{field_name} = VALUES({field_name}),"
                update_field_set = update_field_set[:-1]
                sql_field_name = f"""{field_name_set}""".replace("\'","")
                sql_insert_value_format = self.auto_formatter(field_name_set).replace("\'","")
                # ON DUPLICATE KEY UPDATE executemany시 VALUES로 감싸주기
                sql_images_sql = f"INSERT INTO images {sql_field_name} VALUES {sql_insert_value_format} ON DUPLICATE KEY UPDATE {update_field_set}" # img_id = VALUES(img_id)"
                print("sql_images_sql",sql_images_sql)
                cursor.executemany(sql_images_sql,self.insert_image_values)
                self.con.commit()
                result = True        
            else:
                print("비디오 to 사진 분할 [실패]!")
            return result
            # asyncio 모듈의 event loop 객체 생성
            # nowTime = str(datetime.now(KST))  
           
        except Exception as e:
                print(traceback.format_exc())
                print("save_data Error: Failed to create the directory.",e)
                return False
    def auto_formatter(self, insert_data_list):
        return_tuple = ()
        format_dic = {
            type(""): "%s",
            type(0):"%d", 
        }
        for insert_data_value in list(insert_data_list):
            return_tuple += (format_dic[type(insert_data_value)],)
        return f"""{return_tuple}"""  
    def video_to_img(self, vidcap, rest_id,video_id):
        count = 0
        frame_num = 0
        
        while (vidcap.isOpened()):
            ret, img = vidcap.read()

            if ret:
                #1초당 30프레임
                frame_num = int(vidcap.get(1))

                if frame_num % 5 != 0:
                    continue   
                #filp 상하좌우 반전
                try:

                    print("count",count)
                    image_id = f"{video_id}_{count}"
                    image_path = f"{Path(self.file_path,image_id)}.jpg"
                    if cv2.imwrite(image_path, cv2.flip(img,-1)):
                          # | img_id       | varchar(255) | NO   | PRI | NULL    |       |
                          # | img_path     | varchar(255) | YES  |     | NULL    |       |
                          # | tool_type    | varchar(255) | YES  |     | NULL    |       |
                          # | hygiene_type | varchar(255) | YES  |     | NULL    |       |
                          # | v_id         | varchar(255) | YES  | MUL | NULL    |       |
                        # executemany 
                        self.insert_image_values.append((image_id,image_path,"None","None",rest_id,video_id))
                        print(f"Saved {image_path}")
                    else:
                        raise Exception("Could not write image")                
                    count += 1   
                except Exception as e:
                    print("오류",e)
            else:
                break
        print(f"#{frame_num} Saved")

        vidcap.release()
        return True
    def get_hash_id(self, value):
        return hashlib.sha1(str(value).encode("utf-8")).hexdigest()
if __name__ == "__main__":
    RA = Restaurant()
    #RA.signup({"name":"테스트계정","email":"test@gmail.com","password":hashlib.sha1("test".encode("utf-8")).hexdigest(),"bz_num": "12345"})
    #RA.login({"name":"테스트계정","password":hashlib.sha1("test".encode("utf-8")).hexdigest()})
    RA.check_bz_num("1208765763")