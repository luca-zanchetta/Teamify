import psycopg2

user="postgres"
psw="postgres"
db="db"
db_backup = "db-backup"
local="localhost"

def get_connection():
    try:
        print('[INFO] Trying on the primary...')
        conn = psycopg2.connect(host=db, port=5432, dbname="postgres", user=user, password=psw)
        return conn
    
    except:
        try:
            print('[INFO] Trying on the backup...')
            conn = psycopg2.connect(host=db_backup, port=5432, dbname="postgres", user=user, password=psw)
            return conn
        except:
            print("Error during db connection\n")
            return None