# 🔧 Environment Setup Guide for Team

## ⚠️ Common Issue: "secretOrPrivateKey" Error

If you or your team sees this error:
```
Error: secretOrPrivateKey must have a value
```

**This means the `.env` file is missing or incomplete.**

---

## ✅ Quick Fix (3 Steps)

### Step 1: Check if .env exists
```bash
ls backend/.env
```

**If file doesn't exist:**
```bash
cp backend/.env.example backend/.env
```

### Step 2: Verify environment variables
```bash
cd backend
npm run check:env
```

**Expected Output:**
```
✅ ALL ENVIRONMENT VARIABLES SET!
```

### Step 3: Restart backend
```bash
cd backend
npm run dev
```

---

## 📋 Required Environment Variables

The `backend/.env` file MUST contain:

### Database Configuration
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=root
```

### Server Configuration
```
PORT=8000
NODE_ENV=development
```

### CORS Configuration
```
CORS_ORIGIN=http://localhost:3000
```

### JWT Configuration (CRITICAL!)
```
JWT_SECRET=hrms-go-v5-secret-key-2025
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=hrms-go-v5-refresh-secret-key-2025
JWT_REFRESH_EXPIRATION=7d
```

### Database Sync Strategy
```
DB_SYNC_STRATEGY=development
```

---

## 🔍 How to Verify .env is Working

### Method 1: Use Environment Checker
```bash
cd backend
npm run check:env
```

**Output shows:**
- ✅ All variables present
- ❌ Missing variables (if any)

### Method 2: Check Manually
```bash
cd backend
cat .env | grep JWT
```

**Should show:**
```
JWT_SECRET=hrms-go-v5-secret-key-2025
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=hrms-go-v5-refresh-secret-key-2025
JWT_REFRESH_EXPIRATION=7d
```

### Method 3: Test Backend Startup
```bash
cd backend
npm run dev
```

**If .env is correct, you'll see:**
```
✅ Database ready (25 models registered)
🚀 Server running on port 8000
```

**If .env is wrong, you'll see:**
```
❌ Error: secretOrPrivateKey must have a value
```

---

## 🚀 Team Setup Checklist

When cloning the repository:

- [ ] 1. Clone repository
  ```bash
  git clone https://github.com/Devender0077/HRMS-Go-V5.git
  cd HRMS-Go-V5
  ```

- [ ] 2. Start Docker
  ```bash
  docker-compose up -d
  ```

- [ ] 3. Setup Backend .env
  ```bash
  cd backend
  
  # Check if .env exists
  ls .env
  
  # If not, create from example
  cp .env.example .env
  
  # Verify it's correct
  npm run check:env
  ```

- [ ] 4. Install Dependencies
  ```bash
  # Backend
  cd backend
  npm install
  
  # Frontend
  cd ..
  npm install
  ```

- [ ] 5. Setup Database
  ```bash
  cd backend
  npm run setup
  ```

- [ ] 6. Start Services
  ```bash
  # Method 1: Use script (Mac/Linux)
  ./start-hrms.sh
  
  # Method 2: Manual
  cd backend && npm run dev     # Terminal 1
  npm start                     # Terminal 2
  ```

- [ ] 7. Login
  ```
  URL: http://localhost:3000
  Email: admin@hrms.com
  Password: admin123
  ```

---

## 🔧 Troubleshooting

### Error: "secretOrPrivateKey must have a value"

**Cause:** JWT_SECRET or JWT_REFRESH_SECRET missing from `.env`

**Solution:**
```bash
cd backend

# Check .env exists
ls .env

# If missing, create it
cp .env.example .env

# Verify JWT variables are present
grep JWT .env

# Should show:
# JWT_SECRET=hrms-go-v5-secret-key-2025
# JWT_EXPIRATION=24h
# JWT_REFRESH_SECRET=hrms-go-v5-refresh-secret-key-2025
# JWT_REFRESH_EXPIRATION=7d
```

### Error: "Cannot connect to database"

**Cause:** Docker not running or .env has wrong credentials

**Solution:**
```bash
# Check Docker is running
docker ps

# Should see:
# hrms_mysql
# hrms_phpmyadmin

# If not, start Docker
docker-compose up -d
sleep 30  # Wait for MySQL

# Check .env has correct DB credentials
cd backend
cat .env | grep DB_
```

### Error: "Port 8000 already in use"

**Cause:** Backend already running

**Solution:**
```bash
# Mac/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Then restart
cd backend
npm run dev
```

---

## 📝 For Team Leads

**When sharing the project:**

1. ✅ **DO include** `.env.example` in repository
2. ❌ **DON'T include** `.env` in repository (it's in .gitignore)
3. ✅ **DO document** that team needs to create `.env` from `.env.example`
4. ✅ **DO run** `npm run check:env` before starting backend

**Add to your README or onboarding:**
```
⚠️ IMPORTANT: Create backend/.env file before starting!

Quick setup:
  cp backend/.env.example backend/.env
  cd backend && npm run check:env
```

---

## 🎯 Quick Reference

**Check environment:**
```bash
cd backend
npm run check:env
```

**Start servers:**
```bash
# Mac/Linux
./start-hrms.sh

# Windows
start-hrms.bat

# Manual
cd backend && npm run dev  # Terminal 1
npm start                  # Terminal 2
```

**Stop servers:**
```bash
# Mac/Linux
./stop-hrms.sh

# Windows
stop-hrms.bat
```

---

*Last Updated: October 2025*

