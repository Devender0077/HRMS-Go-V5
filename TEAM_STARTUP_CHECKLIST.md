# 🚀 HRMS Go V5 - Team Startup Checklist

**Quick checklist when you encounter "Connection Refused" or login errors**

---

## ❌ Common Error: `ERR_CONNECTION_REFUSED`

```
POST http://localhost:8000/api/auth/login net::ERR_CONNECTION_REFUSED
```

**This means:** Backend server is **NOT running!**

---

## ✅ Solution: Start Backend Server

### **Step 1: Check if Backend is Running**

Open terminal and run:
```bash
lsof -i:8000
```

**If it shows nothing:** Backend is NOT running → Go to Step 2

**If it shows a process:** Backend is running → Check .env file instead

---

### **Step 2: Start Backend Server**

```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Total: 53 models loaded
✅ Database ready (53 models registered)
✅ All associations configured
🌐 Server running on port 8000
🔐 JWT Authentication enabled
```

**If you see errors:**
- Check MySQL is running
- Check `backend/.env` has correct database credentials
- Run migrations (see Step 3)

---

### **Step 3: Run Migrations (If Backend Fails to Start)**

If backend shows errors like:
```
❌ Key column 'region' doesn't exist
```

**Solution:** Run these migrations in phpMyAdmin:

1. **Open phpMyAdmin:** http://localhost:8080
2. **Select database:** `hrms_go_v5`
3. **Click "SQL" tab**
4. **Run these files in order:**

```sql
-- File 1: Add region fields to employees
backend/database/add_region_fields_to_employees.sql

-- File 2: Fix calendar creators
backend/database/fix_calendar_event_creators.sql

-- File 3: Update holidays to support multi-region
backend/database/update_holidays_region_to_json.sql

-- File 4: Insert holiday sample data
backend/database/insert_holidays_data.sql
```

5. **Restart backend:** `npm start`

---

## 🔧 Frontend Connection Check

If backend is running but frontend can't connect:

### **Check 1: Backend URL**
Open `src/config-global.js` and verify:
```javascript
export const HOST_API_KEY = 'http://localhost:8000';
```

### **Check 2: Clear Browser Cache**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### **Check 3: Hard Refresh Browser**
- **Mac:** Cmd+Shift+R
- **Windows:** Ctrl+Shift+R

---

## 📋 Complete Startup Sequence

### **From Scratch (First Time Setup):**

```bash
# 1. Pull latest code
git pull origin main

# 2. Setup everything (auto-runs migrations)
./setup-hrms.sh

# 3. Wait for backend to start (watch logs)
tail -f backend.log

# 4. Wait for frontend to compile (watch logs)
tail -f frontend.log

# 5. Login
# URL: http://localhost:3000
# Email: superadmin@hrms.com
# Password: Admin@123
```

### **Subsequent Times:**

```bash
# Just start the servers
./start-hrms.sh
```

---

## 🐛 Troubleshooting

### **Issue 1: Backend won't start - "region column doesn't exist"**
**Fix:** Run migrations in phpMyAdmin (see Step 3 above)

### **Issue 2: Backend won't start - "Connection refused to database"**
**Fix:** 
- Start MySQL
- Check backend/.env credentials
- Verify database `hrms_go_v5` exists

### **Issue 3: Port 8000 already in use**
**Fix:**
```bash
lsof -ti:8000 | xargs kill -9
cd backend
npm start
```

### **Issue 4: Port 3000 already in use**
**Fix:**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

### **Issue 5: Login shows "Network Error"**
**Fix:** Backend is not running → Start backend (Step 2 above)

### **Issue 6: "Module not found" errors**
**Fix:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend  
cd ..
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Verify Everything is Running

### **Check Backend:**
```bash
curl http://localhost:8000/api/health
```
Should return: `{"status":"ok"}`

### **Check Frontend:**
Open browser: `http://localhost:3000`

### **Check Database:**
Open phpMyAdmin: `http://localhost:8080`

---

## 🎯 Quick Commands Reference

```bash
# Check what's running on ports
lsof -i:3000  # Frontend
lsof -i:8000  # Backend
lsof -i:3306  # MySQL

# Kill processes
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:8000 | xargs kill -9  # Kill backend

# Start services
cd backend && npm start         # Start backend
npm start                       # Start frontend (from root)
./setup-hrms.sh                 # First time setup
./start-hrms.sh                 # Subsequent starts

# View logs
tail -f backend.log             # Backend logs
tail -f frontend.log            # Frontend logs
```

---

## 📞 Still Having Issues?

1. Verify MySQL is running
2. Check all migrations are run
3. Verify .env file exists with correct credentials
4. Check node_modules are installed
5. Restart both backend and frontend
6. Clear browser cache

---

**Most Common Fix:** Backend not started → `cd backend && npm start` 🚀

