#!/bin/bash

# ============================================================================
# HRMS Go V5 - Complete Setup Script with Auto-Migrations
# ============================================================================
# This script handles first-time setup including database migrations
# Compatible with: macOS, Linux, WSL
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🔧 HRMS Go V5 - Complete Setup with Migrations            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MySQL credentials are provided
if [ -f backend/.env ]; then
    source backend/.env
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-3306}
    DB_NAME=${DB_NAME:-hrms_go_v5}
    DB_USER=${DB_USER:-root}
    DB_PASSWORD=${DB_PASSWORD}
else
    echo "${RED}❌ backend/.env file not found!${NC}"
    echo "Creating from .env.example..."
    cd backend && cp .env.example .env && cd ..
    echo "${YELLOW}⚠️  Please edit backend/.env with your MySQL credentials${NC}"
    echo "Then run this script again."
    exit 1
fi

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    echo "${BLUE}Running: $description${NC}"
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$file" 2>&1
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$file" 2>&1
    fi
    
    if [ $? -eq 0 ]; then
        echo "${GREEN}✅ $description completed${NC}"
        return 0
    else
        echo "${RED}❌ $description failed${NC}"
        return 1
    fi
}

# Kill existing processes on ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
pkill -9 -f nodemon 2>/dev/null || true
sleep 2
echo "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Step 1: Check Database Connection
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1/5: Checking Database Connection..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$DB_PASSWORD" ]; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1" &>/dev/null
else
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" &>/dev/null
fi

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ MySQL connection successful${NC}"
else
    echo "${RED}❌ Cannot connect to MySQL${NC}"
    echo "Please check:"
    echo "  1. MySQL is running"
    echo "  2. Credentials in backend/.env are correct"
    exit 1
fi
echo ""

# Step 2: Run Database Migrations
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  Step 2/5: Running Database Migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run region fields migration (idempotent - safe to run multiple times)
if [ -f "backend/database/add_region_fields_to_employees.sql" ]; then
    run_sql_file "backend/database/add_region_fields_to_employees.sql" "Region fields migration"
    echo ""
else
    echo "${YELLOW}⚠️  Region fields migration file not found, skipping${NC}"
fi

# Run calendar creator fix migration
if [ -f "backend/database/fix_calendar_event_creators.sql" ]; then
    run_sql_file "backend/database/fix_calendar_event_creators.sql" "Calendar creator fix"
    echo ""
else
    echo "${YELLOW}⚠️  Calendar creator fix file not found, skipping${NC}"
fi

echo "${GREEN}✅ All migrations completed${NC}"
echo ""

# Step 3: Install Dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 3/5: Installing Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "${BLUE}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
    echo "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo "${GREEN}✅ Backend dependencies already installed${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "${BLUE}Installing frontend dependencies...${NC}"
    npm install
    echo "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo "${GREEN}✅ Frontend dependencies already installed${NC}"
fi
echo ""

# Step 4: Start Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Step 4/5: Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "${GREEN}✅ Backend starting (PID: $BACKEND_PID)${NC}"
echo "   • Port: 8000"
echo "   • Logs: backend.log"
echo ""
echo "⏳ Waiting for backend to initialize (15 seconds)..."
sleep 15

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "${GREEN}✅ Backend is ready!${NC}"
else
    echo "${YELLOW}⚠️  Backend still starting... (check backend.log for details)${NC}"
fi
echo ""

# Step 5: Start Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Step 5/5: Starting Frontend..."
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
echo "║               ✅ SETUP COMPLETE! ALL SERVICES STARTED          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Services:"
echo "  • Backend:    http://localhost:8000 ✅"
echo "  • Frontend:   http://localhost:3000 (compiling...)"
echo ""
echo "Logs:"
echo "  • Backend:  tail -f backend.log"
echo "  • Frontend: tail -f frontend.log"
echo ""
echo "Database:"
echo "  • Name:     $DB_NAME"
echo "  • Host:     $DB_HOST:$DB_PORT"
echo "  • ✅ All migrations applied"
echo ""
echo "Login Credentials:"
echo "  • Superadmin: superadmin@hrms.com / Admin@123"
echo "  • HR Manager: hr.manager@hrms.com / HR@123"
echo "  • Employee:   john.smith@hrms.com / Emp@123"
echo ""
echo "To stop all services:"
echo "  • Run: ./stop-hrms.sh"
echo "  • Or:  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Wait 30-60 seconds for frontend to compile, then visit:      ║"
echo "║  🌐 http://localhost:3000                                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "${GREEN}✨ Setup complete! Your HRMS is ready to use!${NC}"
echo ""

