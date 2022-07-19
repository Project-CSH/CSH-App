from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup
from expiry_tracker import tracker


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
    product_name, kindof, expiry_date = tracker(keyId, brcd_num)
    response = {
        'barcode_nubmer': brcd_num,
        'product name': product_name,
        '종류': kindof,
        'expiry_date': expiry_date 
    }
    return jsonify(response), 200


