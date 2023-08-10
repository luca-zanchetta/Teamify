import psycopg2

def get_connection():
    try:
        conn = psycopg2.connect(host="localhost", port=5432, dbname="teamify", user="postgres", password="psw")
        return conn
    except:
        print("Errore during db connection\n")