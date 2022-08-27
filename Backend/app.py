from flask import Flask, jsonify, request, render_template
from expiry_tracker import tracker
from good_store import get_store_list
from fpsiren import FoodPosion
from board import get_board_list, board_write
from datetime import timedelta
from register import signup, login



app = Flask(__name__)

app.config["JSON_AS_ASCII"] = False


@app.route("/", methods=["GET"])
def welcome():
    return render_template("welcome.html")
    


@app.route("/hello", methods=["GET"])
def hello():
    return "hello worlds, It's CSH."


@app.route("/fpsiren", methods=["GET"])
def get_fpsiren_data():
    fp = FoodPosion()
    user_city_name = request.args.get("userCityName")
    day = request.args.get("day")
    fp.set_info(day, user_city_name)
    fp.get_fpscore_data()
    if not user_city_name in fp.fp_bigcity_average_score_dic.keys() and user_city_name != "All":
        return "No userCityName", 400
    # 시티 리스트들 보내주기
    return (
        fp.fp_bigcity_in_city_dic[user_city_name]
        if user_city_name != "All"
        else fp.fp_bigcity_average_score_dic,
        200,
    )


# 현재 내 지역 정보
@app.route("/fpsirenMy", methods=["GET"])
def get_fpsiren_my_data():
    fp = FoodPosion()
    user_city_name = request.args.get("userCityName")
    day = request.args.get("day")
    fp.set_info(day, user_city_name)
    fp.get_fpscore_data()
    fp.get_my_city_data(user_city_name)
    if not user_city_name in fp.fp_city_score_dic.keys():
        return "No userCityName", 400
    # json 형식 식중독 지수
    return fp.fp_mycity_dic, 200


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
    location = req["location"]

    store_dict = get_store_list(location)
    
    return jsonify(store_dict), 200

@app.route("/user-register-view", methods=["GET"])
def user_register_view():
    return render_template("user_register.html")

@app.route("/user-register", methods=["POST"])
def user_signup():
    req = request.form
    user_id = req["id"]
    user_name = req["name"]
    user_pw = req["password"]
    user_belong = req["belong"]
    user_role = req["role"]
    signup(user_id, user_name, user_belong, user_pw, user_role)
    return render_template("welcome.html")



@app.route("/board-write-view", methods=["GET"])
def board_write_view():
    return render_template("board_write.html")

@app.route("/board-write", methods=["POST"])
def write_board():
    req = request.form
    print(req)
    title = req["title"]
    content = req["content"]
    writer = req["writer"]
    board_write(title, content, writer)
    return "글 작성 완료 <br><a href=/board-list> 조회하기 </a>", 200

@app.route("/board-list", methods=["GET"])
def view_board_list():
    board_list = get_board_list()
    
    return render_template("board_list.html", board_list=board_list)


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True, port=5000)
