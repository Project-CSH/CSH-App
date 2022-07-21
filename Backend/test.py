import requests

user_key_id = "58d5b5c768a2464db512"
cause_service_id = "I2850"
occur_service_id = "I2848"
data_type = "json"
start_idx = "1"
end_idx = "5"

request_url = f"http://openapi.foodsafetykorea.go.kr/api/{user_key_id}/{cause_service_id}/{data_type}/{start_idx}/{end_idx}"

print(request_url)
res = requests.get(request_url)

print(res.text)

"강원도":,
        "경기도",
        "경상남도",
        "경상북도",
        "광주시",
        "대구시",
        "대전시",
        "부산시",
        "서울시",
        "울산시",
        "인천시",
        "전라남도",
        "전라북도",
        "제주도",
        "충청남도",
        "충청북도",
        "세종시"

#지도  
{"강원도":56,
        "경기도",
        "경상남도",
        "경상북도",
        "광주시",
        "대구시",
        "대전시",
        "부산시",
        "서울시":["서울시"],
        "울산시",
        "인천시",
        "전라남도",
        "전라북도",
        "제주도",
        "충청남도",
        "충청북도",
        "세종시"



