# 🚀 HRMS Go V5 - Team Setup Instructions

**Quick setup guide for team members after pulling from GitHub**

---

## 📋 Prerequisites

- **Node.js** v16+ installed
- **MySQL** 5.7+ or 8.0+ running
- **npm** or **yarn** package manager
- **Git** installed

---

## 🔧 Step 1: Clone/Pull Repository

```bash
git clone <repository-url>
cd "HRMSGO V5"
```

Or if already cloned:
```bash
git pull origin main
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create Database
Open phpMyAdmin or MySQL Workbench and run:
```sql
CREATE DATABASE IF NOT EXISTS hrms_go_v5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.2 Import Base Schema
```sql
-- Import this file in phpMyAdmin or run:
mysql -u root -p hrms_go_v5 < backend/database/schema.sql
```

### 2.3 Import Sample Data
```sql
-- Import this file in phpMyAdmin or run:
mysql -u root -p hrms_go_v5 < backend/database/seeds.sql
```

### 2.4 Run Migrations (IMPORTANT!)
These are **safe to run multiple times** - they check if changes already exist:

**Option A: Via phpMyAdmin**
1. Open phpMyAdmin → Select `hrms_go_v5` database
2. Click "SQL" tab
3. Copy & paste contents of `backend/database/add_region_fields_to_employees.sql`
4. Click "Go"
5. Copy & paste contents of `backend/database/fix_calendar_event_creators.sql`
6. Click "Go"

**Option B: Via Terminal**
```bash
mysql -u root -p hrms_go_v5 < backend/database/add_region_fields_to_employees.sql
mysql -u root -p hrms_go_v5 < backend/database/fix_calendar_event_creators.sql
```

---

## ⚙️ Step 3: Backend Setup

### 3.1 Create Environment File
```bash
cd backend
cp .env.example .env
```

### 3.2 Configure .env
Edit `backend/.env` with your credentials:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=your_mysql_password

# Server
PORT=8000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Pusher (Optional - for real-time features)
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap2
```

### 3.3 Install Dependencies
```bash
npm install
```

### 3.4 Start Backend
```bash
npm start
```

**Expected Output:**
```
✅ Total: 53 models loaded (Holiday model added!)
✅ Database ready (53 models registered)
✅ All associations configured
🌐 Server running on port 8000
🔐 JWT Authentication enabled
```

**If you see errors:** Check that all migrations were run successfully in Step 2.4

---

## 🎨 Step 4: Frontend Setup

### 4.1 Open New Terminal
```bash
cd "HRMSGO V5"
# (Make sure you're in the project root, not backend folder)
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Start Frontend
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view hrms-go-v5 in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 🔐 Step 5: Login

Open browser: `http://localhost:3000`

### Default Credentials:
```
Superadmin:
Email: superadmin@hrms.com
Password: Admin@123

HR Manager:
Email: hr.manager@hrms.com
Password: HR@123

Employee:
Email: john.smith@hrms.com
Password: Emp@123
```

---

## ✅ Step 6: Verify Everything Works

### Test These Pages:
1. **Dashboard** - `http://localhost:3000/dashboard/app`
2. **Calendar** - `http://localhost:3000/dashboard/calendar`
   - Should show user badges and creator info
3. **Holidays** - `http://localhost:3000/dashboard/settings/holidays`
   - Should load without 404 errors
4. **Employees** - `http://localhost:3000/dashboard/hr/employees/new`
   - Should show region fields (India/USA)
5. **Leave Management** - `http://localhost:3000/dashboard/leaves/apply`
   - Should show leave balances

---

## 🐛 Common Issues & Fixes

### Issue 1: Backend Fails with "Key column 'region' doesn't exist"
**Fix:** Run the migration files in Step 2.4

### Issue 2: "404 Not Found" on `/api/holidays`
**Fix:** Restart backend (`Ctrl+C`, then `npm start`)

### Issue 3: Calendar user badges not showing
**Fix:** Run `backend/database/fix_calendar_event_creators.sql`

### Issue 4: "Cannot connect to database"
**Fix:** 
- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database `hrms_go_v5` exists

### Issue 5: Port already in use
**Fix:**
- Backend (8000): `lsof -ti:8000 | xargs kill -9`
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`

### Issue 6: "Module not found" errors
**Fix:** Delete `node_modules` and reinstall:
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

## 📦 What's Included

### Features:
✅ Complete HRMS with RBAC  
✅ Leave Management System  
✅ Attendance Tracking (Clock In/Out, Calendar, Muster)  
✅ Employee Management (with USA/India region fields)  
✅ Payroll & Salary Management  
✅ Holiday Management  
✅ Contract Management  
✅ Finance (Expenses, Income, Reports)  
✅ Recruitment (Job Postings, Applications)  
✅ Documents Management  
✅ Calendar with Event Management  
✅ Real-time Notifications (Pusher)  
✅ Performance Management  
✅ Training Programs  

### Tech Stack:
- **Frontend:** React, Material-UI (Minimals.cc theme), Redux
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** MySQL 8.0
- **Authentication:** JWT

---

## 📞 Need Help?

If you encounter any issues:
1. Check this guide's "Common Issues" section
2. Verify all migration files were run
3. Check backend and frontend terminals for error messages
4. Ensure all dependencies are installed

---

## 🎉 You're All Set!

Your HRMS Go V5 is now ready to use. Happy coding! 🚀

