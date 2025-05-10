@echo off
echo Starting Task Tracker API with persistent URL
start "Flask App" python app.py
timeout /t 5
start "Localtunnel" lt --port 5001 --subdomain task-tracker-daniel
echo Your API is available at: https://task-tracker-daniel.loca.lt
echo Press Ctrl+C in each window to stop the servers