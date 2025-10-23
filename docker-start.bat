@echo off
echo 🐳 Starting HRMS Go V5 Docker Services...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Stop any existing containers
echo 📦 Stopping existing containers...
docker-compose down

REM Start containers
echo 🚀 Starting MySQL and phpMyAdmin...
docker-compose up -d

REM Wait for MySQL to be ready
echo ⏳ Waiting for MySQL to be ready...
timeout /t 10 /nobreak >nul

REM Check container status
echo.
echo 📊 Container Status:
docker-compose ps

echo.
echo ✅ Docker services are ready!
echo.
echo 🌐 Available Services:
echo    - phpMyAdmin: http://localhost:8080
echo    - MySQL: localhost:3306
echo.
echo 🔑 Credentials:
echo    - Username: root
echo    - Password: root
echo    - Database: hrms_go_v5
echo.
echo 📝 Next Steps:
echo    1. Access phpMyAdmin at http://localhost:8080
echo    2. Start backend: cd backend ^&^& npm start
echo    3. Start frontend: npm start
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause

