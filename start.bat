@echo off
REM Sri Sai Mosquito Enterprises - Startup Script
REM Run both backend and frontend with one click

echo ========================================
echo   Sri Sai Mosquito Enterprises
echo   Starting Application...
echo ========================================

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.10
set PATH=C:\Program Files\Java\jdk-21.0.10\bin;C:\Program Files\apache-maven-3.9.15\bin;%PATH%

cd /d "%~dp0"

REM Start Backend in new window
echo Starting Backend (Spring Boot on port 8080)...
start "Backend - Spring Boot" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

REM Start Frontend in new window
echo Starting Frontend (React on port 3000)...
start "Frontend - React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   Application Started!
echo   Backend: http://localhost:8080/api
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit (servers will keep running)...
pause >nul