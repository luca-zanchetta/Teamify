import psycopg2

user="postgres"
psw=""

def get_connection():
    try:
        conn = psycopg2.connect(host="localhost", port=5432, dbname="teamify", user=user, password=psw)
        return conn
    
    except:
        print("Errore during db connection\n")
        return None