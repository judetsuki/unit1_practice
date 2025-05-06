@echo off
echo Testing Task Tracker API
echo.

echo 1. Creating a new task...
powershell -Command "$body = @{ title = 'Test Task'; description = 'Testing our task tracker API'; status = 'pending'; due_date = '2025-05-10T15:00:00' } | ConvertTo-Json; Invoke-WebRequest -Uri http://localhost:5000/tasks -Method Post -Body $body -ContentType 'application/json'"
echo.

echo 2. Getting all tasks...
powershell -Command "Invoke-WebRequest -Uri http://localhost:5000/tasks -Method Get"
echo.

echo 3. Getting specific task (ID: 2)...
powershell -Command "Invoke-WebRequest -Uri http://localhost:5000/tasks/2 -Method Get"
echo.

echo 4. Updating task status to in_progress...
powershell -Command "$body = @{ status = 'in_progress' } | ConvertTo-Json; Invoke-WebRequest -Uri http://localhost:5000/tasks/2 -Method Put -Body $body -ContentType 'application/json'"
echo.

echo 5. Deleting the task...
powershell -Command "Invoke-WebRequest -Uri http://localhost:5000/tasks/2 -Method Delete"
echo.

echo All tests completed!