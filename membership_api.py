from flask import *
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from data.password import password, jwt_key
import jwt
import re
from datetime import datetime, timedelta

membership = Blueprint("membership", __name__)

db_pool = MySQLConnectionPool(
    pool_name = "members_pool",
    pool_size = 4,
    pool_reset_session = True,
    host = "localhost",
    database = "trip_members",
    user = "root",
    password = password,
	auth_plugin='caching_sha2_password'
)

@membership.route("/user", methods = ["POST"])
def signup():
    json_data = request.get_json()
    name = json_data["name"]
    email = json_data["email"]
    password = json_data["password"]
    # 註冊資料驗證
    name_regex = r'[A-Za-z]{2,25}( [A-Za-z]{2,25})?'
    email_regex = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
    password_regex = r'[A-Za-z0-9@#$%^&+=]{3,}'
    name_match = re.match(name_regex, name)
    email_match = re.match(email_regex, email)
    password_match = re.match(password_regex, password)
    if not name_match:
        error_message = {"error": True, "message": "姓名格式錯誤"}
        return jsonify(error_message), 400
    elif not email_match:
        error_message = {"error": True, "message": "email格式錯誤"}
        return jsonify(error_message), 400
    elif not password_match:
        error_message = {"error": True, "message": "密碼格式錯誤"}
        return jsonify(error_message), 400
    elif name == "" or email == "" or password == "":
        error_message = {"error": True, "message": "請輸入註冊資料"}
        return jsonify(error_message), 400
    try:
        db = db_pool.get_connection()
        query_member = db.cursor(dictionary = True)
        sql = "SELECT email FROM members WHERE email = %s"
        query_member.execute(sql, (email,))
        query_result = query_member.fetchall()
        if query_result:
            error_message = {"error": True, "message": "重複的Email"}
            return jsonify(error_message), 400
        sql = "INSERT INTO members(name, email, password) VALUES (%s, %s, %s)"
        values = (name, email, password)
        query_member.execute(sql, values)
        db.commit()
        return jsonify({"ok": True}), 200
    except (ValueError, TypeError) as err:
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message), 400
    except Exception as err:
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message), 500
    finally:
        db.close()
        

@membership.route("/user/auth")
def get_user_info():
    get_cookie = request.cookies.get("jwt")
    try:
        payloads = jwt.decode(get_cookie, jwt_key,algorithms="HS256")
        db = db_pool.get_connection()
        query = db.cursor(dictionary = True)
        sql_statement = "SELECT id, name, email FROM members WHERE id = %s"
        query.execute(sql_statement, (payloads["id"],))
        result = query.fetchone()
        db.close()
        return jsonify({"data": result}), 200
    except:
        return jsonify({"data": None}), 200
        


@membership.route("user/auth", methods = ["PUT"])
def login():
    json_data = request.get_json()
    email = json_data["email"]
    password = json_data["password"]
    # 登入資料驗證
    email_regex = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
    password_regex = r'[A-Za-z0-9@#$%^&+=]{3,}'
    email_match = re.match(email_regex, email)
    password_match = re.match(password_regex, password)
    if not email_match:
        error_message = {"error": True, "message": "email格式錯誤"}
        return jsonify(error_message), 400
    elif not password_match:
        error_message = {"error": True, "message": "密碼格式錯誤"}
        return jsonify(error_message), 400
    elif email == "" or password == "":
        error_message = {"error": True, "message": "請輸入帳號或密碼"}
        return jsonify(error_message), 400
    try:
        db = db_pool.get_connection()
        query = db.cursor(dictionary = True)
        sql_stat = "SELECT * FROM members WHERE email = %s AND password = %s ;"
        query.execute(sql_stat, (email, password))
        result = query.fetchone()
        db.close()
        if result:
            resp = make_response(jsonify({"ok": True}))
            id = result["id"]
            expiration_time = datetime.utcnow() + timedelta(weeks=1)
            payload = {"id": f"{id}", "exp": expiration_time}
            jwt_encode = jwt.encode(payload, jwt_key, algorithm = "HS256")
            resp.set_cookie(key="jwt", value=jwt_encode, expires=expiration_time)
            return resp, 200
        error_message = {"error": True, "message": "帳號密碼錯誤"}
        return jsonify(error_message), 400
    except Exception as err:
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message), 500
    

@membership.route("/user/auth", methods = ["DELETE"])
def logout():
    resp = make_response(jsonify({"ok": True}))
    resp.set_cookie(key="jwt", value="", expires=0)
    return resp, 200