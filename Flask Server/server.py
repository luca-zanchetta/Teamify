from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/")
def members():
    return { "test" : "test"}


@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    username = data['username']
    password = data['password']

    return jsonify({'username':username, 'password':password}), 200


@app.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()

    name = data['name']
    surname = data['surname']
    birth_date = data['birth']
    email = data['email']
    username = data['username']
    password = data['password1']
    
    return jsonify({'name':name, 'surname':surname,
                    'birth':birth_date, 'email':email,
                    'username':username, 'password':password}), 200


if __name__ == "__main__":
    app.run(debug=True)