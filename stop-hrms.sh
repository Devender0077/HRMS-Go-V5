#!/bin/bash

# ============================================================================
# HRMS Go V5 - Stop All Services Script for Mac/Linux
# ============================================================================
# This script stops Docker, Backend, and Frontend servers
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🛑 Stopping HRMS Go V5 - All Services                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

# Stop frontend (port 3000)
echo "🎨 Stopping frontend..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo "${GREEN}✅ Frontend stopped${NC}"

# Stop backend (port 8000)
echo "🔧 Stopping backend..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
pkill -9 -f nodemon 2>/dev/null || true
echo "${GREEN}✅ Backend stopped${NC}"

# Stop Docker
echo "🐳 Stopping Docker services..."
docker-compose down
echo "${GREEN}✅ Docker services stopped${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✅ ALL SERVICES STOPPED!                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "To start again, run: ./start-hrms.sh"
echo ""

