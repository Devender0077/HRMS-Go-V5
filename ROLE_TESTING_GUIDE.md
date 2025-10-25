# 🧪 COMPREHENSIVE ROLE TESTING GUIDE

## ✅ Test Account Credentials

| Role | Email | Password | Permissions | Employee ID |
|------|-------|----------|-------------|-------------|
| Employee | employee@test.com | Test@123 | 16 | EMP030 |
| Manager | manager@test.com | Test@123 | 27 | MGR001 |
| HR | hr@test.com | Test@123 | 41 | HR001 |
| HR Manager | hrmanager@test.com | Test@123 | 48 | HRMGR001 |
| Super Admin | superadmin@test.com | Test@123 | 137 (ALL) | ADMIN001 |

---

## 📋 Testing Checklist

### 1️⃣ EMPLOYEE ROLE (employee@test.com / Test@123)

**Dashboard:**
- [ ] Loads Employee Dashboard (not full HR dashboard)
- [ ] Shows personal stats (attendance, leaves, payslips)
- [ ] Quick actions visible (Clock In/Out, Apply Leave, View Payslips)

**Navigation (Should See ONLY):**
- [ ] Dashboard
- [ ] Calendar
- [ ] Attendance → Clock In/Out, Records
- [ ] Leaves → Apply, Applications
- [ ] Payroll → Payslips
- [ ] Documents
- [ ] Training
- [ ] My Account

**Navigation (Should NOT See):**
- [ ] Employees
- [ ] Recruitment
- [ ] Performance (except own)
- [ ] Assets
- [ ] Settings
- [ ] Reports

**Data Access:**
- [ ] Attendance Records: Only own attendance
- [ ] Leave Applications: Only own leaves
- [ ] Payslips: Only own payslips
- [ ] Documents: Only own documents
- [ ] Calendar: Events with "Everyone" or "Private" (own)

**Features:**
- [ ] Clock In: Works successfully
- [ ] Clock Out: Works successfully
- [ ] Apply Leave: Can submit leave request
- [ ] View Details (Attendance): Opens modal with details
- [ ] Export (Attendance): Can export own records

---

### 2️⃣ MANAGER ROLE (manager@test.com / Test@123)

**Dashboard:**
- [ ] Loads Manager Dashboard (team-focused)
- [ ] Shows team stats (team size, present today, pending approvals)
- [ ] Quick actions for team management

**Navigation (Should See):**
- [ ] Dashboard
- [ ] Calendar
- [ ] Employees (View only)
- [ ] Attendance (All features)
- [ ] Leaves (View team + Approve)
- [ ] Performance (Team reviews)
- [ ] Documents
- [ ] Reports (View only)
- [ ] Training
- [ ] My Account

**Navigation (Should NOT See):**
- [ ] Recruitment
- [ ] Assets (Manage)
- [ ] Settings
- [ ] Payroll (All - only own)

**Data Access:**
- [ ] Employees: Only team (same department)
- [ ] Attendance: Team attendance (same department)
- [ ] Leaves: Team leave requests (same department)
- [ ] Payroll: Team payroll (same department)
- [ ] Documents: Team documents (same department)
- [ ] Calendar: "Everyone" + "Managers Only" + own "Private"

**Features:**
- [ ] Can view team employees
- [ ] Can approve/reject team leave requests
- [ ] Can view team attendance
- [ ] Can view team performance

---

### 3️⃣ HR ROLE (hr@test.com / Test@123)

**Dashboard:**
- [ ] Loads Full HR Dashboard
- [ ] Shows company-wide stats
- [ ] All HR features accessible

**Navigation (Should See):**
- [ ] Dashboard
- [ ] Calendar
- [ ] Employees (Full CRUD)
- [ ] Attendance (All)
- [ ] Leaves (All + Approve)
- [ ] Documents (All)
- [ ] Recruitment (All)
- [ ] Performance (All)
- [ ] Training (All)
- [ ] Reports (All)
- [ ] My Account

