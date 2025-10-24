# 🔧 Clock In/Out Troubleshooting Guide

## ❌ Error: 400 Bad Request on Clock In

### 🎯 **Root Cause**
Your logged-in user account does NOT have an employee profile in the database.

### 📊 **Database Status**

**Users WITHOUT Employee Profile (❌ Can't use clock in/out):**
- `john.doe@company.com` (user_id: 2)
- `jane.smith@company.com` (user_id: 3)
- `admin@hrms.com` (user_id: 5)

**Users WITH Employee Profile (✅ Can use clock in/out):**
- `john.doe@hrmsgo.com` (user_id: 6 → employee_id: 31) ✅
- `jane.smith@hrmsgo.com` (user_id: 7 → employee_id: 32) ✅
- `bob.johnson@hrmsgo.com` (user_id: 8 → employee_id: 33) ✅
- `sarah.williams@hrmsgo.com` (user_id: 9 → employee_id: 34) ✅
- `david.brown@hrmsgo.com` (user_id: 10 → employee_id: 35) ✅
- `emily.davis@hrmsgo.com` (user_id: 11 → employee_id: 36) ✅
- `robert.miller@hrmsgo.com` (user_id: 12 → employee_id: 37) ✅
- `lisa.anderson@hrmsgo.com` (user_id: 13 → employee_id: 38) ✅

---

## ✅ **Solution 1: Login with Working Account** (QUICKEST)

### Steps:
1. **Logout** from current account
2. **Login** with:
   - **Email:** `john.doe@hrmsgo.com`
   - **Password:** Check your database (likely `password` or `admin123`)
3. **Test clock in/out** → Will work immediately! ✅

### To find password:
```sql
SELECT email, password FROM users WHERE email = 'john.doe@hrmsgo.com';
```

---

## ✅ **Solution 2: Create Employee Profile** (For Current User)

### Option A: Interactive Script (Easiest)

```bash
cd backend
node database/createEmployeeForUser.js
```

**What it does:**
1. Shows all users without employee profiles
2. Asks which user you want to create profile for
3. Asks for first name and last name
4. Creates employee record automatically
5. Done! You can now use clock in/out ✅

### Option B: Manual SQL

```sql
-- First, find your user_id
SELECT id, email FROM users WHERE email = 'your@email.com';

-- Then create employee record
INSERT INTO employees (
  user_id,
  employee_id,
  first_name,
  last_name,
  email,
  joining_date,
  employment_type,
  status
) VALUES (
  YOUR_USER_ID,      -- Replace with your actual user_id (e.g., 2, 3, or 5)
  'EMP0042',         -- Unique employee code
  'Your',            -- Your first name
  'Name',            -- Your last name
  'your@email.com',  -- Your email
  CURDATE(),         -- Today's date
  'full_time',       -- Employment type
  'active'           -- Status
);
```

**Verify it worked:**
```sql
SELECT u.id, u.email, e.id as emp_id, e.employee_id, e.first_name, e.last_name
FROM users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE u.email = 'your@email.com';
```

You should see employee data filled in ✅

---

## 🎯 **Why Is This Happening?**

Your HRMS has **two separate tables**:

### 1. `users` Table → For Authentication
- Handles login/logout
- Stores email, password, user_type
- Used for access control

### 2. `employees` Table → For HR Data
- Stores employee details
- Links to users table via `user_id`
- Tracks attendance, payroll, department, etc.

### The Relationship:
```
users (id=6) -----> employees (user_id=6)
john.doe@hrmsgo.com   John Doe (EMP0031)
```

### What Works With Just a User Account:
✅ Login
✅ Logout
✅ View dashboard
✅ Change settings

### What Requires an Employee Profile:
❌ Clock in/out
❌ Apply for leave
❌ View payslips
❌ Submit expense claims
❌ View attendance records
❌ Etc.

---

## 🔍 **Check Your Status**

### Quick Check Script:
```bash
cd backend
node -e "
const db = require('./config/database');
db.query(\`
  SELECT u.id, u.email, e.id as emp_id, 
         CONCAT(e.first_name, ' ', e.last_name) as name,
         CASE WHEN e.id IS NULL THEN '❌ NO PROFILE' ELSE '✅ HAS PROFILE' END as status
  FROM users u
  LEFT JOIN employees e ON u.id = e.user_id
  ORDER BY u.id
\`).then(([rows]) => {
  console.log('\\nUSER → EMPLOYEE MAPPING:\\n');
  rows.forEach(r => console.log(\`\${r.email.padEnd(30)} | \${r.status}\`));
  process.exit(0);
});
"
```

---

## 🧪 **Testing After Fix**

After creating employee profile or logging in with a working account:

1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

2. **Visit clock page:**
   ```
   http://localhost:3000/dashboard/attendance/clock
   ```

3. **Click "Clock In"**
   - Should see: "Successfully clocked in!" ✅
   - Should NOT see: "400 Bad Request" ❌

4. **Refresh page**
   - Status should persist ✅
   - Timer should continue ✅

5. **Click "Clock Out"**
   - Should see: "Successfully clocked out!" ✅
   - Should show total hours worked ✅

---

## 📞 **Still Having Issues?**

### Check Backend Logs:
```bash
tail -50 /tmp/backend.log | grep "clock-in"
```

### Check Console Logs:
Open browser DevTools (F12) → Console tab
Look for:
```
Clock in request: {userId: X, ip: "...", location: "..."}
```

### Verify Employee Lookup:
```bash
curl -X POST http://localhost:8000/api/attendance/clock-in \
  -H "Content-Type: application/json" \
  -d '{"userId": YOUR_USER_ID, "ip": "192.168.1.1", "location": "Test"}'
```

**Expected responses:**
- ✅ Success: `{"success": true, "message": "Clocked in successfully"}`
- ✅ Already clocked in: `{"success": false, "message": "Already clocked in today"}`
- ❌ No profile: `{"success": false, "message": "Employee ID is required..."}`

---

## 🎉 **Summary**

The 400 error is **expected behavior** when a user doesn't have an employee profile.

**Quick Fix:**
1. Logout
2. Login with `john.doe@hrmsgo.com`
3. Test → Works! ✅

**Permanent Fix:**
1. Run: `node database/createEmployeeForUser.js`
2. Create profile for your user
3. Test → Works! ✅

---

**Last Updated:** October 24, 2025
**Status:** ✅ All attendance features working, just needs employee profile

