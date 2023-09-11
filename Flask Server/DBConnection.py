import psycopg2
import random

user="postgres"
psw="postgres"

hosts = ["db", "db-backup"]

def get_connection():
    chosen_host = random.choice(hosts)
    other_host = hosts[1] if chosen_host == hosts[0] else hosts[0]

    try:
        conn = psycopg2.connect(host=chosen_host, port=5432, dbname="postgres", user=user, password=psw)
        return conn
    except:
        try:
            conn = psycopg2.connect(host=other_host, port=5432, dbname="postgres", user=user, password=psw)
            return conn
        except:
            print("Error during db connection\n")
            return None