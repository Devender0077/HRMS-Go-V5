#!/bin/bash

echo "🐳 Starting HRMS Go V5 Docker Services..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Start containers
echo "🚀 Starting MySQL and phpMyAdmin..."
docker-compose up -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "✅ Docker services are ready!"
echo ""
echo "🌐 Available Services:"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - MySQL: localhost:3306"
echo ""
echo "🔑 Credentials:"
echo "   - Username: root"
echo "   - Password: root"
echo "   - Database: hrms_go_v5"
echo ""
echo "📝 Next Steps:"
echo "   1. Access phpMyAdmin at http://localhost:8080"
echo "   2. Start backend: cd backend && npm start"
echo "   3. Start frontend: npm start"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo ""

