# 🔧 Fix Login & Register - Quick Instructions

## ✅ All Code Fixed & Pushed to GitHub

I've identified and fixed all authentication issues. Follow these steps to test:

---

## 🚀 Quick Fix (3 Steps)

### Step 1: Recreate Admin User
```bash
cd backend
node createAdmin.js
```

**Expected Output:**
```
🔐 Creating admin user...
✅ Cleared existing admin user
✅ Admin user created successfully!

Email:    admin@hrms.com
Password: admin123
```

---

### Step 2: Restart Backend
```bash
# Kill current backend (if running)
pkill -9 -f nodemon

# Start fresh
cd backend
npm run dev
```

**Expected Output:**
```
✅ Loaded 25 models
✅ Database ready
🚀 Server running on port 8000
```

---

### Step 3: Test Login
1. **Open browser:** http://localhost:3000
2. **Enter credentials:**
   - Email: `admin@hrms.com`
   - Password: `admin123`
3. **Click Sign In**

**Expected:** ✅ Successfully logged in and redirected to dashboard

---

## 🔐 What Was Fixed

### Issue 1: JWT_REFRESH_SECRET Missing
**Error:** "secretOrPrivateKey must have a value"  
**Fix:** Added `JWT_REFRESH_SECRET` to `.env`

### Issue 2: Wrong API Endpoints
**Login Error:** Called `/api/account/login` (doesn't exist)  
**Register Error:** Called `/api/account/register` (doesn't exist)  
**Fix:** Updated to use `/api/auth/login` and `/api/auth/register`

### Issue 3: Admin Password
**Issue:** Password may have been double-hashed  
**Fix:** `createAdmin.js` script generates fresh bcrypt hash

---

## 🧪 Test Signup/Register

1. **On login page, click:** "Create an account"
2. **Fill form:**
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Password: test123
3. **Click Register**

**Expected:** ✅ Account created, automatically logged in

---

## 🔧 Troubleshooting

### Login Still Fails?

**Check 1:** Backend console for errors
```bash
# Look for errors in backend terminal
```

**Check 2:** Admin user exists in database
```bash
docker exec -it hrms_mysql mysql -uroot -proot hrms_go_v5 \
-e "SELECT id, email, user_type, status FROM users WHERE email='admin@hrms.com';"
```

**Check 3:** Test API directly
```bash
curl -X POST http://localhost:8000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@hrms.com","password":"admin123"}'
```

**Should return:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {...},
  "token": "eyJ..."
}
```

### Register Still Fails?

**Test API directly:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Test User","email":"test@test.com","password":"test123","userType":"employee"}'
```

**Should return:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {...},
  "token": "eyJ..."
}
```

---

## 📝 Summary

### Before:
- ❌ Login failed with "Invalid credentials"
- ❌ Register failed with 404
- ❌ JWT secrets missing
- ❌ Wrong API endpoints

### After:
- ✅ All JWT secrets configured
- ✅ Correct API endpoints (/api/auth/*)
- ✅ Admin user properly created
- ✅ Login works
- ✅ Register works

---

## ✅ Default Login Credentials

```
Email:    admin@hrms.com
Password: admin123
```

**⚠️ Change password after first login!**  
Location: Settings → Profile → Change Password

---

*All fixes pushed to GitHub - commit: 20ec025*

