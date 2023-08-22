# Import statements
from hashlib import sha256
from flask import Flask, jsonify, request
from flask_cors import CORS
from DBConnection import get_connection
from support import get_current_week_range, convert_date
import psycopg2
from psycopg2 import errors


# Flask setup
app = Flask(__name__)
CORS(app)


# DB setup
conn = get_connection()
conn.set_session(autocommit=True)
if conn is None:
    print("[ERROR] DB Connection failed.")
    exit()


############################ REST APIs ##################################


# Login API
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    password = data["password"]
    encoded_password = sha256(str(password).encode("utf-8")).hexdigest()

    query = "SELECT password FROM member WHERE username = %s"
    params = (username,)
    curr.execute(query, params)
    try:
        (retrieved_password,) = curr.fetchone()
        retrieved_password = (
            retrieved_password.strip()
        )  # There were some \n without any sense

        if encoded_password != retrieved_password:
            print("[ERROR] /login: Wrong password.")
            return jsonify("ko"), 400

    except Exception:
        print("[ERROR] /login: User not found.")
        return jsonify("not found"), 404

    print("[INFO] /login: Login performed.")
    return jsonify("ok"), 200


# Signup API
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    curr = conn.cursor()

    name = data["name"]
    surname = data["surname"]
    birth_date = data["birth"]
    email = data["email"]
    username = data["username"]
    password = data["password"]

    encoded_password = sha256(str(password).encode("utf-8")).hexdigest()

    query = "INSERT INTO member VALUES (%s, %s, %s, %s, %s, %s)"
    params = (name, surname, birth_date, email, username, encoded_password)
    try:
        curr.execute(query, params)
    except Exception as err:
        print("[ERROR] /signup: ", err)
        return jsonify("ko"), 400

    print("[INFO] /signup: New user created.")
    return jsonify("ok"), 200


# Reset password API
@app.route("/reset", methods=["POST"])
def reset():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    new_password = data["password"]
    new_encoded_password = sha256(str(new_password).encode("utf-8")).hexdigest()

    # Does that user exist?
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


# Delete account
@app.route("/home/delete-account", methods=["DELETE"])
def delete_account():
    curr = conn.cursor()

    username = request.args.get("user")

    # remove all the task connected to the user
    query_task = "DELETE FROM task WHERE member = %s"
    param_task = (username,)
    try:
        curr.execute(query_task, param_task)
    except Exception as err:
        print("[ERROR] /home/profile (tasks): ", err)
        return jsonify("ko"), 400

    # remove the user
    query_member = "DELETE FROM member WHERE username = %s"
    param_member = (username,)
    try:
        curr.execute(query_member, param_member)
    except Exception as err:
        print("[ERROR] /home/profile: (member:)", err)
        return jsonify("ko"), 400

    print("[INFO] /home/profile: user {username} succesfully deleted")
    return jsonify("ok"), 200


# New Task API
@app.route("/home/newtask", methods=["POST"])
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
    member = request.json["user"]
    duration = request.json["duration"]

    curr.execute(
        "SELECT username FROM member where username= %s ORDER BY username DESC LIMIT 1",
        (member,),
    )
    member_db = curr.fetchone()

    if not member_db:
        return jsonify("Not auth"), 401

    # Insert the new task with the calculated new_id
    # print(type(new_id),type(title),type(date),type(time),type(description),type(user))
    query = "INSERT INTO task (id, title, date, time, description, member,duration) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    values = (new_id, title, date, time, description, member, duration)

    try:
        curr.execute(query, values)
    except Exception as err:
        print("[ERROR] /new_task: ", err)
        return jsonify("ko"), 400

    return jsonify({"message": "Task created successfully", "id": new_id}), 200


# Get all tasks API
@app.route("/tasks", methods=["GET"])
def get_tasks():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user = request.args.get("user")  # get back the params from the request
    curr.execute(
        "SELECT title, description, date, time, duration FROM task WHERE member = %s",
        (local_user,),
    )
    tasks = curr.fetchall()

    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date = convert_date(end_date, task[4])

        tasks_list.append({"title": task[0], "start": start_date, "end": new_end_date})

    return jsonify(tasks_list), 200


# Get events/tasks for shared agenda
# GESTIONE DA FINIRE PER MANCANZA TEAM
@app.route("/teamview", methods=["GET"])
def get_tasks_events():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user = request.args.get("user")  # get back the params from the request
    local_team = request.args.get("team")  # da gestire dopo l'implementazione dei team

    curr.execute(
        "SELECT title, description, date, time, duration FROM task WHERE member = %s",
        (local_user,),
    )
    tasks = curr.fetchall()

    # curr.execute("SELECT title, description, date, time, duration FROM events WHERE team = %s", (local_team,))
    # events = curr.fetchall()

    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date = convert_date(end_date, task[4])

        tasks_list.append({"title": task[0], "start": start_date, "end": new_end_date})

    return jsonify(tasks_list), 200


