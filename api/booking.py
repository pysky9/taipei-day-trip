from flask import *

bookings = Blueprint("bookings",
                    __name__,
                    static_folder = "public",
                    static_url_path = "/",
                    template_folder = "templates")

@bookings.route("/booking")
def booking():
	return render_template("booking.html")