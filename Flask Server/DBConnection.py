import psycopg2
import random

user="postgres"
psw="postgres"

hosts = ["db", "db-backup"]

def get_connection():
    chosen_host = random.choice(hosts)
    other_host = hosts[1] if chosen_host == hosts[0] else hosts[0]

    try:
        print(f'[INFO] {chosen_host}')
        conn = psycopg2.connect(host=chosen_host, port=5432, dbname="postgres", user=user, password=psw, connect_timeout=3)
        return conn
    except:
        try:
            print(f'[INFO] {other_host}')
            conn = psycopg2.connect(host=other_host, port=5432, dbname="postgres", user=user, password=psw, connect_timeout=3)
            return conn
        except:
            print("Error during db connection\n")
            return None