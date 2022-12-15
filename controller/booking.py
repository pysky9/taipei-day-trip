from flask import *
import jwt
from data.create_connection_pool import create_connection_pool
from data.password import jwt_key

booking_pool = create_connection_pool("booking_pool", "trip_members")
attraction_pool = create_connection_pool("attraction_pool", "attractions")

bookings = Blueprint("bookings",
                    __name__,
                    static_folder = "public",
                    static_url_path = "/",
                    template_folder = "templates")

@bookings.route("/booking")
def booking():
	return render_template("booking.html")

@bookings.route("/api/booking")
def check_booking():
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403
    payloads = jwt.decode(get_cookie, jwt_key, algorithms="HS256")
    member_id = payloads["id"]

    # get data from trip_member DB
    try:
        booking_db = booking_pool.get_connection()
        booking_query = booking_db.cursor(dictionary = True)
        sql_statement = "SELECT * FROM booking WHERE member_id = %s"
        booking_query.execute(sql_statement, (member_id,))
        result = booking_query.fetchone()
        booking_query.close()

        if result == None:
            return jsonify({"data": None}), 200

        attraction_id = result["attractionId"]
        date = result["dates"]
        time = result["times"]
        price = result["price"]
        not_order_status = result["not_order"]

        if not_order_status != "not_order":
            return jsonify({"data": None}), 200
    except Exception as err:
        print(f"{err}")
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message)
    finally:
        booking_db.close()

    # get data from attraction DB
    try:
        attraction_db = attraction_pool.get_connection()
        attraction_query = attraction_db.cursor(dictionary = True)
        sql_statement = "SELECT name, \
                                address, \
                                images \
                            FROM attraction \
                            INNER JOIN trafic_info \
                            ON attraction.id = trafic_info.attraction_id \
                            WHERE attraction.id = %s ;"
        attraction_query.execute(sql_statement, (attraction_id,))
        result = attraction_query.fetchone()
        attraction_query.close()
        image = json.loads(result["images"])
        response_data = {"data":{
                            "attraction":{
                                "id": attraction_id, 
                                "name": result["name"],
                                "address": result["address"],
                                "image": image[0]
                            }, 
                            "date": date, 
                            "time":time, 
                            "price": price
                            }
                        }
        return jsonify(response_data), 200
    except Exception as err:
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message)
    finally:
        attraction_db.close()

@bookings.route("/api/booking", methods = ["POST"])
def booking_trip():
    # get memberId from payload of JWT token and check whether login or not
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403

    payloads = jwt.decode(get_cookie, jwt_key, algorithms="HS256")
    member_id = payloads["id"]
    
    # get reuqeust data
    request_data = request.get_json()
    attractionId = request_data["attractionId"]
    dates = request_data["date"]
    times = request_data["time"]
    price = request_data["price"]
    not_order = "not_order"
    if dates == "":
        error_message = {"error": True, "message": "未挑選日期"}
        return jsonify(error_message), 400

    sql_value = (member_id, attractionId, dates, times, price, not_order)

    try:
        db = booking_pool.get_connection()
        query = db.cursor(dictionary = True)
        sql_statement = "SELECT * FROM booking WHERE member_id = %s"
        query.execute(sql_statement,(member_id,))
        result = query.fetchone()
        if result == None:
            sql_statement = "INSERT INTO booking (member_id, attractionId, dates, times, price, not_order) VALUES (%s, %s, %s, %s, %s, %s);"
        else:
            sql_statement = "UPDATE booking SET member_id = %s, attractionId = %s, dates = %s, times = %s, price = %s, not_order = %s ;"
        query.execute(sql_statement, sql_value)
        db.commit()
        query.close()
        return jsonify({"ok": True})
    except Exception as err:
        print(err)
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message)
    finally:
        db.close()

@bookings.route("/api/booking", methods = ["DELETE"])
def cancel_booking_trip():
    # get memberId from payload of JWT token and check whether login or not
    get_cookie = request.cookies.get("jwt")
    if get_cookie == None:
        error_message = {"error": True, "message": "未登入系統"}
        return jsonify(error_message), 403

    payloads = jwt.decode(get_cookie, jwt_key, algorithms="HS256")
    member_id = payloads["id"]

    try:
        db = booking_pool.get_connection()
        query = db.cursor()
        sql_statement = "DELETE FROM booking WHERE member_id = %s"
        query.execute(sql_statement,(member_id,))
        db.commit()
        query.close()
        return jsonify({"ok": True})
    except Exception as err:
        print(err)
        error_message = {"error": True, "message": f"{err}"}
        return jsonify(error_message)
    finally:
        db.close()