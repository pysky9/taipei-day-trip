from utils.create_connection_pool import create_connection_pool

db_pool = create_connection_pool("members_pool", "trip_members")

def insert_member(name, email, password):
    try:
        db = db_pool.get_connection()
        query_member = db.cursor(dictionary = True)
        sql = "SELECT email FROM members WHERE email = %s"
        query_member.execute(sql, (email,))
        query_result = query_member.fetchall()
        if query_result:
            return {"error": True, "message": "重複的Email", "status_code": 400}

        sql = "INSERT INTO members(name, email, password) VALUES (%s, %s, %s)"
        values = (name, email, password)
        query_member.execute(sql, values)
        db.commit()
        return {"error": False, "ok": True}
    except (ValueError, TypeError) as err:
        return {"error": True, "message": f"{err}", "status_code": 400}
         
    except Exception as err:
        return {"error": True, "message": f"{err}", "status_code": 500}

    finally:
        db.close()