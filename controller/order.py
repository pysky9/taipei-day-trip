import os
import jwt
from dotenv import load_dotenv
from flask import *

from utils.create_connection_pool import create_connection_pool

load_dotenv()
password = os.getenv("password")
jwt_key = os.getenv("jwt_key")

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
    
    

@order.route("/api/order/<order_number>")
def get_ordering_information(order_number):
    pass