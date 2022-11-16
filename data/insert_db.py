import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
import json
from password import password

db_pool = MySQLConnectionPool(
    pool_name = "attraction_pool",
    pool_size = 2,
    pool_reset_session = True,
    host = "localhost",
    database = "attractions",
    user = "root",
    password = password
)


with open("taipei-attractions.json", "r", encoding = "utf-8") as file :
    row_data = json.load(file)

attraction_data = row_data["result"]["results"]

# 處理圖片
site_images = {}
for i in range(len(attraction_data)):
    attraction_id = attraction_data[i]["_id"]
    img = attraction_data[i]["file"].split("https://")
    images = []
    for url in range(1, len(img)):
        if "jpg" in img[url] or "JPG" in img[url]:
            img_url = "https://" + img[url]
            images.append(img_url)
    site_images[attraction_id] = images

# # attraction table
for i in range(len(attraction_data)):
    id = attraction_data[i]["_id"]
    name = attraction_data[i]["name"]
    category = attraction_data[i]["CAT"]
    description = attraction_data[i]["description"]
    image = json.dumps(site_images[id])
    try:
        db = db_pool.get_connection() 
        query = db.cursor()
        sql_attraction = "INSERT INTO attraction(id, name, category, description, images) VALUES (%s, %s, %s, %s, %s);"
        value_attraction = (id, name, category, description, image)
        query.execute(sql_attraction, value_attraction)
        db.commit()
    except Exception as err:
        print(err)
    finally:
        db.close()


# # info_detail table
for i in range(len(attraction_data)):
    attraction_id = attraction_data[i]["_id"]
    rownumber = int(attraction_data[i]["RowNumber"])
    memo_time = attraction_data[i]["MEMO_TIME"]
    poi = attraction_data[i]["POI"]
    rate = int(attraction_data[i]["rate"])
    date = attraction_data[i]["date"]
    ref_wp = int(attraction_data[i]["REF_WP"])
    avbegin = attraction_data[i]["avBegin"]
    langinfo = int(attraction_data[i]["langinfo"])
    serial_no = attraction_data[i]["SERIAL_NO"]
    idpt = attraction_data[i]["idpt"]
    avend = attraction_data[i]["avEnd"]

    try:
        db = db_pool.get_connection() 
        query = db.cursor()
        sql_info_detail = "INSERT INTO info_detail(attraction_id, rownumber, memo_time, poi, rate, date, ref_wp, avbegin, langinfo, serial_no, idpt, avend) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        value_info_detail = (attraction_id, rownumber, memo_time, poi, rate, date, ref_wp, avbegin, langinfo, serial_no, idpt, avend)
        query.execute(sql_info_detail, value_info_detail)
        db.commit()
    except Exception as err:
        print(err)
    finally:
        db.close()

# traffic_info table
for i in range(len(attraction_data)):
    attraction_id = attraction_data[i]["_id"]
    address = attraction_data[i]["address"]
    mrt = attraction_data[i]["MRT"]
    direction = attraction_data[i]["direction"]
    longitude = attraction_data[i]["longitude"]
    latitude = attraction_data[i]["latitude"]

    try:
        db = db_pool.get_connection() 
        query = db.cursor()
        sql_traffic_info = "INSERT INTO trafic_info(attraction_id, address, mrt, direction, longitude, latitude) VALUES (%s, %s, %s, %s, %s, %s);"
        value_traffic_info = (attraction_id, address, mrt, direction, longitude, latitude)
        query.execute(sql_traffic_info, value_traffic_info)
        db.commit()
    except Exception as err:
        print(err)
    finally:
        db.close()

