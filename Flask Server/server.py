# Import statements
from hashlib import sha256
from flask import Flask, jsonify, request
from flask_cors import CORS
from DBConnection import get_connection
from support import (
    get_current_week_range,
    convert_date,
    get_teams,
    encrypt_username,
    decrypt_username,
)
from flask_socketio import SocketIO, emit, join_room, leave_room
import datetime
from flask_mail import Mail, Message
import time
import requests


# Server setup
app = Flask(__name__)
CORS(app)
socketio = SocketIO(
    app, cors_allowed_origins="http://localhost:3000", async_mode="eventlet"
)


# Middleware per gestire le richieste preflight OPTIONS
@app.before_request
def before_request():
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Credentials": "true",
        }
        return ("", 200, headers)


connected_clients = []
teams = (
    []
)  # List of teams; each team is of the following format: [name, [member1, member2, ..., member10]]

# DB setup
conn = get_connection()
conn.set_session(autocommit=True)
if conn is None:
    print("[ERROR] DB Connection failed.")
    exit()


############################ WEBSOCKET ROUTES ############################
@socketio.on("connect")
def handle_connect():
    global teams

    # If it is the initial state, then retrieve all the database information about teams
    if len(connected_clients) == 0:
        teams = get_teams()
        print("[INFO] Teams retrieved successfully.")


@socketio.on("initial_data")
def handle_initial_data(username):
    username = decrypt_username(username)
    insert = True  # Check whether the request has been sent multiple times

    new_client = (username, request.sid)
    for client in connected_clients:
        (user, req_id) = client
        if user == username:
            insert = False

    if insert == True:
        connected_clients.append(new_client)
        join_room(username)
        print("[INFO] Client connected: " + str(username))


@socketio.on("message")
def handle_message(message):
    print(f"[INFO] Recieved message: {message}")

    # Now send the message to all the connected clients
    emit("message", message, broadcast=True)


@socketio.on("disconnect")
def handle_disconnect():
    disconnected_client = (
        None,
        None,
    )

    for client in connected_clients:
        if client[1] == request.sid:
            disconnected_client = client
            break

    username = disconnected_client[0]
    if username is not None:
        print("[INFO] Client disconnected: " + str(username))
        connected_clients.remove(disconnected_client)
        leave_room(username)


############################ REST APIs ##################################


# Login API
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    encryptedUsername = encrypt_username(username)
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
    return jsonify({"encryptedUsername": encryptedUsername}), 200


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


# Reset request API
@app.route("/resetRequest", methods=["POST"])
def reset_request():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    encryptedUsername = encrypt_username(username)

    # Does that user exist?
    query_exists = "SELECT email FROM member WHERE username = %s"
    param_exists = (username,)
    curr.execute(query_exists, param_exists)
    email = curr.fetchone()
    if str(email) == "":
        print("[ERROR] /reset: User not found.")
        return jsonify("ko"), 404
    email = email[0]
    # The user exists; therefore, I can update his/her credentials.

    mail = Mail(app)

    app.config["MAIL_SERVER"] = "smtp.libero.it"
    app.config["MAIL_PORT"] = 465
    app.config["MAIL_USERNAME"] = "teamify@libero.it"
    app.config["MAIL_PASSWORD"] = "Ciaociao1@"
    app.config["MAIL_USE_TLS"] = False
    app.config["MAIL_USE_SSL"] = True
    mail = Mail(app)

    msg = Message("Password Reset", sender="teamify@libero.it", recipients=[email])
    msg.body = (
        "You have requested to recover your password, here you can proceed with the recovery: http://localhost:3000/reset?encryptedUsername="
        + encryptedUsername
    )
    mail.send(msg)
    # time.sleep(80)

    return jsonify("ok"), 200


# Reset password API
@app.route("/reset", methods=["POST"])
def reset():
    data = request.get_json()
    curr = conn.cursor()

    encryptedUsername = data["encryptedUsername"]
    encryptedUsername = encryptedUsername.replace(" ", "+")
    print(encryptedUsername)
    username = decrypt_username(encryptedUsername)
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
@app.route("/home/delete-account", methods=["POST"])
def delete_account():
    curr = conn.cursor()
    data = request.get_json()
    user = data["username"]
    username = decrypt_username(user)
    # removal the task connected to the user
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


