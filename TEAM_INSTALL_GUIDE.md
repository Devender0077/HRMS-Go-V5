# 🚀 Team Installation Guide - HRMS Go V5

## ✅ Dependency Conflict Fixed!

**Issue:** `@react-pdf/renderer@3.0.1` was incompatible with React 18  
**Solution:** Updated to `@react-pdf/renderer@3.4.4` which supports React 18

---

## 📦 Installation Instructions for Team Members

### Method 1: Clean Install (Recommended)
```bash
# Navigate to project directory
cd HRMS-Go-V5

# Remove old dependencies and cache
rm -rf node_modules package-lock.json
npm cache clean --force

# Install with legacy peer deps (handles any remaining conflicts)
npm install --legacy-peer-deps
```

### Method 2: Using npm install script
```bash
# We've added a helper script for clean install
npm run clean-install
```

### Method 3: Quick install
```bash
# If you just want to install normally
npm install --legacy-peer-deps
```

---

## 🐳 Docker Installation (Backend + Database)

```bash
# Start MySQL and phpMyAdmin
docker-compose up -d

# Wait for containers to be healthy (about 30 seconds)
docker ps

# Install backend dependencies
cd backend
npm install
cd ..
```

---

## 🎯 Complete Setup (First Time)

### 1. Clone the Repository
```bash
git clone https://github.com/Devender0077/HRMS-Go-V5.git
cd HRMS-Go-V5
```

### 2. Install Frontend Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Start Docker Services
```bash
# Start MySQL + phpMyAdmin
docker-compose up -d

# Verify containers are running
docker ps
```

You should see:
- ✅ `hrms_mysql` (MySQL database on port 3306)
- ✅ `hrms_phpmyadmin` (phpMyAdmin on port 8080)

### 5. Configure Environment Variables
```bash
# Backend environment (already configured)
cd backend
cp .env.example .env
# The .env file is already configured for Docker
cd ..
```

### 6. Initialize Database
Open phpMyAdmin: http://localhost:8080
- Username: `root`
- Password: `root`
- Database: `hrms_go_v5` (auto-created)

**Option A:** Run the sample data script
```sql
-- Copy and paste content from ADD_SAMPLE_DATA.sql in SQL tab
-- This adds:
-- ✅ 5 Employees
-- ✅ 4 Attendance records
-- ✅ 4 Calendar events
```

**Option B:** Let Sequelize create tables automatically
- Just start the backend server
- Sequelize will auto-create all 59 tables
- You can add data later via the UI

### 7. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm start
```
Frontend runs on: http://localhost:3000

### 8. Login
```
Email: admin@hrms.com
Password: admin123
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: npm install fails with ERESOLVE error
**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue 2: Docker containers not starting
**Solution:**
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ This deletes database data!)
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Issue 3: Backend connection error
**Solution:**
```bash
# Check if MySQL is running
docker ps

# Restart MySQL container
docker restart hrms_mysql

# Wait 30 seconds for MySQL to be ready
# Then restart backend
cd backend
npm run dev
```

### Issue 4: Frontend port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or set a different port
export PORT=3001
npm start
```

### Issue 5: Module not found errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

---

## 📚 Dependency Versions

### Core Dependencies
- ✅ **React:** 18.2.0 (Latest stable)
- ✅ **React DOM:** 18.2.0
- ✅ **Material-UI:** 5.10.15
- ✅ **React Router:** 6.4.3
- ✅ **Redux Toolkit:** 1.9.0
- ✅ **Axios:** 1.2.0
- ✅ **@react-pdf/renderer:** 3.4.4 (Updated for React 18 support)

### Backend Dependencies
- ✅ **Node.js:** 16+ (Recommended: 18 or 20)
- ✅ **Express:** 4.18.2
- ✅ **Sequelize:** 6.28.0
- ✅ **MySQL2:** 3.0.1
- ✅ **JWT:** 9.0.0

### Database
- ✅ **MySQL:** 8.0 (via Docker)
- ✅ **phpMyAdmin:** Latest (via Docker)

---

## 🎉 Expected Results After Installation

### Frontend (Port 3000)
- ✅ Login page loads
- ✅ Dashboard displays (http://localhost:3000/dashboard/app)
- ✅ No console errors
- ✅ All routes accessible

### Backend (Port 8000)
- ✅ API endpoints respond
- ✅ Database connection successful
- ✅ Sequelize models sync
- ✅ CORS configured for localhost:3000

### Database (Port 8080 - phpMyAdmin)
- ✅ All 59 tables created automatically
- ✅ Sample data loaded (if you ran ADD_SAMPLE_DATA.sql)
- ✅ Foreign keys working

---

## 📝 Additional Notes

### Why `--legacy-peer-deps`?
Some packages in the project have strict peer dependency requirements. Using `--legacy-peer-deps` tells npm to use the legacy peer dependency resolution algorithm, which is more lenient and works around minor version conflicts.

### Is it safe?
Yes! The `--legacy-peer-deps` flag is officially supported by npm and is safe to use. All dependencies are tested and working correctly.

### Alternative: Use Yarn
If you prefer Yarn over npm:
```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn install
```

Yarn handles peer dependencies differently and may not require the `--legacy-peer-deps` flag.

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
cd backend
npm run dev

# Docker logs
docker-compose logs -f mysql
docker-compose logs -f phpmyadmin
```

### Common Commands
```bash
# Restart everything
docker-compose restart
cd backend && npm run dev  # New terminal
npm start                   # Another terminal

# Clean everything and start fresh
docker-compose down -v
rm -rf node_modules backend/node_modules
rm -rf package-lock.json backend/package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
cd backend && npm install && cd ..
docker-compose up -d
```

---

## ✅ Installation Complete!

Once installation is successful:
1. ✅ Visit http://localhost:3000
2. ✅ Login with admin@hrms.com / admin123
3. ✅ Explore the dashboard
4. ✅ Add sample data via phpMyAdmin (http://localhost:8080)
5. ✅ Start building!

Happy coding! 🚀

