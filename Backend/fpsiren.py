# python ver 3.8.4
import requests
import json
from datetime import datetime
import pytz
import re
from bs4 import BeautifulSoup
from collections import defaultdict

# 기상청 식중독 지수 url 라우팅에 따라
# https://www.weather.go.kr/plus/life/li_asset/popup/imgdata_popup.jsp?CODE=A01_2&point=2 (06:00 발표 기준, 모레 데이터 조회 불가능)
# https://www.weather.go.kr/w/resources/jsp/life/imgdata_popup_test.jsp?CODE=A01_2&point=2  (06:00 발표 기준, 모레 데이터 조회 가능)
# point = 3 는 18:00에 활성화되는 것 같은데, 이것도 다시 확인해서 보기 => 확인 결과 point 3은 18:00 발표 기준 확인되는 것을 확인
# 06:00 발표 기준 point 0,1,2  18:00 발표 기준 point 1,2,3로 조회 가능


# 18:00 기준으로 Point가 변경되므로 Point Setting
class FoodPosion:
    def __init__(self):
        self.time_table_obj = {}
        self.fp_data_base_url = (
            "https://www.weather.go.kr/w/resources/jsp/life/imgdata_popup_test.jsp?CODE=A01_2"
        )
        self.CLEANR = re.compile("<.*?>|{.*?}")  # html parsing용 html Tag 제거 정규식
        self.fp_city_score_dic = defaultdict(dict)

    def set_data(self, day_code, city_name):
        self.day_code = day_code
        self.city_name = city_name
        KST = pytz.timezone("Asia/Seoul")
        current_hour = int(datetime.now(KST).strftime("%H"))
        change_data_hour1 = 6
        change_data_hour2 = 18
        if current_hour > change_data_hour1 and change_data_hour2 > current_hour:  # case 1 06:00 발표
            self.time_table_obj = {"today": 0, "tomorrow": 1, "afterTomorrow": 2}
        else:  # case 2 18:00 발표
            self.time_table_obj = {"today": 1, "tomorrow": 2, "afterTomorrow": 3}

    def get_data(self):
        request_url = f"{self.fp_data_base_url}&point={self.time_table_obj[self.day_code]}"
        soup = BeautifulSoup(requests.get(request_url).text, "html.parser")
        fp_city_list = [html_fp_city.text for html_fp_city in soup.findAll("th", {"scope": "row"})]
        # nbsp != " " 다름, 따라서 공백으로 제거해주는 것이 아님, nbsp == "\xa0"
        fp_score_null = BeautifulSoup("<td>\xa0</td>", "html.parser")
        fp_score_list = [
            int(html_fp_score.text)
            for html_fp_score in soup.findAll("td")
            if html_fp_score not in {fp_score_null.find("td")}
        ]

        for fp_city, fp_score in zip(fp_city_list, fp_score_list):
            self.fp_city_score_dic[fp_city] = fp_score
        print(self.fp_city_score_dic)

        # html_fp_score_list = soup.findAll("td")
        # print(html_fp_score_list[10].getText() == "\xa0")
        # clean_text = BeautifulSoup(res.text, "html.parser")
        # clean_text = re.sub(self.CLEANR, '', res.text)
        # print(type(clean_text))

if n
FP = FoodPosion()
# 'today','tomorrow','afterTomorrow'
FP.set_data("today", "서울시")
FP.get_data()
# point_today =
