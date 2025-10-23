@echo off
REM ============================================================================
REM HRMS Go V5 - Stop All Services Script for Windows
REM ============================================================================
REM This script stops Docker, Backend, and Frontend servers
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🛑 Stopping HRMS Go V5 - All Services                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Stop processes on ports
echo 🎨 Stopping frontend (port 3000)...
FOR /F "tokens=5" %%P IN ('netstat -a -n -o ^| findstr :3000') DO TaskKill /PID %%P /F 2>nul
echo ✅ Frontend stopped

echo 🔧 Stopping backend (port 8000)...
FOR /F "tokens=5" %%P IN ('netstat -a -n -o ^| findstr :8000') DO TaskKill /PID %%P /F 2>nul
echo ✅ Backend stopped

REM Stop Docker
echo 🐳 Stopping Docker services...
docker-compose down
echo ✅ Docker services stopped

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              ✅ ALL SERVICES STOPPED!                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo To start again, run: start-hrms.bat
echo.

pause

