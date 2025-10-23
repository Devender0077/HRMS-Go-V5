#!/bin/bash

echo "🚀 Starting Complete HRMS Go V5 Application..."
echo ""

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to wait for MySQL
wait_for_mysql() {
    echo "⏳ Waiting for MySQL to be ready..."
    for i in {1..30}; do
        if docker exec hrms_mysql mysqladmin ping -h localhost -uroot -proot > /dev/null 2>&1; then
            echo "✅ MySQL is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    echo "❌ MySQL failed to start in time."
    exit 1
}

# Check Docker
check_docker

# Start Docker services
echo "📦 Starting Docker containers (MySQL + phpMyAdmin)..."
docker-compose up -d

# Wait for MySQL
wait_for_mysql

echo ""
echo "🎯 Docker Services Started:"
echo "   ✓ MySQL (localhost:3306)"
echo "   ✓ phpMyAdmin (http://localhost:8080)"
echo ""

# Start backend
echo "🔧 Starting Backend Server..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start &
BACKEND_PID=$!

cd ..

# Give backend a moment to start
sleep 3

# Start frontend
echo ""
echo "🎨 Starting Frontend Application..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "=============================================="
echo "✅ HRMS Go V5 is starting up!"
echo "=============================================="
echo ""
echo "📊 Services:"
echo "   - phpMyAdmin:  http://localhost:8080"
echo "   - Backend API: http://localhost:8000/api"
echo "   - Frontend:    http://localhost:3000"
echo ""
echo "🔑 Database Credentials:"
echo "   - Host: localhost:3306"
echo "   - User: root"
echo "   - Pass: root"
echo "   - DB:   hrms_go_v5"
echo ""
echo "📝 To stop all services:"
echo "   - Press Ctrl+C to stop frontend/backend"
echo "   - Run: docker-compose down"
echo ""
echo "=============================================="
echo ""

# Wait for user to stop
wait $FRONTEND_PID

