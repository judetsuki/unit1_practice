Write-Host "Testing Task Tracker API Global Access`n"
Write-Host "API URL: https://task-tracker-daniel.loca.lt`n"

# Test 1: Basic connectivity
Write-Host "1. Testing basic connectivity..."
try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/"
    Write-Host "✅ Connected successfully! Response:" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "❌ Connection failed: $_" -ForegroundColor Red
}

# Test 2: Create a new task
Write-Host "`n2. Creating a new task..."
$task = @{
    title = "Global Network Test"
    description = "Testing API access from external network"
    status = "pending"
    due_date = "2025-05-11T10:00:00"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/tasks" -Method Post -Body $task -ContentType "application/json"
    $newTask = $response.Content | ConvertFrom-Json
    Write-Host "✅ Task created successfully! Task ID:" -ForegroundColor Green
    Write-Host ($newTask | ConvertTo-Json)
    $taskId = $newTask.id
} catch {
    Write-Host "❌ Task creation failed: $_" -ForegroundColor Red
    exit
}

# Test 3: Get task list
Write-Host "`n3. Getting all tasks..."
try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/tasks"
    Write-Host "✅ Retrieved tasks successfully!" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json)
} catch {
    Write-Host "❌ Failed to get tasks: $_" -ForegroundColor Red
}

# Test 4: Update task
Write-Host "`n4. Updating task..."
$update = @{
    status = "in-progress"
    description = "Updated from global network test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/tasks/$taskId" -Method Put -Body $update -ContentType "application/json"
    Write-Host "✅ Task updated successfully!" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json)
} catch {
    Write-Host "❌ Failed to update task: $_" -ForegroundColor Red
}

# Test 5: Get specific task
Write-Host "`n5. Getting updated task..."
try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/tasks/$taskId"
    Write-Host "✅ Retrieved task successfully!" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json)
} catch {
    Write-Host "❌ Failed to get task: $_" -ForegroundColor Red
}

# Test 6: Delete task
Write-Host "`n6. Deleting test task..."
try {
    $response = Invoke-WebRequest -Uri "https://task-tracker-daniel.loca.lt/tasks/$taskId" -Method Delete
    Write-Host "✅ Task deleted successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to delete task: $_" -ForegroundColor Red
}

Write-Host "`nTests completed!"
