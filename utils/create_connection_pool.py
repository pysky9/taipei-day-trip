import os
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

def create_connection_pool(pool_name, database):
    return MySQLConnectionPool(
            pool_name = pool_name,
            pool_size = 4,
            pool_reset_session = True,
            host = "localhost",
            database = database,
            user = "root",
            password = password,
            auth_plugin='caching_sha2_password'
        )