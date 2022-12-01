
user_key_id = "58d5b5c768a2464db512"
cause_service_id = "I2850"
occur_service_id = "I2848"
data_type = "json"
start_idx = "1"
end_idx = "5"

# request_url = f"http://openapi.foodsafetykorea.go.kr/api/{user_key_id}/{cause_service_id}/{data_type}/{start_idx}/{end_idx}"

# print(request_url)
# res = requests.get(request_url)

# print(res.text)

# "강원도":,
#         "경기도",
#         "경상남도",
#         "경상북도",
#         "광주시",
#         "대구시",
#         "대전시",
#         "부산시",
#         "서울시",
#         "울산시",
#         "인천시",
#         "전라남도",
#         "전라북도",
#         "제주도",
#         "충청남도",
#         "충청북도",
#         "세종시"

# #지도  
# {"강원도":56,
#         "경기도",
#         "경상남도",
#         "경상북도",
#         "광주시",
#         "대구시",
#         "대전시",
#         "부산시",
#         "서울시":["서울시"],
#         "울산시",
#         "인천시",
#         "전라남도",
#         "전라북도",
#         "제주도",
#         "충청남도",
#         "충청북도",
#         "세종시"



# import os
# from pathlib import Path
# print(os.getcwd())
# print(Path(os.path.dirname(os.path.abspath(__file__))+"/datas"))
# # print(Path(os.path.dirname(os.path.abspath(__file__))+"\data" )
# # print(os.listdir(os.getcwd()))
# def createDirectory(directory):
#     try:
#         if not os.path.exists(directory):
#             os.makedirs(directory)
#         else:
#             print("이미 폴더가 존재합니다.")
#     except OSError:
#         print("Error: Failed to create the directory.")
# createDirectory(Path(os.path.dirname(os.path.abspath(__file__))+"/datas/"+"1"))
# import os
# import cv2
# video_file_path  = "./data/1/te_st.mp4"
# print(os.path.splitext(video_file_path)[0])
# vidcap = cv2.VideoCapture('./data/1/test.mp4')

# if os.path.isdir(video_file_path) == False:
#     os.mkdir(video_file_path)

# count = 0
# frame_num = 0 
# while (vidcap.isOpened()):
#     ret, img = vidcap.read()

#     if ret:
#         #1초당 30프레임
#         frame_num = int(vidcap.get(1))

#         if frame_num % 5 != 0:
#             continue   
        
#         #filp 상하좌우 반전
#         cv2.imwrite("%s%d.jpg" % (video_file_path, count), cv2.flip(img,-1))
#         print('Saved %s%d.jpg' % (video_file_path, count))
#         count += 1
        
#     else:
#         break
# print(f"#{frame_num} frame")

# vidcap.release()




# import csv

# filename = "./모범음식점_전체.csv"
# def grvn_csv_read(filename):
#         with open(filename,'r',encoding='utf-8') as f:
#                 r_data = csv.reader(f)
#                 firstLine = False
#                 all_store_dict = {}
#                 address_index_list = []
#                 store_name_index =0 
#                 allow_number_index =0 
#                 enroll_date_index =0

#                 for line in r_data:
#                         if firstLine == False:
#                                 firstLine = True
#                                 for idx, element in enumerate(line):
#                                         if '업소명' in element:
#                                                 store_name_index = idx
#                                                 continue
#                                         if '인허가번호' in element:
#                                                 allow_number_index = idx
#                                                 continue
#                                         if '도로명주소' in element or '소재지' in element:                
#                                                 address_index_list.append(idx)        
#                                                 continue
#                                         if '영업상태명' in element:
#                                                 status_index = idx
#                                                 continue       
#                                         if '최종수정일자' in element:
#                                                 enroll_date_index = idx
#                                                 continue
#                                 continue
#                         if line[status_index] == '폐업':
#                                 continue
#                         name = line[store_name_index]
#                         address = line[address_index_list[0]] if line[address_index_list[0]] == "" else line[address_index_list[1]]
#                         allow_number = line[allow_number_index]
#                         enroll_date = line[enroll_date_index]
#                         all_store_dict[allow_number] = {"address" : address, "enroll_date":enroll_date,"name":name,"allow_number":allow_number}
#         return all_store_dict 
# store_list = []
# all_store_dict = grvn_csv_read(filename)

# for store_dict in all_store_dict.values():

#         if "원주시" in store_dict["address"]:
#                 store_list.append(store_dict)
# if not store_dict:
#         pass
# print((store_list[0]))
import os
print(os.path.splitext("123tset.mp4")[1])