import psycopg2
from DBConnection import get_connection, user, psw

# Create connection
conn = psycopg2.connect(host="localhost", port=5432, user=user, password=psw)
conn.set_session(autocommit=True)
if not conn:
    print("Error during db connection")

dropDB = "DROP DATABASE IF EXISTS teamify"
createDB = "CREATE DATABASE teamify"

cur = conn.cursor()
cur.execute(dropDB)

try:
    cur.execute(createDB)
    print("DB created")
except Exception as err:
    print("Error: ", err)

conn.close()


conn = get_connection()
if conn is None:
    print("Error in db connection")

dropMember = "DROP TABLE IF EXISTS member"
member = """CREATE TABLE member (
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(100) PRIMARY KEY,
    password CHAR(256) NOT NULL
)"""

cur = conn.cursor()
try:
    cur.execute(dropMember)
    cur.execute(member)   
    conn.commit() 

    print("Table created")
except Exception as err:
    print("Error: ", err)

conn.close()