**Navigation (Should NOT See):**
- [ ] Settings (except view)
- [ ] System Setup
- [ ] Roles/Users management

**Data Access:**
- [ ] Employees: ALL employees
- [ ] Attendance: ALL attendance records
- [ ] Leaves: ALL leave requests
- [ ] Payroll: ALL payroll records (view only)
- [ ] Documents: ALL documents
- [ ] Calendar: "Everyone" + "HR Only" + own "Private"

**Features:**
- [ ] Can create/edit/delete employees
- [ ] Can approve/reject all leave requests
- [ ] Can view all attendance
- [ ] Can manage recruitment
- [ ] Can view all documents

---

### 4️⃣ HR MANAGER ROLE (hrmanager@test.com / Test@123)

**Dashboard:**
- [ ] Loads Full HR Dashboard
- [ ] Shows company-wide stats
- [ ] All management features accessible

**Navigation (Should See):**
- [ ] ALL pages except System Setup
- [ ] Full access to HR features
- [ ] Settings (View and Manage)
- [ ] Roles (View)
- [ ] Users (Manage)

**Data Access:**
- [ ] ALL data across all modules
- [ ] Can process payroll
- [ ] Can manage all settings

**Features:**
- [ ] Can do everything HR can do
- [ ] Plus: Process payroll
- [ ] Plus: Manage some settings
- [ ] Plus: View roles and users

---

### 5️⃣ SUPER ADMIN ROLE (superadmin@test.com / Test@123)

**Dashboard:**
- [ ] Loads Full Dashboard
- [ ] Shows all system stats
- [ ] All features accessible

**Navigation (Should See):**
- [ ] ALL PAGES (no filtering)
- [ ] Settings (Full access)
- [ ] System Setup
- [ ] Roles & Permissions
- [ ] Users Management
- [ ] All other modules

**Data Access:**
- [ ] ALL data everywhere
- [ ] No filtering applied
- [ ] Can see all calendar events (bypasses visibility)

**Features:**
- [ ] Can do EVERYTHING
- [ ] Full system configuration
- [ ] Can manage roles and permissions
- [ ] Can create/edit/delete users
- [ ] Can access all system settings

---

## 🧪 How to Test

### Quick Test (5 minutes):
1. Logout current session
2. Login with each role
3. Check navigation sidebar
4. Check dashboard type
5. Try accessing one restricted page

### Full Test (20 minutes):
1. Logout current session
2. Login with each role
3. Verify all navigation items
4. Test dashboard features
5. Test data access (employees, attendance, leaves)
6. Try creating/editing records
7. Verify permissions work correctly

---

## 📊 Expected Results Summary

| Feature | Employee | Manager | HR | HR Manager | Super Admin |
|---------|----------|---------|----|-----------  |-------------|
| Own Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| See All Employees | ❌ | Team Only | ✅ | ✅ | ✅ |
| Clock In/Out | ✅ | ✅ | ✅ | ✅ | ✅ |
| View All Attendance | ❌ | Team Only | ✅ | ✅ | ✅ |
| Approve Leaves | ❌ | Team Only | ✅ | ✅ | ✅ |
| View All Payroll | ❌ | Team Only | View Only | ✅ | ✅ |
| Process Payroll | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Settings | ❌ | ❌ | ❌ | Partial | ✅ |
| Manage Roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| System Setup | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🔍 Verification Commands

Run these in browser console after login:

```javascript
// Check permissions loaded
JSON.parse(localStorage.getItem('permissions')).length

// Check user type
JSON.parse(localStorage.getItem('user')).userType

// Check if specific permission exists
JSON.parse(localStorage.getItem('permissions')).includes('employees.view')

// See all permissions
JSON.parse(localStorage.getItem('permissions'))
```

---

## 🎯 Next Steps After Testing

1. Note any issues found for each role
2. Verify data filtering works correctly
3. Check that restricted pages return "Access Denied"
4. Ensure navigation filters correctly
5. Report any bugs or inconsistencies

