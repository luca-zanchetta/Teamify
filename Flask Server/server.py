# Import statements
from hashlib import sha256
from flask import Flask, jsonify, request
from flask_cors import CORS #aggiunta
from DBConnection import get_connection
from support import get_current_week_range,convert_date
import psycopg2
from psycopg2 import errors

# Flask setup
app = Flask(__name__)
CORS(app) #aggiunta 
# DB setup
conn = get_connection()
conn.set_session(autocommit=True)
if conn is None:
    print("[ERROR] DB Connection failed.")
    exit()


# REST APIs

# unknown
@app.route("/")
def members():
    return { "test" : "test"}


# Login API
@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    curr = conn.cursor()

    username = data['username']
    password = data['password']
    encoded_password = sha256(str(password).encode('utf-8')).hexdigest()

    query = "SELECT password FROM member WHERE username = %s"
    params = (username,)
    curr.execute(query, params)
    (retrieved_password,) = curr.fetchone()
    retrieved_password = retrieved_password.strip()     # There were some \n without any sense

    if retrieved_password == "":
        print("[ERROR] /login: User not found.")
        return jsonify("not found"), 404
    elif encoded_password != retrieved_password:
        print("[ERROR] /login: Wrong password.")
        return jsonify("ko"), 400

    print("[INFO] /login: Login performed.")
    return jsonify("ok"), 200


# Signup API
@app.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    curr = conn.cursor()

    name = data['name']
    surname = data['surname']
    birth_date = data['birth']
    email = data['email']
    username = data['username']
    password = data['password']

    encoded_password = sha256(str(password).encode('utf-8')).hexdigest()

    query = "INSERT INTO member VALUES (%s, %s, %s, %s, %s, %s)"
    params = (name, surname, birth_date, email, username, encoded_password)
    try: 
        curr.execute(query, params)
    except Exception as err:
        print("[ERROR] /signup: ", err)
        return jsonify("ko"), 400

    print('[INFO] /signup: New user created.')
    return jsonify("ok"), 200


# Reset password API
@app.route("/reset", methods=['POST'])
def reset():
    data = request.get_json()
    curr = conn.cursor()

    username = data['username']
    new_password = data['password']
    new_encoded_password = sha256(str(new_password).encode('utf-8')).hexdigest()

    # Is there that user exist?
    query_exists = "SELECT username FROM member WHERE username = %s"
    param_exists = (username,)
    curr.execute(query_exists, param_exists)
    retrieved_username = str(curr.fetchone()).strip()
    if retrieved_username == "":
        print("[ERROR] /reset: User not found.")
        return jsonify("ko"), 404

    # The user exists; therefore, I can update his/her credentials.
    query_update = "UPDATE member SET password = %s WHERE username = %s"
    params_update = (new_encoded_password, username)
    try:
        curr.execute(query_update, params_update)
    except Exception as err:
        print("[ERROR] /reset: ", err)
        return jsonify("ko"), 400
    
    print("[INFO] /reset: Reset password was successful.")
    return jsonify("ok"), 200



#New Task API
@app.route("/newtask", methods=["POST"])
def create_new_task():
    curr = conn.cursor()

    # Fetch the ID of the last inserted task
    curr.execute("SELECT id FROM task ORDER BY id DESC LIMIT 1")
    last_id = curr.fetchone()

    if last_id:
        new_id = last_id[0] + 1
    else:
        new_id = 1

    print(new_id)
    # Extract other data from the request
    title = request.json["title"]
    date = request.json["date"]
    time = request.json["time"]
    description = request.json["description"]
    member=request.json["user"]
    duration=request.json["duration"]

    curr.execute("SELECT username FROM member where username= %s ORDER BY username DESC LIMIT 1",(member,))
    member_db = curr.fetchone()

    if not member_db:
        return jsonify("Not auth"), 401
    

    # Insert the new task with the calculated new_id
   # print(type(new_id),type(title),type(date),type(time),type(description),type(user))
    query="INSERT INTO task (id, title, date, time, description, member,duration) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    values=(new_id, title, date, time, description, member,duration)
    
    try: 
        curr.execute(query, values)
    except Exception as err:
        print("[ERROR] /new_task: ", err)
        return jsonify("ko"), 400

    return jsonify({"message": "Task created successfully", "id": new_id}), 200

#Get all tasks API
@app.route("/tasks", methods=["GET"])
def get_tasks():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user=request.args.get("user") #get back the params from the request 
    curr.execute("SELECT title, description, date, time, duration FROM task WHERE member = %s", (local_user,))
    tasks = curr.fetchall()
    
    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date= convert_date(end_date, task[4])
        
        tasks_list.append({
            "title": task[0],
            "start": start_date,
            "end": new_end_date
        })


    return jsonify(tasks_list), 200


#Get events/tasks for shared agenda
#GESTIONE DA FINIRE PER MANCANZA TEAM
@app.route("/teamview", methods=["GET"])
def get_tasks_events():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user=request.args.get("user") #get back the params from the request 
    local_team= request.args.get("team") #da gestire dopo l'implementazione dei team

    curr.execute("SELECT title, description, date, time, duration FROM task WHERE member = %s", (local_user,))
    tasks = curr.fetchall()

    #curr.execute("SELECT title, description, date, time, duration FROM events WHERE team = %s", (local_team,))
    #events = curr.fetchall()
    
    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date= convert_date(end_date, task[4])
        
        tasks_list.append({
            "title": task[0],
            "start": start_date,
            "end": new_end_date
        })


    return jsonify(tasks_list), 200


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000) #modifica con aggiunta host e port