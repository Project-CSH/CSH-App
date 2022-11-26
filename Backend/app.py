import hashlib
from flask import Flask, jsonify, request, render_template
from board import board_write, get_board_list
from good_store import get_store_list
from register_origin import signup
from restaurant_account import RestaurantAccount
from fpsiren import FoodPosion
from flask_cors import CORS
from inventory_manage import InventoryManage
app = Flask(__name__)

app.config["JSON_AS_ASCII"] = False

CORS(app)
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
    if not fp.fp_bigcity_in_city_dic[user_city_name]:
        return jsonify({"result": "fail","message":"잘못된 도시 값입니다."})
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
    fp.get_my_city_virus_info(user_city_name)
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

@app.route("/rest-push",methods=["GET"])
def rest_push():
    return jsonify({"result":"success","message":"[경고] 순창고추장 1kg, p82647809481 유통기한이 지났습니다!"})

@app.route("/user-push",methods=["GET"])
def user_push():
    return jsonify({"result":"success","message":"내 지역: [원주시], 식중독 [위험] 식중독 바이러스: 살모넬라, 주의 식품:고기, 계란류 조심바랍니다."})

# @app.route("/barcode_tracking", methods=["POST"])
# def barcode_tracking():

#     item = request.json
#     brcd_num = item["bcd_number"]
#     keyId = "080fb9ab8f0443f691e4"
#     product_name, kindof, expiry_date = tracker(keyId, brcd_num)
#     if product_name == 0 and kindof == 0 and expiry_date == 0:
#         return jsonify({"message": "존재하지 않는 바코드입니다."}), 400

#     response = {
#         "barcode_nubmer": brcd_num,
#         "product name": product_name,
#         "종류": kindof,
#         "expiry_date": expiry_date,
#     }
#     return jsonify(response), 200
@app.route("/get_inventory",methods=["GET"])
#현 리스트 조회 가져오기 짜기
def get_inventory():
    IM = InventoryManage()
    if IM.load_inventory_data():
        return jsonify({"result":"success", "message":"재고 리스트 불러오기 성공!","inventory_list":IM.cur_inventory_list})
    else:
        return jsonify({"result":"fail", "message":"재고 리스트 불러오기 실패!","inventory_list":""}) 

#자동문 필터링 
@app.route("/enroll_inventory",methods=["POST"])
def enroll_inventory():
    IM =  InventoryManage()
    send_data = request.json
    if send_data["barcode_number"] == "" :
        check_send_data = send_data.copy()
        check_send_data.pop("barcode_number",None)
        for value in list(check_send_data.values()):
            if not value:
                return jsonify({"result": "fail","message":"재고 등록 실패! 정보를 다시 확인해주세요.", "inventory_list":IM.cur_inventory_list}),200
    if IM.enroll_inventory_unit(send_data): 
        return jsonify({"result": "success","message":"재고 등록 성공!", "inventory_list":IM.cur_inventory_list}),200
    else:
        return jsonify({"result": "fail","message":"재고 등록 실패! 정보를 다시 확인해주세요.", "inventory_list":IM.cur_inventory_list}),200

@app.route("/store_list", methods=["POST"])
def good_store():
    req = request.json
    location = req["location"]
    if not isinstance(location, str):
        return jsonify({"result": "fail","message":"잘못된 전달값입니다."})
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
@app.route("/rest-login",methods=["POST"])
def rest_login():
    req = request.json
    print("login req",req)
    if "password" in req and  "bz_num" in req:
        req["password"] = hashlib.sha1(req["password"].encode("utf-8")).hexdigest()
        if RestaurantAccount().login(req):
            return jsonify({"result": "success","message":"로그인 성공!"}),200
        else:
            return jsonify({"result": "fail","message":"아이디 또는, 비밀번호가 맞지 않습니다."}),200
    else:
        return jsonify({"result":"fail", "message":"미입력된 값이 존재합니다."}),400
@app.route("/rest-signup",methods=["POST"])
def rest_signup():
    req = request.json
    if "password" in req and "name" in req and "bz_num" in req: 
        if RestaurantAccount().signup(req):
            return jsonify({"result": "success","isbzNum": True,"message":"회원가입 성공!"}),200
        else:
            return jsonify({"result": "fail","isbzNum": False,"message":"회원가입에 실패했습니다. 사업자 번호를 다시 확인해주세요."}),200
    else:
        return jsonify({"result":"fail", "isbzNum": False,"message":"미입력된 값이 존재합니다."}),400

if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True, port=8000)
