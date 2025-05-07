@echo off
echo Testing Task Tracker API through localtunnel
echo URL: https://task-tracker-daniel.loca.lt
echo.

echo 1. Creating a new task...
powershell -Command "$response = $body = @{ title = 'Test Remote Access'; description = 'Testing API through localtunnel'; status = 'pending'; due_date = '2025-05-10T15:00:00' } | ConvertTo-Json; $result = Invoke-WebRequest -Uri 'https://task-tracker-daniel.loca.lt/tasks' -Method Post -Body $body -ContentType 'application/json'; $task = $result.Content | ConvertFrom-Json; $task.id | Out-File -FilePath 'task_id.txt'; $result"
echo.

echo 2. Getting all tasks...
powershell -Command "Invoke-WebRequest -Uri 'https://task-tracker-daniel.loca.lt/tasks' -Method Get"
echo.

echo 3. Getting specific task...
powershell -Command "$taskId = Get-Content 'task_id.txt'; Invoke-WebRequest -Uri \"https://task-tracker-daniel.loca.lt/tasks/$taskId\" -Method Get"
echo.

echo 4. Updating task status to in_progress...
powershell -Command "$taskId = Get-Content 'task_id.txt'; $body = @{ status = 'in_progress' } | ConvertTo-Json; Invoke-WebRequest -Uri \"https://task-tracker-daniel.loca.lt/tasks/$taskId\" -Method Put -Body $body -ContentType 'application/json'"
echo.

echo 5. Deleting the task...
powershell -Command "$taskId = Get-Content 'task_id.txt'; Invoke-WebRequest -Uri \"https://task-tracker-daniel.loca.lt/tasks/$taskId\" -Method Delete; Remove-Item 'task_id.txt'"
echo.

echo All tests completed!