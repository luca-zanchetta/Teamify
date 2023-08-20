# Teamify

Open the git folder with vs code:

### Set up react environment

- cd to React-site folder
- run npm ci
- run npm run start

(Node is required for this steps)

### Set up Flask server

- cd to Flask server folder
- run "python -m venv venv" (mac command should be python3 -m venv venv)
- actiate the environment with \venv\scripts\activate (mac source venv/bin/activate)
- pip install flask in the environment
- pip install flask_cors
- pip install psycopg2
- python ./server.py to launch the server
