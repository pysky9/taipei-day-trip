from flask import *

from api.attraction_api import attractions
from api.membership_api import membership
from api.booking import bookings
from api.home_page import home_page

app=Flask(__name__, static_folder = "public", static_url_path = "/")

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]=False

app.register_blueprint(attractions)
app.register_blueprint(membership)
app.register_blueprint(bookings)
app.register_blueprint(home_page)

app.run(host = "0.0.0.0", port = 3000)