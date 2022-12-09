from data.create_connection_pool import create_connection_pool
db_pool = create_connection_pool("members_pool", "trip_members")

def login_query(email, password):
    try:
        db = db_pool.get_connection()
        query = db.cursor(dictionary = True)
        sql_stat = "SELECT * FROM members WHERE email = %s AND password = %s ;"
        query.execute(sql_stat, (email, password))
        result = query.fetchone()
        db.close()
        if result:
            return {"error": False, "result": result}
        return {"error": True, "message": "帳號密碼錯誤", "status_code": 400}
    except Exception as err:
        return {"error": True, "message": f"{err}", "status_code": 500}
