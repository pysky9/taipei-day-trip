from flask import *

from utils.create_blueprint import blueprints
from utils.create_connection_pool import create_connection_pool

attractions = blueprints("attractions")

db_pool = create_connection_pool("attraction_pool", "attractions")


@attractions.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@attractions.route("/api/attractions")
def attractions_data():
	get_page = request.args.get("page", None)
	keyword = request.args.get("keyword", None)
	try:
		db = db_pool.get_connection()
		query = db.cursor(dictionary=True)		

		if get_page and keyword == None:
			page = int(get_page)
			sql = "SELECT attraction.id, name, category, description, address, direction AS transport, mrt, latitude AS lat, longitude AS lng, images \
					FROM attraction \
					INNER JOIN trafic_info ON attraction.id = trafic_info.attraction_id \
					LIMIT %s, %s;"
			value = (page * 12, 13) 
			query.execute(sql, value)
			query_result = query.fetchall()
			for item in query_result:
				image = json.loads(item["images"])
				item["images"] = image
			if query_result == []:
				response_data = {"data": query_result, "nextPage": None}
				return jsonify(response_data)
			if len(query_result) <= 12: 
				response_data = {"data": query_result, "nextPage": None}
				return jsonify(response_data)
			query_result.pop()
			response_data = {"data": query_result, "nextPage": page + 1}
			return jsonify(response_data)
		
		elif get_page and keyword:
			page = int(get_page)
			sql = "SELECT attraction.id, name, category, description, address, direction AS transport, mrt, latitude AS lat, longitude AS lng, images \
					FROM attraction INNER JOIN trafic_info ON attraction.id = trafic_info.attraction_id \
					WHERE category = %s OR name LIKE %s \
					LIMIT %s, %s;"
			value = (keyword, f"%{keyword}%", page * 12, 13) 
			query.execute(sql, value)
			query_result = query.fetchall()
			for item in query_result:
				image = json.loads(item["images"])
				item["images"] = image
			if query_result == []:
				response_data = {"data": query_result, "nextPage": None}
				return jsonify(response_data)
			if len(query_result) <= 12: 
				response_data = {"data": query_result, "nextPage": None}
				return jsonify(response_data)
			query_result.pop()
			response_data = {"data": query_result, "nextPage": page + 1}
			return jsonify(response_data)
		error_message = {
			"error": True,
			"message": "請提供搜尋資料，謝謝"
		}
		return jsonify(error_message), 400

	except ValueError as err:
		error_message = {
			"error": True,
			"message": f"{err}"
		}
		return jsonify(error_message), 400

	except Exception as err:
		error_message = {
			"error": True,
			"message": f"{err}"
		}
		return jsonify(error_message), 500
		
	finally:
		db.close()

@attractions.route("/api/attraction/<attractionId>")
def attraction_site(attractionId):
		try:
			db = db_pool.get_connection()
			query = db.cursor(dictionary=True)
			sql = "SELECT attraction.id, name, category, description, address, direction AS transport, mrt, latitude AS lat, longitude AS lng, images \
					FROM attraction INNER JOIN trafic_info ON attraction.id = trafic_info.attraction_id \
					WHERE attraction.id = %s;"
			query.execute(sql, (attractionId,))
			data = query.fetchone()
			image =json.loads(data["images"])
			data["images"] = image
			response_data = {"data": data}
			return jsonify(response_data)
		except TypeError as err:
			error_message = {
				"error": True,
				"message": f"{err}"
			}
			return jsonify(error_message), 400
		except Exception as err:
			error_message = {
				"error": True,
				"message": f"{err}"
			}
			return jsonify(error_message), 500
		finally:
			db.close()

@attractions.route("/api/categories")
def category():
	try:
		db = db_pool.get_connection()
		query = db.cursor()
		sql = "SELECT category FROM attraction"
		query.execute(sql)
		result_unique = set(query.fetchall())
		categories = []
		for result in result_unique:
			item = result[0].replace(u'\u3000', u'') 
			categories.append(item)
		response_data = {"data": categories}
		return response_data
	except Exception as err:
		error_message = {
			"error": True,
			"message": f"{err}"
		}
		return jsonify(error_message), 500
	finally:
		db.close()