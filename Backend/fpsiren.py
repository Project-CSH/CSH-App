# python ver 3.8.4
import requests
import json
from datetime import datetime
import pytz
import re
from bs4 import BeautifulSoup
from collections import defaultdict
import math

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
        self.fp_city_score_dic = defaultdict(int)
        self.fp_bigcity_average_score_dic = defaultdict(int)
        self.fp_mycity_dic = defaultdict(dict)
        self.fp_bigcity_in_city_dic = defaultdict(dict)
        self.fp_loc_dic = {
            "강원도": [
                "춘천시",
                "원주시",
                "강릉시",
                "동해시",
                "태백시",
                "속초시",
                "삼척시",
                "홍천군",
                "횡성군",
                "영월군",
                "평창군",
                "정선군",
                "철원군",
                "화천군",
                "양구군",
                "인제군",
                "고성군",
                "양양군",
            ],
            "경기도": [
                "수원시",
                "성남시",
                "의정부",
                "안양시",
                "부천시",
                "광명시",
                "평택시",
                "동두천",
                "안산시",
                "고양시",
                "과천시",
                "구리시",
                "남양주",
                "오산시",
                "시흥시",
                "군포시",
                "의왕시",
                "하남시",
                "용인시",
                "파주시",
                "이천시",
                "안성시",
                "김포시",
                "화성시",
                "광주시",
                "양주시",
                "포천시",
                "여주시",
                "연천시",
                "가평군",
                "양평군",
            ],
            "경상남도": [
                "창원시",
                "진주시",
                "통영시",
                "사천시",
                "김해시",
                "밀양시",
                "거제시",
                "양산시",
                "의령군",
                "함안군",
                "창녕군",
                "고성군",
                "남해군",
                "하동군",
                "산청군",
                "함양군",
                "거창군",
                "합천군",
            ],
            "경상북도": [
                "포항시",
                "경주시",
                "김천시",
                "안동시",
                "구미시",
                "영주시",
                "영천시",
                "상주시",
                "문경시",
                "경산시",
                "군위군",
                "의성군",
                "청송군",
                "영양군",
                "영덕군",
                "청도군",
                "고령군",
                "성주군",
                "칠곡군",
                "예천군",
                "봉화군",
                "울진군",
                "울릉군",
            ],
            "광주시": ["광주시"],
            "대구시": ["대구시"],
            "대전시": ["대전시"],
            "부산시": ["부산시"],
            "서울시": ["서울시"],
            "울산시": ["울산시"],
            "인천시": ["서해5도", "강화군", "인천시"],
            "전라남도": [
                "목포시",
                "여수시",
                "순천시",
                "나주시",
                "광양시",
                "담양군",
                "곡성군",
                "구례군",
                "고흥군",
                "보성군",
                "화순군",
                "장흥군",
                "강진군",
                "해남군",
                "영암군",
                "무안군",
                "함평군",
                "영광군",
                "장성군",
                "완도군",
                "진도군",
                "신안군",
                "흑산면",
            ],
            "전라북도": [
                "전주시",
                "군산시",
                "익산시",
                "정읍시",
                "남원시",
                "김제시",
                "완주군",
                "진안군",
                "무주군",
                "장수군",
                "임실군",
                "순창군",
                "고창군",
                "부안군",
            ],
            "제주도": ["제주시", "서귀포시"],
            "충청남도": [
                "천안시",
                "공주시",
                "보령시",
                "아산시",
                "서산시",
                "논산시",
                "계룡시",
                "당진시",
                "금산군",
                "부여군",
                "서천군",
                "청양군",
                "홍성군",
                "예산군",
                "태안군",
            ],
            "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
            "세종시": ["세종시"],
        }

    def set_info(self, day_code, city_name):
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

    def get_fpscore_data(self):
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
        # 각 시별로 식중독 수치 구하기
        for fp_city, fp_score in zip(fp_city_list, fp_score_list):
            self.fp_city_score_dic[fp_city] = fp_score
        # 광역시, 도 , 특별시 평균 식중독 수치 구하기
        for bigcity, fp_city_list in self.fp_loc_dic.items():
            for fp_city in fp_city_list:
                # print(self.fp_bigcity_average_score_dic[big_city], self.fp_city_score_dic[fp_city])
                self.fp_bigcity_average_score_dic[bigcity] += self.fp_city_score_dic[fp_city]
                self.fp_bigcity_in_city_dic[bigcity][fp_city] = self.fp_city_score_dic[fp_city]
            self.fp_bigcity_average_score_dic[bigcity] = round(
                self.fp_bigcity_average_score_dic[bigcity] / len(fp_city_list)
            )

    def get_my_city_data(self, user_city_name):
        self.fp_mycity_dic["fp_score"] = self.fp_city_score_dic[user_city_name]
        self.fp_mycity_dic["fp_bst_virus"] = "살모넬라균"
        self.fp_mycity_dic["danger_food_lst"] = ["고기", "가공육", "계란", "닭고기", "샐러드", "마요네즈"]
        # {fp_score : 12, fp_bst_virus: '',danger_food_lst: []}
        # 현재 위치 데이터에 대한 위험 알림판
        # self.fp[big_city] = defaultdict(dict)

        # html_fp_score_list = soup.findAll("td")
        # print(html_fp_score_list[10].getText() == "\xa0")
        # clean_text = BeautifulSoup(res.text, "html.parser")
        # clean_text = re.sub(self.CLEANR, '', res.text)
        # print(type(clean_text))


if __name__ == "__main__":
    FP = FoodPosion()
    # 'today','tomorrow','afterTomorrow'
    FP.set_data("today", "서울시")

    FP.get_fpscore_data()
    # print(FP.fp_city_score_dic)
    # print(FP.fp_allcity_average_score_dic)
# point_today =
