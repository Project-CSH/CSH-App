from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup


app = Flask(__name__)

@app.route("/hello", methods=['GET'])
def hello():
    return "hello worlds, It's CSH."

@app.route("/sign-up", methods=['POST'])
def sign_up():
    user = request.json
    response = {
            'name': user['name'],
            'email': user['email'],
            'password': user['password'],
            'profile': user['profile']
            }

    return jsonify(response), 200

@app.route("/barcode_tracking", methods=['POST'])
def barcode_tracking():

    item = request.json
    brcd_num = item['bcd_number']
    
        
    keyId = '080fb9ab8f0443f691e4'
    barcode_info = 'C005' #* 바코드 연계 정보
    barcode = 'I2570' #* 바코드 유통정보

    serviceId = barcode
    dataType = 'json'
    startIdx = 1
    endIdx = startIdx+5
    

    url_bcd = 'http://openapi.foodsafetykorea.go.kr/api/'+keyId+'/'+serviceId+'/'+dataType+'/'+str(startIdx)+'/'+str(endIdx)+'/'+'BRCD_NO='+brcd_num
    res  = requests.get(url_bcd)
    data = res.json()[serviceId]
    if data['total_count'] == '0':
        print("조회되지 않습니다.")
        exit(1)
    else:
        data = data['row'][0]
    product_name = data['PRDT_NM']

    serviceId = barcode_info

    url_bcd_info = 'http://openapi.foodsafetykorea.go.kr/api/'+keyId+'/'+serviceId+'/'+dataType+'/'+'1'+'/'+'3'+'/'+"BAR_CD="+brcd_num
    
    res2 = requests.get(url_bcd_info)
    data2 = res2.json()[serviceId]
    if data2['total_count'] == '0':
        print("조회되지 않습니다.")
        exit(1)
    else:
        data2 = data2['row'][0]

    expiry_date = data2['POG_DAYCNT']
    kindof = data2['PRDLST_DCNM']

    response = {
        'barcode_nubmer': brcd_num,
        'product name': product_name,
        '종류': kindof,
        'expiry_date': expiry_date 
    }
    return jsonify(response), 200


