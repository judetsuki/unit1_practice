# PostgreSQL connection settings
$env:PGPASSWORD = "2015"
$dbUser = "danie"
$dbName = "tasktracker"

Write-Host "🔍 Viewing Tasks in PostgreSQL Database" -ForegroundColor Cyan
Write-Host "----------------------------------------`n"

# List all tables in the database
Write-Host "Available Tables:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c "\dt"

Write-Host "`nTable 'task' Structure:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c "\d task"

Write-Host "`nTable 'tasks' Structure:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c "\d tasks"

Write-Host "`nDetailed Task View:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c @"
    SELECT 
        id,
        title,
        CASE 
            WHEN description IS NULL THEN '(No description)'
            WHEN length(description) > 100 THEN 
                substr(description, 1, 97) || '...'
            ELSE description
        END as description,
        status,
        CASE 
            WHEN due_date IS NOT NULL THEN to_char(due_date, 'YYYY-MM-DD HH24:MI')
            ELSE 'No due date'
        END as due_date,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
    FROM tasks 
    ORDER BY 
        CASE 
            WHEN status = 'pending' THEN 1
            WHEN status = 'in_progress' THEN 2
            WHEN status = 'completed' THEN 3
            ELSE 4
        END,
        COALESCE(due_date, 'infinity'::timestamp),
        created_at DESC;
"@

Write-Host "`nFull Task Details:" -ForegroundColor Green
psql -U $dbUser -d $dbName -c @"
    SELECT 
        '=== Task #' || id || ' ===' as separator,
        'Title: ' || title as title,
        CASE 
            WHEN description IS NULL THEN '(No description)'
            ELSE regexp_replace(description, E'\n', E'\n  ', 'g')  -- Indent multiline descriptions
        END as description,
        'Status: ' || status as status,
        CASE 
            WHEN due_date IS NOT NULL THEN 'Due: ' || to_char(due_date, 'YYYY-MM-DD HH24:MI')
            ELSE 'No due date set'
        END as due_date,
        'Created: ' || to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        'Updated: ' || to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
        '' as blank_line  -- Add blank line between tasks
    FROM tasks 
    ORDER BY created_at DESC;
"@

Write-Host "`nTask Statistics:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c @"
    SELECT 
        status,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks)::float as percentage
    FROM tasks 
    GROUP BY status
    ORDER BY 
        CASE 
            WHEN status = 'pending' THEN 1
            WHEN status = 'in_progress' THEN 2
            WHEN status = 'completed' THEN 3
            ELSE 4
        END;
"@

Write-Host "`nUpcoming Due Tasks:" -ForegroundColor Yellow
psql -U $dbUser -d $dbName -c @"
    SELECT 
        id,
        title,
        status,
        to_char(due_date, 'YYYY-MM-DD HH24:MI') as due_date
    FROM tasks 
    WHERE 
        due_date IS NOT NULL 
        AND due_date > CURRENT_TIMESTAMP 
        AND status != 'completed'
    ORDER BY due_date ASC
    LIMIT 5;
"@
