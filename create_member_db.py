import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from data.password import password

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = password
)

mycursor = db.cursor()
mycursor.execute("CREATE DATABASE trip_members")


db_pool = MySQLConnectionPool(
    pool_name = "members_pool",
    pool_size = 2,
    pool_reset_session = True,
    host = "localhost",
    database = "trip_members",
    user = "root",
    password = password
)

try:
    db = db_pool.get_connection()
    table = db.cursor()
    member_sql = "CREATE TABLE members(\
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, \
        name VARCHAR(255) NOT NULL, \
        email VARCHAR(255) NOT NULL, \
        password VARCHAR(255) NOT NULL);"
    table.execute(member_sql)
    db.commit()
except Exception as err:
    print(err)
finally:
    db.close()
