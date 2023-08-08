from flask import Flask

app = Flask(__name__)


@app.route("/")
def members():
    
    return { "test" : "test"}


if __name__ == "__main__":
    app.run(debug=True)