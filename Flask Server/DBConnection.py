import psycopg2

user="postgres"
psw="postgres"
docker="db"
local="localhost"

def get_connection():
    try:
        conn = psycopg2.connect(host=docker, port=5432, dbname="teamify", user=user, password=psw)
        return conn
    
    except:
        print("Error during db connection\n")
        return None