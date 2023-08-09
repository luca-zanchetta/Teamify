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


if __name__ == "__main__":
    app.run(debug=True)