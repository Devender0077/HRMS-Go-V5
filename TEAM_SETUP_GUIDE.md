# 🚀 Team Setup Guide - HRMS Go V5

## ✅ Quick Setup (3 Commands!)

```bash
# 1. Clone repository
git clone https://github.com/Devender0077/HRMS-Go-V5.git
cd HRMS-Go-V5

# 2. Start Docker & Setup Backend
docker-compose up -d
cd backend && npm install && npm run setup && npm run dev &

# 3. Setup Frontend
cd .. && npm install && npm start
```

**Done!** Open http://localhost:3000 and login with:
- Email: `admin@hrms.com`
- Password: `admin123`

---

## 📋 Detailed Setup Instructions

### Prerequisites

- **Node.js**: v16+ (Recommended: v18 or v20)
- **npm**: v8+
- **Docker Desktop**: Latest version
- **Git**: Latest version

Check versions:
```bash
node --version   # Should be v16.0.0 or higher
npm --version    # Should be v8.0.0 or higher
docker --version # Should be installed
```

---

## 🐳 Step 1: Start Docker Services

```bash
# Navigate to project directory
cd HRMS-Go-V5

# Start MySQL and phpMyAdmin containers
docker-compose up -d

# Verify containers are running
docker ps
```

You should see:
- ✅ `hrms_mysql` - MySQL 8.0 on port 3306
- ✅ `hrms_phpmyadmin` - phpMyAdmin on port 8080

**Wait 30 seconds** for MySQL to fully initialize before proceeding.

---

## 🔧 Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run complete setup (creates tables + seeds data)
npm run setup
```

The setup script will:
1. ✅ Create all 25 database tables automatically
2. ✅ Seed general settings (83 settings)
3. ✅ Add sample data (employees, attendance, etc.)

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║          🚀 HRMS Go V5 - Complete Database Setup              ║
╚════════════════════════════════════════════════════════════════╝

📦 Step 1/3: Creating database tables...
✅ Tables created: 25 models

📝 Step 2/3: Seeding general settings...
✅ General settings seeded

📊 Step 3/3: Seeding sample data...
✅ Sample data seeded

╔════════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE!                          ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 💻 Step 3: Start Backend Server

```bash
# Still in backend directory
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║         🚀 HRMS Go V5 API Server Started Successfully          ║
╚════════════════════════════════════════════════════════════════╝
📊 Environment:    development
🌐 API URL:        http://localhost:8000/api
💾 Database:       hrms_go_v5
🔄 Sync Strategy:  development
📦 Models Loaded:  25
```

**Backend is now running!** ✅

---

## 🎨 Step 4: Frontend Setup

**Open a NEW terminal** (keep backend running):

```bash
# Navigate to project root
cd HRMS-Go-V5

# Install frontend dependencies
npm install
```

**Note:** Thanks to the `.npmrc` file we created, this will use `legacy-peer-deps` automatically, so **no errors!** ✅

**Expected Output:**
```
✅ Frontend dependencies installed successfully!
```

---

## 🚀 Step 5: Start Frontend

```bash
# Still in project root
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view hrms-go-v5 in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Frontend is now running!** ✅

---

## 🎯 Step 6: Access Application

1. **Open browser:** http://localhost:3000
2. **Login with:**
   - Email: `admin@hrms.com`
   - Password: `admin123`

**You're in!** 🎉

---

## 🔧 Troubleshooting

### Issue 1: npm install errors in frontend

**Error:**
```
npm error ERESOLVE could not resolve
npm error peer react@"^16.8.6 || ^17.0.0" from @react-pdf/renderer
```

**Solution 1 (Automatic - Recommended):**
The `.npmrc` file should handle this automatically. Just run:
```bash
npm install
```

**Solution 2 (Manual):**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

**Solution 3 (Helper Script):**
```bash
npm run clean-install
```

---

### Issue 2: Docker containers not starting

**Check Status:**
```bash
docker ps -a
```

**If MySQL is unhealthy:**
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait 30-60 seconds
docker logs hrms_mysql
```

---

### Issue 3: Backend can't connect to database

**Error:**
```
❌ Unable to connect to database: Access denied
```

**Solution:**
1. Check if Docker is running: `docker ps`
2. Wait for MySQL to be ready (check logs):
   ```bash
   docker logs hrms_mysql
   ```
3. Verify credentials in `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=hrms_go_v5
   DB_USER=root
   DB_PASSWORD=root
   ```

---

### Issue 4: Port already in use

**Error:**
```
Port 3000 is already in use
```

**Solution (Mac/Linux):**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

**Solution (Windows):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm start
```

**Or use a different port:**
```bash
PORT=3001 npm start
```

---

### Issue 5: Tables not created

**Check:**
```bash
cd backend
npm run migrate:status
```

**If it shows connection OK but tables missing:**
```bash
npm run setup:migrate  # Create tables only
npm run setup:seed     # Add sample data
```

**Or full reset:**
```bash
npm run setup:fresh    # ⚠️ Deletes all data and recreates
```

---

### Issue 6: Module not found errors

**Solution:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📦 Available npm Scripts

### Frontend (Project Root)
```bash
npm start                # Start frontend dev server
npm run build            # Build for production
npm run clean-install    # Clean install dependencies
npm test                 # Run tests (if configured)
```

