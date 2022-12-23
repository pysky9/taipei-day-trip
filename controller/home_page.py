from flask import *

home_page = Blueprint("home_page",
                        __name__,
                        static_folder = "public",
                        static_url_path = "/",
                        template_folder = "templates")

@home_page.route("/")
def index():
	return render_template("index.html")
