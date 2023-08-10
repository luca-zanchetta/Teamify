from flask import Flask
import psycopg2

app = Flask(__name__)

@app.route('/')
def index():
    # Create connection
    conn = psycopg2.connect(host="localhost", port=5432, user="postgres", password="psw")
    conn.set_session(autocommit=True)
    cur = conn.cursor()
    if not conn:
        return "Error during db connection/a>"

    dropDB = "DROP DATABASE IF EXISTS teamify"
    createDB = "CREATE DATABASE teamify"

    cur.execute(dropDB)
    try:
        cur.execute(createDB)
        return "<h3 style=\"color:green;\">DB created</h3>"
    except Exception as err:
        return "<h3 style=\"color:red; display:inline\">Error: </h3>" + err

if __name__ == '__main__':
    app.run()
