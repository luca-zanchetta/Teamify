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

    print("Table member created")
except Exception as err:
    print("Error: ", err)


# Create task table
dropTask = "DROP TABLE IF EXISTS task"
task = """CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'not_completed' CHECK (status IN ('completed','not_completed')),
    member VARCHAR REFERENCES member(username),
    type VARCHAR(10) DEFAULT 'personal' CHECK (type IN ('personal', 'event'))
)"""

try:
    cur.execute(dropTask)
    cur.execute(task)
    conn.commit()
    print("Task table created")
except Exception as err:
    print("Error: ", err)


conn.close()
