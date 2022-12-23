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
    booking_sql = "CREATE TABLE booking(\
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, \
        member_id INT NOT NULL, \
        attractionId INT NOT NULL, \
        dates VARCHAR(150) NOT NULL, \
        times VARCHAR(150) NOT NULL, \
        price VARCHAR(50) NOT NULL, \
        not_order VARCHAR(50) NOT NULL, \
        FOREIGN KEY(member_id) REFERENCES members(id) );"
    table.execute(booking_sql)
    db.commit()
except Exception as err:
    print(err)
finally:
    db.close()
