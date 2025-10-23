# 🔐 Login Credentials - HRMS Go V5

## Default Admin Account

After running `npm run setup` in the backend, a default admin account is automatically created:

```
Email:    admin@hrms.com
Password: admin123
```

---

## ⚠️ Security Warning

**IMPORTANT:** The default password `admin123` is for initial setup only.

**You MUST change this password immediately after first login!**

### How to Change Password

1. Login with default credentials
2. Navigate to **Settings** → **Profile**
3. Click **Change Password**
4. Set a strong password

---

## Creating Admin User Manually

If the admin user doesn't exist, you can create it manually:

### Method 1: Using npm script (Recommended)
```bash
cd backend
npm run seed:admin
```

### Method 2: Via phpMyAdmin
1. Open: http://localhost:8080
2. Login: root / root
3. Select `hrms_go_v5` database
4. Go to `users` table
5. Insert new record:
   - name: `System Administrator`
   - email: `admin@hrms.com`
   - password: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` (hashed: admin123)
   - user_type: `super_admin`
   - status: `active`

### Method 3: Run Setup Script
```bash
cd backend
npm run setup  # Creates admin user + all tables + sample data
```

---

## User Types

The system supports different user types with varying permissions:

1. **super_admin** - Full system access
2. **admin** - Administrative access
3. **hr_manager** - HR management access
4. **hr** - HR operations access
5. **manager** - Department/team management
6. **employee** - Basic employee access

---

## Creating Additional Users

### Via Application UI
1. Login as admin
2. Navigate to **Employees** → **Add Employee**
3. Fill employee details
4. System creates user account automatically

### Via API
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securePassword123",
  "userType": "employee"
}
```

---

## Password Requirements

- Minimum length: 6 characters
- Recommended: 8+ characters with mix of letters, numbers, and symbols
- Passwords are hashed using bcrypt (10 rounds)
- Stored securely in database

---

## Forgot Password

If you forget your password:

1. Click **Forgot Password** on login page
2. Enter your email
3. Follow reset instructions sent to your email

**Note:** Email must be configured in General Settings for this to work.

---

## Security Best Practices

✅ **Change default password immediately**  
✅ **Use strong, unique passwords**  
✅ **Enable 2FA when available**  
✅ **Don't share credentials**  
✅ **Use password manager**  
✅ **Log out when done**  
✅ **Review user access regularly**  

---

## Troubleshooting

### Can't login with admin@hrms.com

**Check if user exists:**
```bash
# Via MySQL
docker exec -it hrms_mysql mysql -uroot -proot hrms_go_v5 -e "SELECT id, name, email, user_type, status FROM users WHERE email='admin@hrms.com';"
```

**If user doesn't exist:**
```bash
cd backend
npm run seed:admin
```

### Invalid credentials error

1. Verify email is correct: `admin@hrms.com`
2. Verify password is correct: `admin123`
3. Check backend logs for errors
4. Verify database connection: `npm run migrate:status`

### Account is inactive

Update user status in database:
```sql
UPDATE users SET status='active' WHERE email='admin@hrms.com';
```

---

## Production Deployment

For production, you should:

1. **Create a strong admin password** during setup
2. **Delete default admin** and create new admin with different email
3. **Use environment-specific credentials**
4. **Enable additional security features** (2FA, IP whitelist, etc.)
5. **Regularly audit user accounts**

---

*Last Updated: October 2025*

