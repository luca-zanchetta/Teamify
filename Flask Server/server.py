# Import statements
from hashlib import sha256
from flask import Flask, jsonify, request
from DBConnection import get_connection

# Flask setup
app = Flask(__name__)

# DB setup
return_message = ""
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

    if retrieved_password == "":
        return jsonify("not found"), 404
    elif encoded_password != retrieved_password:
        return jsonify("ko"), 400

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
        print('[INFO] /login: New user created.')
        return_message = "ok"
    except Exception as err:
        print("[ERROR] /login: ", err)
        return_message = "ko"

    if(return_message == "ko"):
        return jsonify(return_message), 400

    return jsonify(return_message), 200



if __name__ == "__main__":
    app.run(debug=True)