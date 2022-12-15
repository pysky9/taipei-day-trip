from flask import *
from data.create_connection_pool import create_connection_pool
db_pool = create_connection_pool("attraction_pool", "attractions")

def page_keywords(get_page, keyword):
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
                return {"data": query_result, "nextPage": None}
            if len(query_result) <= 12: 
                return {"data": query_result, "nextPage": None}
            query_result.pop()
            return {"data": query_result, "nextPage": page + 1}
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
                return {"data": query_result, "nextPage": None}
            if len(query_result) <= 12:
                return {"data": query_result, "nextPage": None}
            query_result.pop()
            return {"data": query_result, "nextPage": page + 1}
        return {"error": True, "message": "請提供搜尋資料，謝謝", "status_code": 400}
    except ValueError as err:
         return {"error": True, "message": f"{err}", "status_code": 400}
    except Exception as err:
        return {"error": True, "message": f"{err}", "status_code": 500}
    finally:
        db.close()