# Get the list of teams releted to a certain user
@app.route("/home/teams", methods=["GET"])
def team_list():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    user = request.args.get("user")
    curr.execute(
        "SELECT team, name FROM joinTeam JOIN team ON team.id=joinTeam.team WHERE username = %s",
        (user,),
    )
    ids = curr.fetchall()
    teams = []
    for id in ids:
        curr.execute("SELECT username FROM joinTeam WHERE team = %s", (id[0],))
        members = curr.fetchall()
        teams.append({"name": id[1], "description": "test", "members": members})

    return jsonify(teams), 200


# Display user information
@app.route("/home/profile", methods=["POST"])
def show_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    if username != "":
        query = "SELECT name, surname, birth_date, email, password FROM member WHERE username = %s"
        params = (username,)

        curr.execute(query, params)
        (name, surname, birth, email, password) = curr.fetchone()
        name = str(name).strip()
        surname = str(surname).strip()
        birth = str(birth).strip()
        email = str(email).strip()
        password = str(password).strip()

        print("[INFO] /home/profile: User data have been successfully displayed.")
        return (
            jsonify(
                {
                    "name": name,
                    "surname": surname,
                    "birth": birth,
                    "email": email,
                    "password": password,
                }
            ),
            200,
        )

    return jsonify("ko"), 404


# Modify user information
# Notice that here we are not modifying the password
@app.route("/home/modify-info", methods=["POST"])
def modify_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    name = data["new_name"]
    surname = data["new_surname"]
    birth_date = data["new_birth"]
    email = data["new_email"]

    if username != "":
        query = "UPDATE member SET name = %s, surname = %s, birth_date = %s, email = %s WHERE username = %s"
        params = (
            name,
            surname,
            birth_date,
            email,
            username,
        )

        try:
            curr.execute(query, params)
            print("[INFO] /home/modify-info: Update was successful.")
            return jsonify({"message": "User data has been updated!", "status": 200})

        except Exception as err:
            print("[ERROR] /home/modify-info: ", err)
            return jsonify({"message": "Error during data update.", "status": 500})

    print("[ERROR] /home/modify-info: Username not found.")
    return jsonify({"message": "User not found.", "status": 404})


# Modify user password
# Notice that here we modify the password of a logged user
@app.route("/home/modify-password", methods=["POST"])
def modify_password():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    old_password = data["old_password"]
    new_password = data["new_password"]

    encoded_old_password = sha256(str(old_password).encode("utf-8")).hexdigest()

    if username != "":
        # Does the user have inserted the correct password?
        query_verify = "SELECT username FROM member WHERE password = %s"
        params_verify = (encoded_old_password,)

        curr.execute(query_verify, params_verify)

        # There can be more than one username with the same password
        retrieved_username = ""
        retrieved_usernames = curr.fetchall()
        for (user,) in retrieved_usernames:
            if user == username:
                retrieved_username = username

        if retrieved_username == "":
            print(
                "[ERROR] /home/modify-password: The original password was not correct!"
            )
            return jsonify(
                {"message": "The original password was not correct!", "status": 400}
            )

        if retrieved_username == username:
            encoded_new_password = sha256(str(new_password).encode("utf-8")).hexdigest()
            query = "UPDATE member SET password = %s WHERE username = %s"
            params = (
                encoded_new_password,
                username,
            )

            try:
                curr.execute(query, params)
                print("[INFO] /home/modify-password: Update was successful.")
                return jsonify({"message": "Password has been updated!", "status": 200})

            except Exception as err:
                print("[ERROR] /home/modify-password: ", err)
                return jsonify(
                    {"message": "Error during password update.", "status": 500}
                )

    print("[ERROR] /home/modify-password: Username not found.")
    return jsonify({"message": "User not found.", "status": 404})


# Delete user account (cascade on all its foreign keys!)
# @app.route("/home/delete-account", methods=['POST'])
# def delete_account():
#     data = request.get_json()
#     curr = conn.cursor()

#     username = data['username']
#     if username != "":
#         query = "DELETE FROM member WHERE username = %s"
#         params = (username,)

#         try:
#             curr.execute(query, params)
#         except Exception as err:
#             print("[ERROR] /home/delete-account: ", err)
#             return jsonify("ko"), 400

#         print("[INFO] /home/delete-account: User was successfully removed.")
#         return jsonify("ok"), 200   # Here we should redirect to /login at the frontend!

#     print("[ERROR] /home/delete-account: Username not found.")
#     return jsonify("ko"), 404


# Display user notifications
@app.route("/home/notifications", methods=["POST"])
def get_notifications():
    data = request.get_json()
    curr = conn.cursor()
    records = []

    username = data["username"]
    if username != "":
        query = (
            "SELECT id, date, content, type, read FROM notification WHERE username = %s"
        )
        params = (username,)
        curr.execute(query, params)

        records = curr.fetchall()
        if len(records) == 0:
            print("[INFO] /home/notifications: There is no notification for this user.")
            return jsonify({"message": "No notification available.", "status": 201})

        print("[INFO] /home/notifications: Display notifications was successful.")
        return jsonify({"notifications": records, "status": 200})

    print("[ERROR] /home/notifications: Username not found.")
    return jsonify({"message": "Username not found.", "status": 404})


############################ END REST APIs ####################################

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
