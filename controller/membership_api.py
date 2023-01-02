import os
from flask import *
import jwt
from datetime import datetime, timedelta

from utils.create_blueprint import blueprints
from utils.member_data_validation import data_validate
from data.member.insert_new_member import insert_member
from data.member.login_query import login_query
from dotenv import load_dotenv

load_dotenv()
jwt_key = os.getenv("jwt_key")

membership = blueprints("membership")

@membership.route("/membership")
def membership_page():
    return render_template("membership.html")

@membership.route("/api/user", methods = ["POST"])
def signup():
    json_data = request.get_json()
    name = json_data["name"]
    email = json_data["email"]
    password = json_data["password"]

    # 註冊資料驗證
    validation_result = data_validate(email, password, name)
    if validation_result["error"]:
        return jsonify(validation_result), 400

    # 寫入資料庫
    db_result = insert_member(name, email, password)
    if db_result["error"] and db_result["status_code"] == 400:
        return jsonify({"error": db_result["error"], "message": db_result["message"]}), 400
    elif db_result["error"] and db_result["status_code"] == 500:
        return jsonify({"error": db_result["error"], "message": db_result["message"]}), 500
    
    return jsonify({"ok": db_result["ok"]}), 200
        

@membership.route("/api/user/auth")
def get_user_info():
    get_cookie = request.cookies.get("jwt")
    try:
        payloads = jwt.decode(get_cookie, jwt_key,algorithms="HS256")
        data = {"id": payloads["id"], "name": payloads["name"], "email": payloads["email"]}
        return jsonify({"data": data}), 200
    except:
        return jsonify({"data": None}), 200
        

@membership.route("/api/user/auth", methods = ["PUT"])
def login():
    json_data = request.get_json()
    email = json_data["email"]
    password = json_data["password"]
    
    # 登入資料驗證
    validation_result = data_validate(email, password)
    if validation_result["error"]:
        return jsonify(validation_result), 400

    # 資料庫驗證
    db_result = login_query(email, password)

    if db_result["error"] and db_result["status_code"] == 500:
        return jsonify({"error": db_result["error"], "message": db_result["message"]}), 500
    elif db_result["error"]:
        return jsonify(db_result), 400

    # 製作JWT
    result = db_result["result"]
    resp = make_response(jsonify({"ok": True}))
    id = result["id"]
    name = result["name"]
    expiration_time = datetime.utcnow() + timedelta(weeks=1)
    payload = {"id": f"{id}", "name": f"{name}", "email": f"{email}", "exp": expiration_time}
    jwt_encode = jwt.encode(payload, jwt_key, algorithm = "HS256")
    resp.set_cookie(key="jwt", value=jwt_encode, expires=expiration_time)
    return resp, 200

@membership.route("/api/user/auth", methods = ["DELETE"])
def logout():
    resp = make_response(jsonify({"ok": True}))
    resp.set_cookie(key="jwt", value="", expires=0)
    return resp, 200