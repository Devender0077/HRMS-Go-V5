# 🔧 HRMS Go V5 - Troubleshooting Guide

Common issues and solutions for team members.

---

## ❌ **Error: "Route not found" / 404 on Login**

### **Symptoms:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Login error: AxiosError
Error: Route not found
```

### **Root Cause:**
Backend server crashed during startup **BEFORE** routes were registered. The backend is trying to start but port 8000 is already in use by another process.

### **Solution 1: Use the Startup Script (RECOMMENDED)**

The startup script automatically kills processes on ports 3000 and 8000:

**Mac/Linux:**
```bash
./start-hrms.sh
```

**Windows:**
```bash
start-hrms.bat
```

This will:
- ✅ Kill any processes on ports 3000 and 8000
- ✅ Start Docker services
- ✅ Start backend on port 8000
- ✅ Start frontend on port 3000

---

### **Solution 2: Manual Port Cleanup**

If you're starting backend manually (not recommended):

**Mac/Linux:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill all nodemon processes
pkill -9 -f nodemon

# Wait 2 seconds
sleep 2

# Start backend
cd backend
npm run dev
```

**Windows (PowerShell):**
```powershell
# Find and kill process on port 8000
$process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}

# Start backend
cd backend
npm run dev
```

**Windows (Command Prompt):**
```cmd
# Kill process on port 8000
for /f "tokens=5" %a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %a

# Start backend
cd backend
npm run dev
```

---

### **Solution 3: Check if Backend is Actually Running**

Open http://localhost:8000/api/health in your browser (or create this endpoint).

If you see an error or "can't connect", backend is not running.

**Check backend terminal:**
- ✅ Should see: "✅ Database ready (25 models registered)"
- ✅ Should see: "🚀 HRMS Go V5 API Server Started Successfully"
- ❌ If you see: "Error: listen EADDRINUSE: address already in use :::8000" → Port is occupied

---

## ❌ **Error: "secretOrPrivateKey must have a value"**

### **Symptoms:**
```
Error: secretOrPrivateKey must have a value
```

### **Root Cause:**
Missing `JWT_SECRET` or `JWT_REFRESH_SECRET` in `backend/.env`

### **Solution:**

1. Check if `backend/.env` exists:
```bash
ls -la backend/.env
```

2. If not, create it:
```bash
cp backend/.env.example backend/.env
```

3. Verify environment variables:
```bash
cd backend
npm run check:env
```

You should see:
```
✅ JWT_SECRET: ********
✅ JWT_REFRESH_SECRET: ********
```

4. Restart backend:
```bash
./start-hrms.sh
```

**See Also:** `TEAM_ENV_SETUP.md` for detailed environment setup.

---

## ❌ **Error: Database Connection Failed**

### **Symptoms:**
```
❌ Database connection error: connect ECONNREFUSED 127.0.0.1:3306
```

### **Root Cause:**
MySQL is not running or Docker services are not started.

### **Solution:**

1. **Check Docker is running:**
```bash
docker ps
```

You should see:
```
hrms_mysql      (healthy)
hrms_phpmyadmin (healthy)
```

2. **If Docker is not running:**
```bash
# Start Docker Desktop (Mac/Windows)
# Then run:
docker-compose up -d
```

3. **Wait for MySQL to be ready:**
```bash
# Wait 30 seconds for MySQL to initialize
sleep 30
```

4. **Verify MySQL connection:**
```bash
# Access phpMyAdmin
open http://localhost:8080

# Login with:
# Server: mysql
# Username: root
# Password: root
```

5. **Restart backend:**
```bash
cd backend
npm run dev
```

---

## ❌ **Error: npm install fails**

### **Symptoms:**
```
npm error ERESOLVE could not resolve
```

### **Root Cause:**
npm version incompatibility or peer dependency conflicts.

### **Solution:**

**For npm 8-11 (recommended):**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

The `.npmrc` file will automatically handle peer dependencies.

**If still failing:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**See Also:** Check `package.json` → `engines` for required Node/npm versions.

---

## ❌ **Error: Frontend not displaying data from backend**

### **Symptoms:**
- Login works, but dashboard shows no data
- Settings pages show "No data available"

### **Root Cause:**
Database is empty (no sample data).

### **Solution:**

1. **Run database setup:**
```bash
cd backend
npm run setup
```

This will:
- ✅ Create all tables (25 models)
- ✅ Create admin user (admin@hrms.com / admin123)
- ✅ Seed general settings
- ✅ Seed sample data (employees, attendance, leaves, etc.)

2. **Verify data in phpMyAdmin:**
```
http://localhost:8080
```

Check tables:
- `users` → Should have admin@hrms.com
- `employees` → Should have 8 sample employees
- `attendance` → Should have attendance records
- `general_settings` → Should have 83+ settings

3. **Refresh frontend:**
```bash
# Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
# Or hard reload
```

