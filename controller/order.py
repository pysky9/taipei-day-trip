import os
import jwt
from dotenv import load_dotenv
from flask import *
import requests
from datetime import date

from utils.create_connection_pool import create_connection_pool

load_dotenv()
password = os.getenv("password")
jwt_key = os.getenv("jwt_key")

ordering_pool = create_connection_pool("ordering_pool", "trip_members")

order = Blueprint("order",
                    __name__,
                    static_folder = "public",
                    static_url_path = "/",
                    template_folder = "templates")

@order.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
    
@order.route("/api/orders", methods = ["POST"])
def ordering():
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403
    request_data = request.get_json()

    # get data and store into DB
    payloads = jwt.decode(get_cookie, jwt_key, algorithms="HS256")
    member_id = payloads["id"]
    site_id = request_data["order"]["trip"]["id"]
    site_name = request_data["order"]["trip"]["name"]
    site_address = request_data["order"]["trip"]["address"]
    site_image_url = request_data["order"]["trip"]["image"]
    trip_date = request_data["order"]["date"]
    trip_time = request_data["order"]["time"]
    trip_price = request_data["order"]["price"]
    phone = request_data["contact"]["phone"]
    email = request_data["contact"]["email"]
    name = request_data["contact"]["name"]
    order_status = "未付款"

    # 寫入資料庫
    try:
        order_db = ordering_pool.get_connection()
        order_cursor = order_db.cursor(dictionary = True)

        # 檢查訂單數 & 產生訂單編號
        sql_statement = "SELECT order_number, order_status FROM ordering WHERE member_id = %s ;"
        order_cursor.execute(sql_statement,(member_id,))
        query_result = order_cursor.fetchall()
        today = date.today()
        order_number = f"{today.year}{today.month}{today.day}{site_id}{trip_price}{phone}-{len(query_result) + 1}"

        # 寫入資料庫
        sql_statement = "INSERT INTO \
                            ordering(member_id, order_number, site_id, site_name, site_address, site_image_url, trip_date, trip_time, trip_price, phone, order_status)\
                                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        sql_value = (member_id, order_number, site_id, site_name, site_address, site_image_url, trip_date, trip_time, trip_price, phone, order_status)
        order_cursor.execute(sql_statement, sql_value)
        order_db.commit()
    except Exception as err:
        return jsonify({{"error"}: True, "message": "系統發生錯誤"})
    finally:
        order_cursor.close()
        order_db.close()
    
    # 金流
    prime_token = request_data["prime"]

    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    header_content = {"Content-Type": "application/json", "x-api-key": os.getenv("partner_key")}
    data = {
        "prime": prime_token,
        "partner_key": os.getenv("partner_key"),
        "merchant_id": os.getenv("merchant_id"),
        "details": "TapPay Test",
        "amount": trip_price,
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email
        },
        "remember": True
    }
    send_server = requests.post(url, headers = header_content, json = data,)
    pay_result = send_server.json()

    if pay_result["status"] == 0:
        response_data = {
            "data": {
                "number": order_number,
                "payment": {
                    "status": pay_result["status"],
                    "message": "付款成功"
                }
            }
        }

        # 更新預訂(booking table) not_order 狀態
        try:
            booking_db = ordering_pool.get_connection()
            booking_cursor = booking_db.cursor()
            sql_statement = "UPDATE booking SET not_order = 'order' WHERE member_id = %s ;"
            booking_cursor.execute(sql_statement,(member_id,))
            booking_db.commit()
        except Exception as err:
            return jsonify({{"error"}: True, "message": "系統發生錯誤"})
        finally:
            booking_cursor.close()
            booking_db.close()

        # 更新訂單付款狀態(ordering table) order_status
        try:
            order_db = ordering_pool.get_connection()
            order_cursor = order_db.cursor()
            sql_statement = "UPDATE ordering SET order_status = '已付款' WHERE order_number = %s ;"
            order_cursor.execute(sql_statement,(order_number,))
            order_db.commit()
        except Exception as err:
            return jsonify({{"error"}: True, "message": "系統發生錯誤"})
        finally:
            order_cursor.close()
            order_db.close()

        return jsonify(response_data), 200

    response_data = {
            "data": {
                "number": order_number,
                "payment": {
                    "status": pay_result["status"],
                    "message": "付款失敗"
                }
            }
        }
    return jsonify(response_data), 200

@order.route("/api/order/<order_number>")
def get_ordering_information(order_number):
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403
    payloads = jwt.decode(get_cookie, jwt_key, algorithms="HS256")
    order_numbers = order_number

    try:
        order_db = ordering_pool.get_connection()
        order_cursor = order_db.cursor(dictionary = True)
        sql_statement = "SELECT * FROM ordering WHERE order_number = %s ;"
        order_cursor.execute(sql_statement,(order_numbers,))
        query_result = order_cursor.fetchone()
        if query_result :
            response_data = {
                "data": {
                    "number": query_result["order_number"],
                    "price": query_result["trip_price"],
                    "trip": {
                        "attraction": {
                            "id": query_result["site_id"],
                            "name": query_result["site_name"],
                            "address": query_result["site_address"],
                            "image": query_result["site_image_url"]
                        },
                    "date": query_result["trip_date"],
                    "time": query_result["trip_time"]
                    },
                    "contact": {
                        "name": payloads["name"],
                        "email": payloads["email"],
                        "phone": query_result["phone"]
                    },
                    "status": 1
                }
            }
            return jsonify(response_data)
        
        return jsonify({"data": None})
        
    except Exception as err:
        return jsonify({"error": True, "message": "系統發生錯誤"})
    finally:
        order_cursor.close()
        order_db.close()

@order.route("/api/ordered", methods = ["POST"])
def ordered():
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403
    request_data = request.get_json()

    try:
        db = ordering_pool.get_connection()
        query = db.cursor(dictionary = True)
        sql_statement = "SELECT * FROM ordering WHERE member_id = %s ;"
        query.execute(sql_statement,(request_data["id"],))
        result = query.fetchall()
        query.close()

        if result == []:
            return jsonify({"error": True, "message": "沒有歷史訂單"})
        return jsonify(result)
    except Exception as err:
        print(err)
        return jsonify({"error": True, "message": "系統錯誤"})
    finally:
        db.close()
