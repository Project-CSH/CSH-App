from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup
from expiry_tracker import tracker
from good_store import get_store_list
from fpsiren import FoodPosion


app = Flask(__name__)

app.config["JSON_AS_ASCII"] = False


@app.route("/", methods=["GET"])
def welcome():
    return "Welcome to the CSH API!"


@app.route("/hello", methods=["GET"])
def hello():
    return "hello worlds, It's CSH."


@app.route("/fpsiren", methods=["GET"])
def get_fpsiren_data():
    fp = FoodPosion()
    user_city_name = request.args.get("userCityName")
    day = request.args.get("day")
    fp.set_data(day, user_city_name)
    fp.get_data()
    return {
        fp.city_name: fp.fp_city_score_dic[fp.city_name]
    } if user_city_name != "All" else fp.fp_allcity_average_score_dic, 200


@app.route("/sign-up", methods=["POST"])
def sign_up():
    user = request.json
    response = {
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],
        "profile": user["profile"],
    }

    return jsonify(response), 200


@app.route("/barcode_tracking", methods=["POST"])
def barcode_tracking():

    item = request.json
    brcd_num = item["bcd_number"]
    keyId = "080fb9ab8f0443f691e4"
    product_name, kindof, expiry_date = tracker(keyId, brcd_num)
    if product_name == 0 and kindof == 0 and expiry_date == 0:
        return jsonify({"message": "존재하지 않는 바코드입니다."}), 400

    response = {
        "barcode_nubmer": brcd_num,
        "product name": product_name,
        "종류": kindof,
        "expiry_date": expiry_date,
    }
    return jsonify(response), 200


@app.route("/store_list", methods=["POST"])
def good_store():
    req = request.json
    location = req["location"]  # 강남

    store_dict = get_store_list(location)
    store_names = list(store_dict.keys())
    print(store_names)
    response = {"상호": store_names[0], "주소": store_dict[store_names[0]]}
    # return jsonify(response), 200
    return jsonify(store_dict), 200


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True, port=3000)
