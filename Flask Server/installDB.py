import psycopg2
from DBConnection import get_connection, user, psw

# Create connection
conn = psycopg2.connect(host="localhost", port=5432, user=user, password=psw)
conn.set_session(autocommit=True)
if not conn:
    print("Error during db connection")
    exit()


# Create database
dropDB = "DROP DATABASE IF EXISTS teamify"
createDB = "CREATE DATABASE teamify"

cur = conn.cursor()
cur.execute(dropDB)

try:
    cur.execute(createDB)
    print("[INFO] DB successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()

conn.close()


# Create tables
conn = get_connection()
if conn is None:
    print("Error in db connection")
    exit()
cur = conn.cursor()


# Table 'member'
dropMember = "DROP TABLE IF EXISTS member"
member = """CREATE TABLE member (
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(100) PRIMARY KEY,
    password CHAR(256) NOT NULL
)"""
try:
    cur.execute(dropMember)
    cur.execute(member)   
    conn.commit() 

    print("[INFO] Table 'member' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'notification'
dropNotification = "DROP TABLE IF EXISTS notification"
notification = """CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    content VARCHAR(500),
    type VARCHAR(50) NOT NULL DEFAULT 'message',
    read boolean NOT NULL DEFAULT FALSE,
    username VARCHAR(100),
    CONSTRAINT fk_username
        FOREIGN KEY(username)
            REFERENCES member(username)
            ON DELETE CASCADE,
    CHECK (
        type = 'invite'
        OR type = 'message'
        OR type = 'survey'
        OR type = 'event'
        OR type = 'admin'
    )
)"""
try:
    cur.execute(dropNotification)
    cur.execute(notification)   
    conn.commit() 

    print("[INFO] Table 'notification' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


conn.close()