############################ TASK APIs ##################################


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

    # Extract other data from the request
    title = request.json["title"]
    date = request.json["date"]
    time = request.json["time"]
    description = request.json["description"]
    member = request.json["user"]
    member = decrypt_username(member)
    duration = request.json["duration"]
    type_task = request.json["type"]

    # if event
    team_id = request.json["teamId"]
    event_members = request.json["members"]

    # Team name given the id (it is useful for the notifications)
    query_team_name = "SELECT name FROM team WHERE id = %s"
    params_team_name = (team_id,)
    curr.execute(query_team_name, params_team_name)
    (team_name,) = curr.fetchone()
    team_name = str(team_name).strip()

    curr.execute(
        "SELECT username FROM member where username= %s ORDER BY username DESC LIMIT 1",
        (member,),
    )
    member_db = curr.fetchone()

    if not member_db:
        return jsonify("Not auth"), 401

    # Insert the new task with the calculated new_id

    # if is a pernsonal task
    if type_task == "personal":
        query = "INSERT INTO task (id, title, date, time, description, member,duration) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (new_id, title, date, time, description, member, duration)

        try:
            curr.execute(query, values)
        except Exception as err:
            print("[ERROR] /new_task: ", err)
            return jsonify("ko"), 400

        return jsonify({"message": "Task created successfully", "id": new_id}), 200

    else:  # Shared task
        query = "INSERT INTO task (id, title, date, time, description, member, duration,type) VALUES (%s, %s, %s, %s, %s, %s, %s,%s)"
        values = (new_id, title, date, time, description, member, duration, type_task)

        try:
            curr.execute(query, values)
        except Exception as err:
            print("[ERROR] /new_task: ", err)
            return jsonify("ko"), 400

        # here i include the user that creates the event
        query_inclues = (
            "INSERT INTO includes (event,team,username,state) VALUES (%s,%s,%s,%s)"
        )
        params_includes = (new_id, team_id, member, "accepted")

        try:
            curr.execute(query_inclues, params_includes)
        except Exception as err:
            print("[ERROR] /new_event: ", err)
            return jsonify("ko"), 400

        for person in event_members:
            query_inclues_member = (
                "INSERT INTO includes (event,team,username,state) VALUES (%s,%s,%s,%s)"
            )
            params_includes_member = (new_id, team_id, person, "pending")
            try:
                curr.execute(query_inclues_member, params_includes_member)
            except Exception as err:
                print("[ERROR] /new_event (event member): ", err)
                return jsonify("ko"), 400

            if person != member:
                query_notification = "INSERT INTO notification (date, content, type, read, username) VALUES (%s,%s,%s,%s,%s)"
                params_notification = (
                    datetime.datetime.now(),
                    f"{member} of team {team_name} has invited you to join the event '{title}'.",
                    "event",
                    False,
                    person,
                )
                try:
                    curr.execute(query_notification, params_notification)
                    socketio.emit("event_notification", "", room=person)
                except Exception as err:
                    print("[ERROR] /home/newtask: " + err)
                    return jsonify("ko"), 400

        return jsonify({"message": "Task created successfully", "id": new_id}), 200


# Modify a task API
@app.route("/home/updatetask", methods=["POST"])
def update_task():
    data = request.get_json()
    username = data["local_user"]
    task_id = data["task_id"]

    print(request.json)
    curr = conn.cursor()
    username = decrypt_username(username)

    title = data.get("title")
    date = data.get("date")
    time = data.get("time")
    description = data.get("description")
    duration = data.get("duration")

    curr.execute("SELECT * FROM task WHERE id = %s", (task_id,))
    existing_task = curr.fetchone()
    if not existing_task:
        print(existing_task)
        return jsonify({"message": "Task not found"}), 404

    update_query = "UPDATE task SET title = %s, date = %s, time = %s, description = %s, member = %s, duration = %s WHERE id = %s"
    update_values = (title, date, time, description, username, duration, task_id)

    try:
        curr.execute(update_query, update_values)
        conn.commit()
    except Exception as err:
        print("[ERROR] /updatetask: ", err)
        return jsonify({"message": "Update failed"}), 400

    return jsonify({"message": "Task updated successfully"}), 200


