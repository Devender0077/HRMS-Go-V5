#!/bin/bash

# ============================================================================
# HRMS Go V5 - Complete Startup Script for Mac/Linux
# ============================================================================
# This script starts Docker, Backend, and Frontend servers
# Compatible with: macOS, Linux, WSL
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🚀 Starting HRMS Go V5 - All Services                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kill existing processes on ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
pkill -9 -f nodemon 2>/dev/null || true
sleep 2
echo "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Step 1: Start Docker
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1/3: Starting Docker Services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

docker-compose up -d

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Docker services started${NC}"
    echo "   • MySQL running on port 3306"
    echo "   • phpMyAdmin running on port 8080"
else
    echo "${RED}❌ Failed to start Docker services${NC}"
    echo "Make sure Docker Desktop is installed and running"
    exit 1
fi

echo ""
echo "⏳ Waiting for MySQL to be ready (30 seconds)..."
sleep 30
echo "${GREEN}✅ MySQL should be ready${NC}"
echo ""

# Step 2: Start Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Step 2/3: Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend

# Verify .env file exists
if [ ! -f .env ]; then
    echo "${RED}❌ Backend .env file not found!${NC}"
    echo "Copying from .env.example..."
    cp .env.example .env
    echo "${GREEN}✅ Created .env file${NC}"
fi

# Check environment variables
echo "Checking environment variables..."
npm run check:env
if [ $? -ne 0 ]; then
    echo "${RED}❌ Environment check failed!${NC}"
    echo "Please ensure backend/.env has all required variables"
    echo "You can copy from: cp backend/.env.example backend/.env"
    cd ..
    exit 1
fi

npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"
echo "   • Port: 8000"
echo "   • Logs: backend.log"
echo ""
echo "⏳ Waiting for backend to initialize (10 seconds)..."
sleep 10

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "${GREEN}✅ Backend is ready!${NC}"
else
    echo "${YELLOW}⚠️  Backend still starting... (check backend.log for details)${NC}"
fi

echo ""

# Step 3: Start Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Step 3/3: Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"
echo "   • Port: 3000"
echo "   • Logs: frontend.log"
echo ""
echo "⏳ Frontend will take 30-60 seconds to compile..."
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 ✅ ALL SERVICES STARTED!                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Services:"
echo "  • MySQL:      http://localhost:8080 (phpMyAdmin)"
echo "  • Backend:    http://localhost:8000"
echo "  • Frontend:   http://localhost:3000 (compiling...)"
echo ""
echo "Logs:"
echo "  • Backend:  tail -f backend.log"
echo "  • Frontend: tail -f frontend.log"
echo ""
echo "Login:"
echo "  • Email:    admin@hrms.com"
echo "  • Password: admin123"
echo ""
echo "To stop all services:"
echo "  • Run: ./stop-hrms.sh"
echo "  • Or:  docker-compose down && kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Wait 30-60 seconds for frontend to compile, then visit:      ║"
echo "║  🌐 http://localhost:3000                                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

