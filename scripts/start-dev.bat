@echo off
echo Starting TempMail Development Environment...
echo.

REM Check if MongoDB is running
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Warning: Could not start MongoDB. Please start it manually.
        pause
    )
)

echo MongoDB is running
echo.
echo Starting development servers...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo SMTP Server: port 2525
echo.

start cmd /k "npm run server"
timeout /t 3 /nobreak >nul
start cmd /k "cd client && npm run dev"

echo.
echo Development servers started!
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:3000
