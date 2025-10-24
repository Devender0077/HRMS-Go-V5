# 🧹 Users Table Cleanup - Architecture Update

**Date:** October 24, 2025  
**Status:** ✅ Complete

---

## 📊 Summary

Successfully cleaned up the `users` table by removing all employee-type users, establishing a clear separation between authentication (users table) and HR data (employees table).

---

## ✅ What Was Changed

### Before Cleanup:
- **users table:** 11 users (1 super_admin, 1 manager, 9 employees)
- **Problem:** Mixed authentication and HR data
- **Confusion:** Employees had login access

### After Cleanup:
- **users table:** 5 users (super_admin, hr_manager, hr, manager only)
- **employees table:** 8 employees (HR records only, no login)
- **Benefit:** Clear separation of concerns

---

## 🔐 Current Admin Accounts

All accounts use password: `password123`

| Email | Name | Role | Purpose |
|-------|------|------|---------|
| `admin@hrms.com` | System Administrator | super_admin | Full system access |
| `hr.manager@hrmsgo.com` | Senior HR Manager | hr_manager | HR management |
| `hr@hrmsgo.com` | HR Manager | hr | HR operations |
| `manager@hrmsgo.com` | Department Manager | manager | Team management |
| `jane.smith@company.com` | Jane Smith | manager | Team management |

---

## 👥 Employees (HR Records Only)

8 employees exist in the `employees` table with **NO** login access:

1. John Doe (EMP001)
2. Jane Smith (EMP002)
3. Bob Johnson (EMP003)
4. Sarah Williams (EMP004)
5. David Brown (EMP005)
6. Emily Davis (EMP006)
7. Robert Miller (EMP007)
8. Lisa Anderson (EMP008)

**Note:** These employees do NOT have user accounts and cannot login.

---

## 🏗️ New Architecture

### users Table
- **Purpose:** Authentication and role-based access control
- **User Types:** `super_admin`, `hr_manager`, `hr`, `manager`
- **NO** employee-type users
- **Fields:** id, email, password, name, user_type, status, etc.

### employees Table
- **Purpose:** HR management (attendance, payroll, performance)
- **Fields:** id, user_id, employee_id, first_name, last_name, department, etc.
- **user_id:** Usually NULL (employees don't login)
- **Exception:** Can link to users table if employee is also a manager/hr

### Benefits
✅ Clear separation of concerns  
✅ Better security (employees can't login unless granted admin role)  
✅ Easier role management  
✅ Scalable architecture  
✅ Matches industry best practices  

---

## ⚠️ Important Changes

### Clock In/Out Feature
**OLD:** Employees logged in and clocked in themselves  
**NEW:** Employees no longer have login access

**Options:**
1. **Admin/HR/Manager** clock in on behalf of employees
2. Build separate **employee self-service portal**
3. Use **biometric/kiosk** for employee attendance
4. Manage attendance via: Dashboard → Attendance → Records

### Employee Self-Service
If you need employees to have limited access (view payslips, apply leave, etc.):
- Create separate employee portal with minimal permissions
- Or grant specific employees manager/hr roles
- Keep authentication separate from HR data

---

## 🔄 Linking User to Employee

If you need to give an employee login access (e.g., promote to manager):

```sql
-- Step 1: Create user account
INSERT INTO users (email, password, name, user_type, status, created_at, updated_at)
VALUES ('john.doe@hrmsgo.com', '$2a$10$...', 'John Doe', 'manager', 'active', NOW(), NOW());

-- Step 2: Link to employee record
UPDATE employees 
SET user_id = (SELECT id FROM users WHERE email = 'john.doe@hrmsgo.com')
WHERE employee_id = 'EMP001';
```

**Result:** John Doe can now:
- ✅ Login as manager
- ✅ Manage his team
- ✅ Clock in/out (has employee profile)
- ✅ Access all manager features

---

## 📋 Scripts Created

### 1. cleanupUserTable.js
```bash
node backend/database/cleanupUserTable.js
```
- Removes all employee-type users
- Updates employees.user_id to NULL
- Verifies cleanup
- Can be run multiple times safely

### 2. createEmployeeForUser.js
```bash
node backend/database/createEmployeeForUser.js
```
- Creates employee profile for a user
- Interactive prompts
- Use when linking admin/manager to employee

### 3. resetEmployeePassword.js
```bash
node backend/database/resetEmployeePassword.js
```
- Resets passwords for admin accounts
- Legacy from old architecture
- Still useful for password resets

---

## 🧪 Testing

### Login Test
1. Logout from current session
2. Go to: `http://localhost:3000/`
3. Login with:
   - **Email:** `admin@hrms.com` (or any account above)
   - **Password:** `password123`
4. Should have full access to dashboard ✅

### Features Available
✅ Dashboard  
✅ Employee management  
✅ Attendance management (admin view)  
✅ Settings  
✅ All HR features  

### Features Not Available (Expected)
❌ Employee self-clock-in (employees don't have login)  
❌ Employee self-service portal (not built yet)  

---

## 📊 Database Statistics

### Before Cleanup:
- Users: 11 (mixed types)
- Employees: 8 (linked to users)

### After Cleanup:
- Users: 5 (admin only)
- Employees: 8 (standalone HR records)

### SQL Verification:
```sql
-- Check users table
SELECT user_type, COUNT(*) as count 
FROM users 
GROUP BY user_type;

-- Check employees without user accounts
SELECT COUNT(*) 
FROM employees 
WHERE user_id IS NULL;

-- Check employees with user accounts
SELECT e.employee_id, e.first_name, e.last_name, u.email, u.user_type
FROM employees e
INNER JOIN users u ON e.user_id = u.id;
```

---

## 🚀 Next Steps (Optional)

### 1. Employee Self-Service Portal
Build separate portal for employees:
- Limited access (view payslips, apply leave)
- No full system access
- Use biometric/PIN for authentication

### 2. Attendance Kiosk
Implement kiosk system:
- Employees clock in via biometric
- No user login required
- Direct API calls to attendance table

### 3. Mobile App
Create employee mobile app:
- Clock in/out with GPS
- View schedules
- Apply for leave
- No admin access

---

## 📚 Reference

### User Types
- `super_admin` - Full system access
- `hr_manager` - Senior HR role
- `hr` - HR operations
- `manager` - Department/team management

### Employee Status
- `active` - Currently employed
- `inactive` - Terminated/on leave
- `probation` - Probation period

---

## ✅ Checklist

- [x] Removed all employee-type users from users table
- [x] Updated employees.user_id to NULL
- [x] Created new HR/manager test accounts
- [x] Verified database consistency
- [x] Tested admin login
- [x] Documented changes
- [x] Created cleanup scripts

---

## 🎯 Result

**Clean, scalable architecture with proper separation of concerns!**

- ✅ Users table: Authentication only (5 admin accounts)
- ✅ Employees table: HR data only (8 employee records)
- ✅ Clear boundaries between roles
- ✅ Better security model
- ✅ Industry best practices

---

**For questions or issues, refer to the scripts in `backend/database/` folder.**