---

## ❌ **Error: Docker port conflicts**

### **Symptoms:**
```
Error: Bind for 0.0.0.0:3306 failed: port is already allocated
```

### **Root Cause:**
Another MySQL service is running on port 3306 (XAMPP, MAMP, local MySQL).

### **Solution:**

**Option 1: Stop conflicting service**
```bash
# Stop XAMPP
# Or stop local MySQL
brew services stop mysql  # Mac
sudo systemctl stop mysql # Linux
```

**Option 2: Change Docker ports**

Edit `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Use port 3307 instead
```

Then update `backend/.env`:
```env
DB_PORT=3307
```

Restart:
```bash
docker-compose down
docker-compose up -d
```

---

## ❌ **Error: Cannot connect to http://localhost:3000**

### **Symptoms:**
Frontend not loading, "This site can't be reached".

### **Root Cause:**
Frontend server not started or crashed.

### **Solution:**

1. **Check frontend terminal:**
```
Should see: "webpack compiled successfully"
Should see: "On Your Network: http://192.168.x.x:3000"
```

2. **Check for errors:**
```
If you see compilation errors, fix them first
```

3. **Restart frontend:**
```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Start frontend
npm start
```

4. **Check browser console:**
```
F12 → Console tab
Look for CORS errors or network errors
```

---

## ⚠️ **Warning: Different behavior between team members**

### **Symptoms:**
- Works on your machine
- Doesn't work on teammate's machine

### **Possible Causes:**

1. **Different Node/npm versions:**
```bash
# Check versions
node -v  # Should be: v16-v24
npm -v   # Should be: 8-11

# Fix: Install correct version
nvm install 22
nvm use 22
```

2. **Different operating systems:**
- Mac/Linux: Use `./start-hrms.sh`
- Windows: Use `start-hrms.bat`

3. **Different .env files:**
```bash
# Ensure backend/.env exists and has all variables
cd backend
npm run check:env
```

4. **Different Docker setup:**
```bash
# Verify Docker is running
docker ps

# Should see 2 containers: hrms_mysql, hrms_phpmyadmin
```

---

## 🔍 **Debugging Checklist**

Before asking for help, check:

- [ ] Docker is running (`docker ps`)
- [ ] MySQL is healthy (wait 30 seconds after starting)
- [ ] Backend .env file exists (`backend/.env`)
- [ ] All environment variables are set (`npm run check:env`)
- [ ] Port 8000 is free (not occupied by another process)
- [ ] Port 3000 is free
- [ ] Backend started successfully (see "Database ready" message)
- [ ] Frontend compiled successfully (see "webpack compiled")
- [ ] Database has sample data (check phpMyAdmin)
- [ ] Browser cache cleared (Ctrl+Shift+R)

---

## 🚀 **Quick Reset (When All Else Fails)**

**Complete fresh start:**

```bash
# Stop everything
./stop-hrms.sh  # or stop-hrms.bat

# Stop Docker
docker-compose down

# Clean frontend
rm -rf node_modules package-lock.json
npm cache clean --force

# Clean backend
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
cd ..

# Reinstall
npm install
cd backend
npm install
cd ..

# Fresh database setup
cd backend
npm run setup:fresh  # Creates tables + seeds data
cd ..

# Start everything
./start-hrms.sh  # or start-hrms.bat
```

---

## 📞 **Still Having Issues?**

1. **Check the console logs:**
   - Backend terminal (look for errors)
   - Frontend terminal (look for compilation errors)
   - Browser console (F12 → Console)

2. **Provide full error details:**
   - Error message
   - Stack trace
   - Which step failed
   - Your OS (Mac/Windows/Linux)
   - Node version (`node -v`)
   - npm version (`npm -v`)

3. **Check these files:**
   - `TEAM_SETUP_GUIDE.md` - Complete setup
   - `TEAM_ENV_SETUP.md` - Environment setup
   - `DATABASE_MIGRATION_GUIDE.md` - Database help
   - `TEAM_DEPLOYMENT_GUIDE.md` - Production deployment

---

## ✅ **Expected Successful Startup**

When everything works correctly, you should see:

**Backend Terminal:**
```
✅ Database connection established
✅ Database models synchronized successfully
✅ Database ready (25 models registered)

╔════════════════════════════════════════════════════════════════╗
║         🚀 HRMS Go V5 API Server Started Successfully          ║
╚════════════════════════════════════════════════════════════════╝
📊 Environment:    development
🌐 API URL:        http://localhost:8000/api
💾 Database:       hrms_go_v5
📦 Models Loaded:  25
```

**Frontend Terminal:**
```
webpack compiled successfully
```

**Browser:**
- http://localhost:3000 → Shows login page
- http://localhost:8080 → Shows phpMyAdmin
- No errors in browser console (F12)

---

*If you follow this guide and still have issues, there may be a bug. Please report it with full error logs.*