### Backend (backend/)
```bash
npm run dev              # Start backend with nodemon (auto-reload)
npm start                # Start backend (no auto-reload)

# Database Setup
npm run setup            # Full setup: migrate + seed
npm run setup:migrate    # Only create tables
npm run setup:seed       # Only add sample data
npm run setup:fresh      # Fresh start (⚠️ destroys data)

# Database Migration
npm run migrate          # Create missing tables
npm run migrate:status   # Check connection & models
npm run migrate:alter    # Update existing tables
npm run migrate:fresh    # Drop all & recreate

# Seeding
npm run db:seed          # Add sample dashboard data
npm run db:seed:general  # Add general settings
npm run db:seed:templates # Add template fields

# Utilities
npm run clean-install    # Clean install dependencies
```

---

## 🗄️ Database Management

### Access phpMyAdmin
1. Open: http://localhost:8080
2. Login: `root` / `root`
3. Select: `hrms_go_v5` database

### View Tables
You should see **25 tables**:
- attendances
- attendance_policies
- assets
- asset_assignments
- asset_categories
- asset_maintenances
- branches
- calendar_events
- departments
- designations
- document_categories
- employees
- general_settings
- job_applications
- job_postings
- leaves
- leave_types
- payrolls
- performance_goals
- permissions
- roles
- salary_components
- shifts
- training_programs
- users

### Sample Data
After running `npm run setup`, you'll have:
- ✅ 5 Sample Employees
- ✅ 4 Attendance Records
- ✅ 3 Leave Requests
- ✅ 83 General Settings
- ✅ Configuration data (departments, branches, etc.)

---

## 🔄 Pulling Latest Code

When the repository is updated:

```bash
# Pull latest code
git pull origin main

# Update frontend dependencies (if package.json changed)
npm install

# Update backend dependencies (if package.json changed)
cd backend
npm install

# Restart servers
npm run dev  # Backend
cd .. && npm start  # Frontend (new terminal)
```

**Note:** Database migrations happen automatically when you start the backend!

---

## 📊 What Gets Created

### 25 Database Tables

**Core:**
- users
- employees
- roles
- permissions
- general_settings

**Organization:**
- branches
- departments
- designations

**Attendance & Leave:**
- attendances
- attendance_policies
- shifts
- leaves
- leave_types

**Payroll:**
- payrolls
- salary_components

**Recruitment:**
- job_postings
- job_applications

**Performance & Training:**
- performance_goals
- training_programs

**Documents:**
- document_categories

**Assets:**
- assets
- asset_categories
- asset_assignments
- asset_maintenances

**Calendar:**
- calendar_events

---

## 🎓 Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm start
```

### Adding New Features

When you add a new model:
1. Create model file in `backend/models/NewModel.js`
2. Add to `backend/config/syncDatabase.js`:
   ```javascript
   NewModel: require('../models/NewModel'),
   ```
3. Restart backend - table is auto-created!

### Modifying Models

When you change a model's schema:
```bash
cd backend
npm run migrate:alter  # Updates tables to match models
```

### Fresh Database

For testing with clean data:
```bash
cd backend
npm run setup:fresh    # ⚠️ Deletes everything and recreates
```

---

## 🚢 Production Deployment

For production, use:

**Backend .env:**
```bash
NODE_ENV=production
DB_SYNC_STRATEGY=production  # No auto-sync
```

**Then:**
1. Use proper database migrations (not auto-sync)
2. Deploy backend to server (VPS/Cloud)
3. Build frontend: `npm run build`
4. Serve `build/` folder with nginx/apache
5. Configure environment variables
6. Set up SSL/HTTPS

See `TEAM_DEPLOYMENT_GUIDE.md` for details.

---

## ✅ Success Checklist

After setup, verify:

- [ ] Docker containers running (`docker ps`)
- [ ] MySQL accessible (phpMyAdmin: http://localhost:8080)
- [ ] Backend running (http://localhost:8000/api/health)
- [ ] Frontend running (http://localhost:3000)
- [ ] Can login (admin@hrms.com / admin123)
- [ ] Dashboard loads with data
- [ ] No console errors
- [ ] All 25 tables in phpMyAdmin

---

## 📞 Getting Help

### Check Logs

**Docker:**
```bash
docker logs hrms_mysql
docker logs hrms_phpmyadmin
```

**Backend:**
Check terminal where `npm run dev` is running

**Frontend:**
Check browser console (F12)

### Common Commands

```bash
# Restart everything
docker-compose restart
cd backend && npm run dev   # New terminal
npm start                    # Another terminal

# Clean slate
docker-compose down -v
rm -rf node_modules backend/node_modules
npm run clean-install
cd backend && npm run clean-install
docker-compose up -d
cd backend && npm run setup
```

---

## 📚 Documentation

- **`README.md`** - Project overview
- **`DATABASE_MIGRATION_GUIDE.md`** - Database management
- **`TEAM_DEPLOYMENT_GUIDE.md`** - Production deployment
- **`QUICK_FIX_FOR_TEAM.md`** - Common issues
- **`DOCKER_SETUP_GUIDE.md`** - Docker details

---

## 🎉 You're Ready!

Congratulations! Your HRMS Go V5 is fully set up and running.

**Happy coding!** 🚀

---

*Last Updated: October 2025*

