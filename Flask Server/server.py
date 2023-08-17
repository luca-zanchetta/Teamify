# Import statements
from hashlib import sha256
from flask import Flask, jsonify, request
from flask_cors import CORS
from DBConnection import get_connection

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
    try:
        (retrieved_password,) = curr.fetchone()
        retrieved_password = retrieved_password.strip()     # There were some \n without any sense

        if encoded_password != retrieved_password:
            print("[ERROR] /login: Wrong password.")
            return jsonify("ko"), 400
        
    except Exception:
        print("[ERROR] /login: User not found.")
        return jsonify("not found"), 404

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



# Display user information
@app.route("/home", methods=['POST'])
def show_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data['username']
    if username != "":
        query = "SELECT name, surname, birth_date, email FROM member WHERE username = %s"
        params = (username,)

        curr.execute(query, params)
        (name, surname, birth, email) = curr.fetchone()
        name = str(name).strip()
        surname = str(surname).strip()
        birth = str(birth).strip()
        email = str(email).strip()

        return jsonify({"name":name, "surname":surname, "birth":birth, "email":email}), 200
    return jsonify("ko"), 404



# Modify user information
# Notice that here we are not modifying the password, as there exists the specific REST API /reset
@app.route("/home/modify-info", methods=['POST'])
def modify_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data['username']
    name = data['name']
    surname = data['surname']
    birth_date = data['birth_date']
    email = data['email']

    if username != "":
        query = "UPDATE member SET name = %s, surname = %s, birth_date = %s, email = %s WHERE username = %s"
        params = (name, surname, birth_date, email, username,)

        try: 
            curr.execute(query, params)
        except Exception as err:
            print("[ERROR] /home/modify-info: ", err)
            return jsonify("ko"), 400
        
        print("[INFO] /home/modify-info: Update was successful.")
        return jsonify("ok"), 200   # Here we should redirect to /home at the frontend!

    return jsonify("ko"), 404



# Delete user account (cascade on all its foreign keys!)
@app.route("/home/delete-account", methods=['POST'])
def modify_personal_info():
    data = request.get_json()
    curr = conn.cursor()

    username = data['username']
    if username != "":
        query = "DELETE FROM member WHERE username = %s"
        params = (username,)

        try: 
            curr.execute(query, params)
        except Exception as err:
            print("[ERROR] /home/delete-account: ", err)
            return jsonify("ko"), 400
        
        print("[INFO] /home/delete-account: User was successfully removed.")
        return jsonify("ok"), 200   # Here we should redirect to /login at the frontend!

    return jsonify("ko"), 404


############################ END REST APIs ####################################

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)