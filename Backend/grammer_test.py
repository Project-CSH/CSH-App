# import re
# import datetime
# from dateutil.relativedelta import *

# target_string = "제조일로 부터 90일간"
# target_string2 = "12개월, 또는 18개월"
# target_string3 = "어묵류는 12가울, 또는 18개월"
# target_string4 = "어묵률 1루우이,"

# dt_kst = datetime.datetime.utcnow() + datetime.timedelta(hours=9)

# expiry_string_list = re.findall(r"""[0-9]+(?:개월|일)""",target_string)
# if expiry_string_list:
#     expiry_string = expiry_string_list[0]
#     time_unit = re.search(r"""(?:개월|일)""",expiry_string).group()

#     if time_unit == "개월":
#         dt_expiry =  dt_kst + relativedelta(months=+int(expiry_string.replace(time_unit,"")))
#     else:
#         dt_expiry =  dt_kst +  relativedelta(days=+int(expiry_string.replace(time_unit,"")))
#     print(dt_expiry.strftime("%Y.%m.%d"))
    
# else:
#     print("유효 기한을 읽을 수 없습니다.")
# result = f"""{tuple(key for key in ["1",2,"3"])}"""
# print(result)
# print(f"INSET {result}")



# test_dic = {"test":1, "test2":2}
# test_dic2 = test_dic.copy()
# print(test_dic.pop("test"))
# print(test_dic)
# print(test_dic2)



# test_tuple = (1)
# return_tuple = (2,3)

# return_tuple += (1)

# print(return_tuple)

print("test".encode('utf-8').hex())