# Complete a task API
@app.route("/home/completetask/<int:task_id>", methods=["PUT"])
def complete_task(task_id):
    curr = conn.cursor()

    curr.execute("SELECT * FROM task WHERE id = %s", (task_id,))
    existing_task = curr.fetchone()
    if not existing_task:
        return jsonify({"message": "Task not found"}), 404

    status = existing_task[5]
    if status == "completed":
        change = "not_completed"
    else:
        change = "completed"

    update_query = "UPDATE task SET status = %s WHERE id = %s"
    update_values = (change, task_id)

    try:
        curr.execute(update_query, update_values)
        conn.commit()
    except Exception as err:
        print("[ERROR] /updatetask: ", err)
        return jsonify({"message": "Update failed"}), 400

    return jsonify({"message": "Task change successfully"}, change), 200


# Get all tasks API
@app.route("/tasks", methods=["GET"])
def get_tasks():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user = request.args.get("user")  # get back the params from the request
    local_user = decrypt_username(local_user)
    curr.execute(
        "SELECT title, description, date, time, duration, id, status, type, member FROM task WHERE member = %s AND type=%s",
        (
            local_user,
            "personal",
        ),
    )
    tasks = curr.fetchall()

    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date = convert_date(end_date, task[4])

        tasks_list.append(
            {
                "title": task[0],
                "start": start_date,
                "end": new_end_date,
                "description": task[1],
                "duration": task[4],
                "id": task[5],
                "status": task[6],
                "type": task[7],
                "member": task[8],
            }
        )

    curr.execute(
        "SELECT title, description, date, time, duration, id, status, type, member FROM task WHERE member = %s AND type=%s",
        (
            local_user,
            "event",
        ),
    )
    events = curr.fetchall()

    for event in events:
        curr.execute(
            "SELECT event from includes where event=%s and state=%s",
            (
                event[5],
                "accepted",
            ),
        )
        exist = curr.fetchone()
        if str(exist) != "":
            start_date = (
                event[2].strftime("%Y-%m-%d") + " " + event[3].strftime("%H:%M:%S")
            )
            end_date = (
                event[2].strftime("%Y-%m-%d") + " " + event[3].strftime("%H:%M:%S")
            )

            new_end_date = convert_date(end_date, event[4])

            tasks_list.append(
                {
                    "title": event[0],
                    "start": start_date,
                    "end": new_end_date,
                    "description": event[1],
                    "duration": event[4],
                    "id": event[5],
                    "status": event[6],
                    "type": event[7],
                    "member": event[8],
                }
            )

    return jsonify(tasks_list), 200


