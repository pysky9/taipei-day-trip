import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
import json
from password import password

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = password
)

mycursor = db.cursor()
mycursor.execute("CREATE DATABASE attractions")


db_pool = MySQLConnectionPool(
    pool_name = "attraction_pool",
    pool_size = 2,
    pool_reset_session = True,
    host = "localhost",
    database = "attractions",
    user = "root",
    password = password
)

try:
    db = db_pool.get_connection()
    table = db.cursor()
    attraction_table_sql = "create table attraction(\
        id INT NOT NULL PRIMARY KEY, \
        name VARCHAR(255) NOT NULL, \
        category VARCHAR(255) NOT NULL, \
        description VARCHAR(2500) NOT NULL, \
        images JSON);"
    trafic_info_table_sql = "CREATE TABLE trafic_info(\
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, \
        attraction_id INT NOT NULL, address varchar(255), \
        mrt varchar(255), direction varchar(1000), \
        longitude varchar(50) not null, \
        latitude varchar(50) not null, \
        foreign key(attraction_id) references attraction(id));"
    info_detail_table_sql = "create table info_detail(\
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, \
        attraction_id INT NOT NULL, \
        rownumber int, \
        memo_time varchar(500), \
        poi varchar(10), \
        rate int, \
        date varchar(15), \
        ref_wp int, \
        avbegin varchar(15), \
        langinfo int, \
        serial_no varchar(500), \
        idpt varchar(10), \
        avend varchar(15), \
        foreign key(attraction_id) references attraction(id));"
    table.execute(attraction_table_sql)
    table.execute(trafic_info_table_sql)
    table.execute(info_detail_table_sql)
except Exception as err:
    print(err)
finally:
    db.close()

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
        sql_info_detail = "\
            INSERT INTO info_detail(attraction_id, rownumber, memo_time, poi, rate, date, ref_wp, avbegin, langinfo, serial_no, idpt, avend) \
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
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

