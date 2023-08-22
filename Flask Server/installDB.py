import psycopg2
from DBConnection import get_connection, user, psw
from hashlib import sha256

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

    password = sha256(str("ciaociao").encode("utf-8")).hexdigest()
    query = "INSERT INTO member (name, surname, birth_date, email, username, password) VALUES (%s, %s, %s, %s, %s, %s)"
    member_data = (
        "Admin",
        "Admin",
        "2000-01-01",
        "admin@example.com",
        "admin",
        password,
    )

    cur.execute(query, member_data)
    conn.commit()

    print("[INFO] Table 'member' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


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
    type VARCHAR(10) DEFAULT 'personal' CHECK (type IN ('personal', 'event')),
    duration INTEGER DEFAULT 60 CHECK (duration > 0)
)"""

try:
    cur.execute(dropTask)
    cur.execute(task)
    conn.commit()
    print("[INFO] Table 'task' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'notification'
dropNotification = "DROP TABLE IF EXISTS notification CASCADE"
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


# Table 'team'
dropTeam = "DROP TABLE IF EXISTS team"
team = """CREATE TABLE team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'unnamed_team',
    description VARCHAR(500)
    CONSTRAINT joinn_pkey
        PRIMARY KEY(name, description),
)"""
try:
    cur.execute(dropTeam)
    cur.execute(team)
    conn.commit()

    print("[INFO] Table 'team' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'join'
dropJoin = "DROP TABLE IF EXISTS joinTeam CASCADE"
join = """CREATE TABLE joinTeam (
    username VARCHAR(100),
    team INT,
    CONSTRAINT join_pkey
        PRIMARY KEY(username, team),
    CONSTRAINT fk_username
        FOREIGN KEY(username)
            REFERENCES member(username)
            ON DELETE CASCADE,
    CONSTRAINT fk_team
        FOREIGN KEY(team)
            REFERENCES team(id)
            ON DELETE CASCADE
)"""
try:
    cur.execute(dropJoin)
    cur.execute(join)
    conn.commit()

    print("[INFO] Table 'join' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'manage'
dropManage = "DROP TABLE IF EXISTS manage CASCADE"
manage = """CREATE TABLE manage (
    admin VARCHAR(100),
    team INT,
    CONSTRAINT manage_pkey
        PRIMARY KEY(admin, team),
    CONSTRAINT fk_admin
        FOREIGN KEY(admin)
            REFERENCES member(username)
            ON DELETE CASCADE,
    CONSTRAINT fk_team
        FOREIGN KEY(team)
            REFERENCES team(id)
            ON DELETE CASCADE
)"""
try:
    cur.execute(dropManage)
    cur.execute(manage)
    conn.commit()

    print("[INFO] Table 'manage' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'invite'
dropInvite = "DROP TABLE IF EXISTS invite CASCADE"
invite = """CREATE TABLE invite (
    username VARCHAR(100),
    admin VARCHAR(100) NOT NULL,
    team INT,
    CONSTRAINT invite_pkey
        PRIMARY KEY(username, team),
    CONSTRAINT fk_username
        FOREIGN KEY(username)
            REFERENCES member(username)
            ON DELETE CASCADE,
    CONSTRAINT fk_admin_team
        FOREIGN KEY(admin, team)
            REFERENCES manage(admin, team)
            ON DELETE CASCADE
)"""
try:
    cur.execute(dropInvite)
    cur.execute(invite)
    conn.commit()

    print("[INFO] Table 'invite' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


# Table 'includes'
dropIncludes = "DROP TABLE IF EXISTS includes CASCADE"
includes = """CREATE TABLE includes (
    event INT,
    team INT,
    username VARCHAR(100),
    state VARCHAR(50) NOT NULL,
    CONSTRAINT includes_pkey
        PRIMARY KEY(event, team, username),
    CONSTRAINT fk_username
        FOREIGN KEY(username)
            REFERENCES member(username)
            ON DELETE CASCADE,
    CONSTRAINT fk_team
        FOREIGN KEY(team)
            REFERENCES team(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_event
        FOREIGN KEY(event)
            REFERENCES task(id)
            ON DELETE CASCADE,
    CHECK (
        state = 'accepted'
        OR state = 'rejected'
    )
)"""
try:
    cur.execute(dropManage)
    cur.execute(manage)
    conn.commit()

    print("[INFO] Table 'manage' successfully created.")
except Exception as err:
    print("Error: ", err)
    exit()


conn.close()