# delete a task API
@app.route("/home/deletetask/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    curr = conn.cursor()

    # remove all the task connected to the user
    query_delete = "DELETE FROM task WHERE id = %s"
    param_delete = (task_id,)
    try:
        curr.execute(query_delete, param_delete)
        return jsonify(
            {"message": f"[INFO] /home/deletetask: id {task_id} successfully deleted"}
        )
    except Exception as err:
        print("[ERROR] /home/deletetask : ", err)
        return jsonify("ko"), 400


# Get events/tasks for shared agenda API
@app.route("/teamview", methods=["GET"])
def get_tasks_events():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    local_user = request.args.get("user")  # get back the params from the request
    local_user = decrypt_username(local_user)
    local_team = request.args.get("team")  # da gestire dopo l'implementazione dei team

    curr.execute(
        "SELECT title, description, date, time, duration, id, member, type,status FROM task WHERE member = %s",
        (local_user,),
    )
    tasks = curr.fetchall()

    tasks_list = []
    for task in tasks:
        start_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")
        end_date = task[2].strftime("%Y-%m-%d") + " " + task[3].strftime("%H:%M:%S")

        new_end_date = convert_date(end_date, task[4])

        tasks_list.append(
            {
                "title": task[0],
                "start": start_date,
                "end": new_end_date,
                "id": task[5],
                "description": task[1],
                "member": task[6],
                "status": task[8],
                "type": task[7],
                "duration": task[4],
            }
        )

    if local_team != 0:
        curr.execute(
            "SELECT event FROM includes WHERE username=%s AND state= %s",
            (
                local_user,
                "accepted",
            ),
        )
        events_ids = curr.fetchall()

        for eventid in events_ids:
            print("ID\n", eventid[0])
            curr.execute(
                "SELECT title, description, date, time, duration, id, member, type,status FROM task WHERE id = %s",
                (eventid[0],),
            )
        # TODO: send invite when add members
        events = curr.fetchall()
        # here i get also the id of event i need another query to retrieve event
        for event in events:
            start_date = (
                event[2].strftime("%Y-%m-%d") + " " + event[3].strftime("%H:%M:%S")
            )
            end_date = (
                event[2].strftime("%Y-%m-%d") + " " + event[3].strftime("%H:%M:%S")
            )

            new_end_date = convert_date(end_date, event[4])

            tasks_list.append(
                {
                    "title": event[0],
                    "description": event[1],
                    "start": start_date,
                    "end": new_end_date,
                    "duration": event[4],
                    "id": event[5],
                    "member": event[6],
                    "type": event[7],
                    "status": event[8],
                }
            )
    return jsonify(tasks_list), 200


############################ END TASK APIs ##################################


# Get the list of teams releted to a certain user
@app.route("/home/teams", methods=["GET"])
def team_list():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    user = request.args.get("user")
    user = decrypt_username(user)
    curr.execute(
        "SELECT team id, name, description FROM joinTeam JOIN team ON team.id=joinTeam.team WHERE username = %s ORDER BY name",
        (user,),
    )
    entries = curr.fetchall()
    teams = []
    for entry in entries:
        curr.execute(
            "SELECT admin from manage where team= %s and admin= %s",
            (
                entry[0],
                user,
            ),
        )
        admin = curr.fetchall()
        isAdmin = len(admin)
        if isAdmin == 0:
            isAdmin = "Member"
        else:
            isAdmin = "Administrator"
        teams.append(
            {"id": entry[0], "name": entry[1], "description": entry[2], "role": isAdmin}
        )

    return jsonify(teams), 200


# Get joined teams from username
@app.route("/getJoinedTeams", methods=["POST"])
def get_joined_teams():
    data = request.get_json()
    curr = conn.cursor()
    teams = []

    username = data["username"]
    username = decrypt_username(username)
    query = "SELECT team.name FROM joinTeam JOIN team ON joinTeam.team = team.id WHERE username = %s"
    params = (username,)

    curr.execute(query, params)

    teams = curr.fetchall()
    if not teams:
        print("[INFO] No joined team.")
        return jsonify({"message": "No joined team.", "status": 201})

    return jsonify({"teams": teams, "status": 200})


# team details given team id
@app.route("/teamDetails", methods=["GET"])
def team_details():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    id = request.args.get("id")
    curr.execute(
        "SELECT name, description FROM team WHERE id = %s",
        (id,),
    )
    teamData = curr.fetchone()

    curr.execute(
        "SELECT username FROM joinTeam WHERE team = %s",
        (id,),
    )
    members = curr.fetchall()
    members2 = []
    for member in members:
        members2.append(member[0])

    curr.execute(
        "SELECT admin FROM manage WHERE team = %s",
        (id,),
    )
    admins = curr.fetchall()
    admins2 = []
    for admin in admins:
        admins2.append(admin[0])

    diff = []
    for element in members2:
        if element not in admins2:
            diff.append(element)

    result = []
    result.append(
        {
            "teamName": teamData[0],
            "description": teamData[1],
            "members": diff,
            "admins": admins2,
        }
    )

    return jsonify(result), 200


# Create a team
@app.route("/home/newteam", methods=["POST"])
def team_create():
    curr = conn.cursor()

    data = request.get_json()
    username = data["username"]
    username = decrypt_username(username)
    name = data["name"]
    description = data["description"]

    # Fetch the ID of the last inserted task
    curr.execute(
        "INSERT INTO team (name, description) VALUES (%s,%s)",
        (
            name,
            description,
        ),
    )
    curr.execute(
        "SELECT id FROM team WHERE name=%s AND description=%s",
        (
            name,
            description,
        ),
    )
    id = curr.fetchall()[0]
    curr.execute(
        "INSERT INTO joinTeam (team, username) VALUES (%s,%s)",
        (
            id,
            username,
        ),
    )
    curr.execute(
        "INSERT INTO manage (team, admin) VALUES (%s,%s)",
        (
            id,
            username,
        ),
    )

    return jsonify("ok"), 200


# ottenere la lista degli admin dato un team id
@app.route("/adminGivenTeam", methods=["GET"])
def admin_given_team():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    teamId = request.args.get("teamId")  # get back the params from the request
    curr.execute(
        "SELECT admin FROM manage WHERE team = %s",
        (teamId,),
    )
    admins = curr.fetchall()

    admin_list = []
    for admin in admins:
        admin_list.append({"admin": admin[0]})

    return jsonify(admin_list), 200


# ottenere la lista dei membri dato un team id
@app.route("/membersGivenTeam", methods=["GET"])
def members_given_team():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    teamId = request.args.get("teamId")  # get back the params from the request
    curr.execute(
        "SELECT username FROM joinTeam WHERE team = %s",
        (teamId,),
    )
    members = curr.fetchall()

    member_list = []
    for member in members:
        member_list.append({"member": member[0]})

    return jsonify(member_list), 200


# leave a team API
@app.route("/home/teams/leaveteam", methods=["DELETE"])
def exit_from_team():
    team_id = request.args.get("teamId")
    username = request.args.get("username")

    curr = conn.cursor()

    query_delete = "DELETE FROM joinTeam WHERE username = %s and team=%s"
    param_delete = (username, team_id)

    try:
        curr.execute(query_delete, param_delete)

        return jsonify(
            {"message": f"[INFO] /home/exitfromteam: id {team_id} successfully left"}
        )
    except Exception as err:
        print("[ERROR] /home/deletetask : ", err)
        return jsonify("ko"), 400


# delete a team API
@app.route("/home/teams/deleteteam", methods=["DELETE"])
def delete_team():
    team_id = request.args.get("teamId")

    curr = conn.cursor()

    query_delete = "DELETE FROM team WHERE id = %s "
    param_delete = (team_id,)

    try:
        curr.execute(query_delete, param_delete)
        return jsonify(
            {"message": f"[INFO] /home/deleteteam: id {team_id} successfully delete"}
        )
    except Exception as err:
        print("[ERROR] /home/deleteteam : ", err)
        return jsonify("ko"), 400


# ottenere la lista dei membri dato un team id
@app.route("/teamGivenID", methods=["GET"])
def team_given_id():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    teamId = request.args.get("id")  # get back the params from the request
    curr.execute(
        "SELECT name FROM team WHERE id = %s",
        (teamId,),
    )
    (name,) = curr.fetchone()
    name = str(name).strip()

    return jsonify({"name": name, "status": 200})


# get the list of members of a certain team given an event id
@app.route("/home/team/member", methods=["GET"])
def team_members_given_event_id():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    eventID = request.args.get("id")  # get back the params from the request
    curr.execute(
        "SELECT team FROM includes WHERE event = %s",
        (eventID,),
    )
    (team_id,) = curr.fetchone()
    team_id = str(team_id).strip()
    curr.execute(
        "SELECT username FROM joinTeam WHERE team = %s",
        (team_id,),
    )
    members = curr.fetchall()

    member_list = []
    for member in members:
        member_list.append({"member": member[0]})

    print(member_list)

    return jsonify({"member_list": member_list, "status": 200})


# edit member API
@app.route("/home/team/event/editmember", methods=["POST"])
def edit_member_event():
    curr = conn.cursor()
    data = request.get_json()  # Fetch the ID of the last inserted task
    event_id = data["id"]  # get back the params from the request
    new_members = data["members"]
    admin = data["admin"]
    new_set = []
    for member in new_members:
        if member != "member":
            new_set.append(member)

    curr.execute(
        "SELECT username, team FROM includes WHERE event = %s",
        (event_id,),
    )
    members = curr.fetchall()
    member_list = []
    for member in members:
        member_list.append(member[0])
        team_id = member[1]

    for member in member_list:
        if member not in new_set and member != admin:
            query_member = "DELETE FROM includes WHERE username = %s"
            param_member = (member,)
            try:
                curr.execute(query_member, param_member)
            except Exception as err:
                print("[ERROR] /home/team/event/editmember:", err)
                return jsonify("ko"), 400

    for member in new_set:
        if member not in member_list:
            query_member = "INSERT INTO includes (event,team,username) VALUES(%s,%s,%s)"
            param_member = (event_id, team_id, member)
            try:
                curr.execute(query_member, param_member)
            except Exception as err:
                print("[ERROR] /home/team/event/editmemeber: (insert:)", err)
                return jsonify("ko"), 400

    # TODO: here we must send the invites

    return jsonify({"member_list": member_list, "status": 200})


# Get list of members included in a certain event the one that accepted
@app.route("/home/event/members", methods=["get"])
def members_given_event():
    curr = conn.cursor()
    # Fetch the ID of the last inserted task
    event_id = request.args.get("eventId")  # get back the params from the request
    curr.execute(
        "SELECT username FROM includes WHERE event = %s AND state = %s",
        (
            event_id,
            "accepted",
        ),
    )
    members = curr.fetchall()

    member_list = []
    for member in members:
        member_list.append({"member": member[0]})

    return jsonify(member_list), 200


# Display user information
@app.route("/home/profile", methods=["POST"])
def show_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    username = decrypt_username(username)
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
    username = decrypt_username(username)
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
    username = decrypt_username(username)
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


# Display user notifications
@app.route("/home/notifications", methods=["POST"])
def get_notifications():
    data = request.get_json()
    curr = conn.cursor()
    records = []

    username = data["username"]
    username = decrypt_username(username)
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


# Read the notification
@app.route("/readNotification", methods=["POST"])
def read_notification():
    data = request.get_json()
    curr = conn.cursor()

    id = data["notification_id"]

    query_exists = "SELECT read FROM notification WHERE id = %s"
    params = (id,)

    curr.execute(query_exists, params)
    try:
        (read,) = curr.fetchone()
        if read == False:
            query_read = "UPDATE notification SET read = true WHERE id = %s"
            try:
                curr.execute(query_read, params)
                print(
                    "[INFO] /readNotification: The notification has been read successfully."
                )
            except Exception as err:
                print(
                    "[ERROR] /readNotification: The notification has not been read successfully. Err: "
                    + str(err)
                )
                return (
                    jsonify(
                        {
                            "message": "The notification has not been read successfully.",
                            "status": 400,
                        }
                    ),
                    400,
                )
    except Exception as err:
        print(
            "[ERROR] /readNotification: The notification does not exist. Err: "
            + str(err)
        )
        return (
            jsonify({"message": "The notification does not exist.", "status": 500}),
            500,
        )

    return (
        jsonify(
            {"message": "The notification has been read successfully.", "status": 200}
        ),
        200,
    )


# given team id and username, invites the user to the team
@app.route("/invite", methods=["POST"])
def invite():
    data = request.get_json()
    curr = conn.cursor()

    username = data["username"]
    id = data["id"]
    admin = data["admin"]
    admin = decrypt_username(admin)

    query_invite = "INSERT INTO invite (username, admin, team) VALUES (%s,%s,%s)"
    params_invite = (
        username,
        admin,
        id,
    )

    curr.execute("SELECT name FROM team WHERE id = %s", (id,))
    (name,) = curr.fetchone()
    name = str(name).strip()

    query_notification = "INSERT INTO notification (date, content, type, read, username) VALUES (%s,%s,%s,%s,%s)"
    params_notification = (
        datetime.datetime.now(),
        f"{admin} has invited you to join team {name}.",
        "invite",
        False,
        username,
    )

    try:
        curr.execute(query_invite, params_invite)
        print("[INFO] /invite: User invited successfully.")
        try:
            curr.execute(query_notification, params_notification)
            print("[INFO] /invite: Invite notification registered.")
            socketio.emit("invite_notification", "", room=username)

            return jsonify("ok"), 200
        except Exception as err:
            print("[ERROR] Invite notification not registered. Err = " + str(err))
            return jsonify("ko"), 400
    except Exception as err:
        print("[ERROR] User not invited. Err = " + str(err))
        return jsonify("ko"), 400


# given username, check invites of user
@app.route("/checkInvites", methods=["POST"])
def check_invites():
    curr = conn.cursor()
    data = request.get_json()

    username = data["username"]
    username = decrypt_username(username)
    curr.execute(
        "SELECT admin, team id, name, description FROM invite JOIN team on team.id=invite.team WHERE username = %s ORDER BY name",
        (username,),
    )
    invites = curr.fetchall()
    invitesJson = []
    for invite in invites:
        invitesJson.append(
            {
                "admin": invite[0],
                "id": invite[1],
                "team_name": invite[2],
                "team_description": invite[3],
            }
        )
    return jsonify({"invites": invitesJson, "status": 200})


# Given username, check event invites of the user
@app.route("/checkEventInvites", methods=["POST"])
def check_event_invites():
    curr = conn.cursor()
    data = request.get_json()

    username = data["username"]
    username = decrypt_username(username)
    curr.execute(
        """
        SELECT includes.event, includes.team, includes.username, includes.state, task.title, task.description, task.member
        FROM includes JOIN task ON task.id=includes.event 
        WHERE username = %s
        AND includes.state = 'pending'
        """,
        (username,),
    )
    invites = curr.fetchall()
    invitesJson = []
    for invite in invites:
        invitesJson.append(
            {
                "event_id": invite[0],
                "team_id": invite[1],
                "member": invite[2],
                "state": invite[3],
                "event_title": invite[4],
                "event_description": invite[5],
                "admin": invite[6],
            }
        )
    return jsonify({"invites": invitesJson, "status": 200})


# given team id and username, user accepts invite and therefore joins team
@app.route("/acceptInvite", methods=["POST"])
def accept_invite():
    curr = conn.cursor()
    data = request.get_json()
    username = data["username"]
    username = decrypt_username(username)
    id = data["teamId"]
    curr.execute(
        "SELECT * from invite WHERE username=%s AND team=%s",
        (
            username,
            id,
        ),
    )
    if curr.fetchone():
        curr.execute(
            "DELETE FROM invite WHERE username=%s AND team=%s",
            (
                username,
                id,
            ),
        )
        curr.execute(
            "INSERT INTO joinTeam (username,team) values (%s,%s)",
            (
                username,
                id,
            ),
        )
        return jsonify({"message": "ok", "status": 200})
    else:
        return jsonify("ko"), 400


@app.route("/acceptEventInvite", methods=["POST"])
def accept_event_invite():
    curr = conn.cursor()
    data = request.get_json()

    username = data["username"]
    username = decrypt_username(username)
    event_id = data["event_id"]
    team_id = data["teamId"]

    query_update_event_invite = """
    UPDATE includes 
    SET state = 'accepted' 
    WHERE username = %s 
    AND event = %s
    AND team = %s
    """
    params_update_event_invite = (username, event_id, team_id)

    try:
        curr.execute(query_update_event_invite, params_update_event_invite)
        print("[INFO] Event acceptance successfully updated!")
    except Exception as err:
        print("[ERROR] /acceptEventInvite: " + err)
        return jsonify({"message": "Update of event acceptance failed.", "status": 500})

    return jsonify({"message": "Event successfully joined!", "status": 200})


@app.route("/rejectInvite", methods=["POST"])
def reject_invite():
    curr = conn.cursor()
    data = request.get_json()

    username = data["username"]
    username = decrypt_username(username)
    id = data["teamId"]
    admin = data["admin"]

    curr.execute(
        "SELECT * from invite WHERE username=%s AND team=%s",
        (
            username,
            id,
        ),
    )
    if curr.fetchone():
        curr.execute(
            "DELETE FROM invite WHERE username=%s AND team=%s",
            (
                username,
                id,
            ),
        )

        # If the user refuses my message, I get notified
        query_notification = "INSERT INTO notification (date, content, type, read, username) VALUES (%s,%s,%s,%s,%s)"
        params_notification = (
            datetime.datetime.now(),
            f"{username} has not accepted your invite.",
            "message",
            False,
            admin,
        )
        curr.execute(query_notification, params_notification)
        socketio.emit("message_notification", "", room=admin)

        return jsonify({"message": "ok", "status": 200})
    else:
        return jsonify("ko"), 400


@app.route("/rejectEventInvite", methods=["POST"])
def reject_event_invite():
    curr = conn.cursor()
    data = request.get_json()

    username = data["username"]
    username = decrypt_username(username)
    event_id = data["event_id"]
    team_id = data["teamId"]
    admin = data["admin"]
    event_name = data["event_title"]

    query_update_event_invite = """
    UPDATE includes 
    SET state = 'rejected' 
    WHERE username = %s 
    AND event = %s
    AND team = %s
    """
    params_update_event_invite = (username, event_id, team_id)

    try:
        curr.execute(query_update_event_invite, params_update_event_invite)
        print("[INFO] Event acceptance successfully updated!")

        # If the user refuses my message, I get notified
        query_notification = "INSERT INTO notification (date, content, type, read, username) VALUES (%s,%s,%s,%s,%s)"
        params_notification = (
            datetime.datetime.now(),
            f"{username} will not join the event {event_name}.",
            "message",
            False,
            admin,
        )
        curr.execute(query_notification, params_notification)
        socketio.emit("message_notification", "", room=admin)
    except Exception as err:
        print("[ERROR] /acceptEventInvite: " + err)
        return jsonify({"message": "Update of event acceptance failed.", "status": 500})

    return jsonify({"message": "Event successfully rejected.", "status": 200})


############################ END REST APIs ####################################

if __name__ == "__main__":
    # app.run(debug=True, host="localhost", port=5000)
    socketio.run(app, host="localhost", port=5000, debug=True)
