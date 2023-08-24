from datetime import datetime, timedelta
from DBConnection import get_connection

def get_current_week_range():
    today = datetime.now()
    current_day_of_week = today.weekday()  
    
    start_of_week = today - timedelta(days=current_day_of_week)
    end_of_week = start_of_week + timedelta(days=6)

    return start_of_week, end_of_week

def convert_date(end_date, duration):
    end_datetime = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")

    # Convert amount_of_time to integer (minutes)
    minutes = int(duration)

    # Add the specified amount of time to end_datetime
    new_end_datetime = end_datetime + timedelta(minutes=minutes)

    # Format new_end_datetime back to the desired format
    new_end_date = new_end_datetime.strftime("%Y-%m-%d %H:%M:%S")

    return new_end_date

def convert_one_date(date):
    end_datetime = datetime.strptime(date, "%Y-%m-%d")
    return end_datetime


def get_teams():
    teams = []
    
    # DB setup
    conn = get_connection()
    conn.set_session(autocommit=True)
    if conn is None:
        print("[ERROR] DB Connection failed.")
        exit()
        
    curr = conn.cursor()
    
    query_retrieve_teams = "SELECT id, name FROM team"
    curr.execute(query_retrieve_teams)
        
    retrieved_teams = curr.fetchall()
    if len(retrieved_teams) != 0:
        query_retrieve_members = "SELECT user FROM joinTeam WHERE team = %s"
        
        for team in retrieved_teams:
            params = (team[0])
            curr.execute(query_retrieve_members, params)
                
            retrieved_users = curr.fetchall()
            if len(retrieved_users) != 0:
                teams.append([team[1], retrieved_users])
            else:
                teams.append([team[1], []])
    
    return teams