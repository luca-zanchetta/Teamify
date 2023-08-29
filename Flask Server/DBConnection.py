import psycopg2

user="postgres"
psw="postgres"

def get_connection():
    try:
        conn = psycopg2.connect(host="db", port=5432, dbname="teamify", user=user, password=psw)
        return conn
    
    except:
        print("Error during db connection\n")
        return None