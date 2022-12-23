from flask import *

from controller.attraction_api import attractions
from controller.membership_api import membership
from controller.booking import bookings
from controller.home_page import home_page
from controller.order import order

app=Flask(__name__, static_folder = "public", static_url_path = "/")

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False

app.register_blueprint(attractions)
app.register_blueprint(membership)
app.register_blueprint(bookings)
app.register_blueprint(home_page)
app.register_blueprint(order)

app.run(host = "0.0.0.0", port = 3000)