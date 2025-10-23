# 🚨 URGENT: Fix "Route not found" 404 Error

## ❌ **Error Your Team is Getting:**

```
Failed to load resource: the server responded with a status of 404 (Not Found)
JwtContext.js:193 Login error: AxiosError
AuthLoginForm.js:51 Error: Route not found
```

---

## ✅ **Root Causes (TWO ISSUES):**

### **Issue 1: Double `/api/` in URL ✅ FIXED (Latest Fix!)**

**URL in console:**
```
POST http://localhost:8000/api/api/auth/login 404 (Not Found)
                                ^^^^^^^^
                                Double /api/!
```

**What happened:**
- The code was creating URLs with double `/api/api/` instead of single `/api/`
- This has been **FIXED in commit e4ad061**

**Action Required:**
1. Pull latest code: `git pull origin main`
2. Restart frontend (Ctrl+C then `npm start`)
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### **Issue 2: Backend Port Conflict**

**Backend crashed during startup** because port 8000 is already in use. 

When backend crashes, routes are never registered, so frontend gets 404 when trying to call `/api/auth/login`.

---

## 🔧 **IMMEDIATE FIX (Choose One):**

### **Option 1: Use Startup Script (RECOMMENDED)**

This automatically kills processes on ports and starts everything correctly:

**Mac/Linux:**
```bash
./start-hrms.sh
```

**Windows:**
```bash
start-hrms.bat
```

---

### **Option 2: Manual Fix**

**Mac/Linux:**
```bash
# 1. Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# 2. Kill all nodemon
pkill -9 -f nodemon

# 3. Wait 2 seconds
sleep 2

# 4. Start backend
cd backend
npm run dev
```

**Windows (PowerShell):**
```powershell
# 1. Kill process on port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Start backend
cd backend
npm run dev
```

**Windows (Command Prompt):**
```cmd
REM 1. Kill process on port 8000
for /f "tokens=5" %a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %a

REM 2. Start backend
cd backend
npm run dev
```

---

## ✅ **How to Verify It's Fixed:**

1. **Backend terminal should show:**
```
✅ Database ready (25 models registered)

╔════════════════════════════════════════════════════════════════╗
║         🚀 HRMS Go V5 API Server Started Successfully          ║
╚════════════════════════════════════════════════════════════════╝
```

2. **Browser should:**
- Show login page at http://localhost:3000
- Login with admin@hrms.com / admin123 should work
- No 404 errors in console (F12)

---

## ⚠️ **If Still Not Working:**

**Check these:**

1. **Backend .env file exists:**
```bash
ls backend/.env
# If not found, run:
cp backend/.env.example backend/.env
```

2. **Environment variables are set:**
```bash
cd backend
npm run check:env
```

3. **Docker is running:**
```bash
docker ps
# Should show: hrms_mysql and hrms_phpmyadmin
```

4. **Database is set up:**
```bash
cd backend
npm run setup
```

---

## 📝 **For More Help:**

See `TEAM_TROUBLESHOOTING.md` for comprehensive troubleshooting guide.

---

## ✅ **Success Criteria:**

When backend starts successfully, you'll see this in terminal:

```
✅ Loaded 25 models
📦 Starting database synchronization...
✅ MySQL2 Pool connection established successfully
✅ Sequelize ORM connection established
✅ Database models synchronized successfully
✅ Database ready (25 models registered)

╔════════════════════════════════════════════════════════════════╗
║         🚀 HRMS Go V5 API Server Started Successfully          ║
╚════════════════════════════════════════════════════════════════╝
📊 Environment:    development
🌐 API URL:        http://localhost:8000/api
💾 Database:       hrms_go_v5
🔄 Sync Strategy:  development
📦 Models Loaded:  25
```

**NOT this:**
```
[nodemon] app crashed - waiting for file changes before starting...
Error: listen EADDRINUSE: address already in use :::8000
```

---

**Quick Action:** Share this file with your team and ask them to use `./start-hrms.sh` (Mac/Linux) or `start-hrms.bat` (Windows) instead of manually starting backend.

