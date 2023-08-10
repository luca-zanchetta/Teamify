from flask import Flask, render_template
from DBConnection import get_connection

app = Flask(__name__)

@app.route('/')
def index():
    conn = get_connection()
    if conn is None:
        return "Error in db connection"
    cur = conn.cursor()
    dropTable = "DROP TABLE IF EXISTS member"
    table = """CREATE TABLE member (
        email VARCHAR(100) NOT NULL,
        username VARCHAR(100) PRIMARY KEY,
        password CHAR(256) NOT NULL,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        date_birthday DATE NOT NULL
    )"""
    cur.execute(dropTable)
    cur.execute(table)
    conn.commit()
    return "<h3 style=\"color:green;\">Table created</h3>"

if __name__ == '__main__':
    app.run()
