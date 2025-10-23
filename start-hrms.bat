@echo off
REM ============================================================================
REM HRMS Go V5 - Complete Startup Script for Windows
REM ============================================================================
REM This script starts Docker, Backend, and Frontend servers
REM Compatible with: Windows 10/11
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🚀 Starting HRMS Go V5 - All Services                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Start Docker
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📦 Step 1/3: Starting Docker Services...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker services started
    echo    • MySQL running on port 3306
    echo    • phpMyAdmin running on port 8080
) else (
    echo ❌ Failed to start Docker services
    echo Make sure Docker Desktop is installed and running
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for MySQL to be ready (30 seconds)...
timeout /t 30 /nobreak > nul
echo ✅ MySQL should be ready
echo.

REM Step 2: Start Backend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🔧 Step 2/3: Starting Backend Server...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd backend
start "HRMS Backend" cmd /k npm run dev
cd ..

echo ✅ Backend starting in new window
echo    • Port: 8000
echo.
echo ⏳ Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak > nul

REM Step 3: Start Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎨 Step 3/3: Starting Frontend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

start "HRMS Frontend" cmd /k npm start

echo ✅ Frontend starting in new window
echo    • Port: 3000
echo.
echo ⏳ Frontend will take 30-60 seconds to compile...
echo.

REM Summary
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                 ✅ ALL SERVICES STARTED!                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Services:
echo   • MySQL:      http://localhost:8080 (phpMyAdmin)
echo   • Backend:    http://localhost:8000
echo   • Frontend:   http://localhost:3000 (compiling...)
echo.
echo Login:
echo   • Email:    admin@hrms.com
echo   • Password: admin123
echo.
echo To stop all services:
echo   • Close the backend and frontend windows
echo   • Run: docker-compose down
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Wait 30-60 seconds for frontend to compile, then visit:      ║
echo ║  🌐 http://localhost:3000                                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause

