import os
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db_pool = MySQLConnectionPool(
    pool_name = "members_pool",
    pool_size = 1,
    pool_reset_session = True,
    host = "localhost",
    database = "trip_members",
    user = "root",
    password = password
)

try:
    db = db_pool.get_connection()
    table = db.cursor()
    ordering_sql = "CREATE TABLE ordering (\
                                    id INT PRIMARY KEY AUTO_INCREMENT,\
                                    member_id INT NOT NULL,\
                                    order_number VARCHAR(255) NOT NULL,\
                                    site_id INT NOT NULL,\
                                    site_name VARCHAR(150) NOT NULL,\
                                    site_address VARCHAR(255) NOT NULL,\
                                    site_image_url VARCHAR(1000) NOT NULL,\
                                    trip_date VARCHAR(150) NOT NULL,\
                                    trip_time VARCHAR(30) NOT NULL,\
                                    trip_price INT NOT NULL,\
                                    phone VARCHAR(50) NOT NULL,\
                                    order_status VARCHAR(30) NOT NULL,\
                                    FOREIGN KEY (member_id) REFERENCES members(id)\
                                );"
    table.execute(ordering_sql)
    db.commit()
except Exception as err:
    print(err)
finally:
    db.close()