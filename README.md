# HRMS Go V5 - Complete HR Management System

A comprehensive, modern HR Management System built with React, Node.js, Express, and MySQL.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Installation

**1. Clone the Repository**
```bash
git clone <repository-url>
cd "HRMSGO V5"
```

**2. Setup Database**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE hrms_go_v5;"

# Import schema (creates all 86 tables)
mysql -u root -p hrms_go_v5 < backend/database/schema.sql

# Import sample data (fills all tables)
mysql -u root -p hrms_go_v5 < backend/database/seeds.sql
```

**3. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run reset script (creates users & employees)
node database/COMPLETE_CLEAN_RESET.js

# Start backend
npm start
```

**4. Frontend Setup**
```bash
# Open new terminal
cd ..  # Back to project root
npm install
npm start
```

**5. Login**
```
Open: http://localhost:3000
Email: john.doe@hrms.com
Password: password123
```

---

## 🔐 Test Accounts & Login Credentials

**Password for ALL accounts:** `password123`

### 🔐 System Admins (No employee profile - System operators only)

**1. Super Admin** - `superadmin@hrms.com` / `password123`
- User Type: super_admin
- Role: Super Admin (ALL 134 permissions)
- Employee Profile: NO
- Use For: Full system access, all settings, user management

**2. Admin** - `admin@hrms.com` / `password123`
- User Type: admin
- Role: HR Manager
- Employee Profile: NO
- Use For: Admin tasks, most features

### 👔 HR Staff (With employee profile - Can manage HR + use own leaves)

**3. HR Manager** - `hr.manager@hrms.com` / `password123`
- User Type: hr_manager
- Role: HR Manager (~110 permissions)
- Employee: HR001 (Sarah Johnson)
- Department: Human Resources
- Use For: All HR operations + own leaves/attendance

**4. HR** - `hr@hrms.com` / `password123`
- User Type: hr
- Role: HR (~85 permissions)
- Employee: HR002 (Emily Chen)
- Department: Human Resources
- Use For: HR operations + own leaves/attendance

### 👔 Managers (With employee profile - Can manage team + use own leaves)

**5. Engineering Manager** - `manager@hrms.com` / `password123`
- User Type: manager
- Role: Manager (~70 permissions)
- Employee: MGR001 (Michael Rodriguez)
- Department: Engineering
- Salary: $95,000
- Use For: Team management + own leaves/attendance

**6. Sales Manager** - `manager2@hrms.com` / `password123`
- User Type: manager
- Role: Manager (~70 permissions)
- Employee: MGR002 (Lisa Anderson)
- Department: Sales
- Salary: $92,000
- Use For: Team management + own leaves/attendance

### 👔 Employees (With employee profile - Own data only)

**7. John Doe** - `john.doe@hrms.com` / `password123` ⭐ **RECOMMENDED FOR TESTING**
- User Type: employee
- Role: Employee (~40 permissions)
- Employee: EMP001
- Department: Engineering
- Designation: Senior Engineer
- Salary: $75,000
- Leave Balances: All 9 types allocated (Annual: 20, Sick: 10, Casual: 7, etc.)
- Use For: Testing employee features, leave application, clock in/out

**8. Sarah Williams** - `sarah.williams@hrms.com` / `password123`
- Employee: EMP002, Engineering, Senior Engineer, $72,000

**9. David Brown** - `david.brown@hrms.com` / `password123`
- Employee: EMP003, Sales, Senior Engineer, $68,000

**10. Emily Davis** - `emily.davis@hrms.com` / `password123`
- Employee: EMP004, Sales, Junior Engineer, $62,000

### 👤 Additional Employees (No login access - Managed by HR)
- EMP005 to EMP010 (6 employees without user accounts)

---

## 📊 Features

### Core Modules
- ✅ **Dashboard** - Analytics and insights
- ✅ **Employee Management** - Complete employee lifecycle
- ✅ **Attendance** - Clock in/out, regularization, muster reports
- ✅ **Leave Management** - 9 leave types, balances, approvals
- ✅ **Payroll** - Salary components, tax settings, payslips
- ✅ **Performance** - Goals, reviews, KPIs, feedback
- ✅ **Training** - Programs, sessions, enrollments
- ✅ **Recruitment** - Job postings, applications, hiring stages
- ✅ **Assets** - Asset management and assignments
- ✅ **Documents** - Document management and templates
- ✅ **Expenses** - Expense claims and approvals
- ✅ **Calendar** - Events and holidays
- ✅ **Announcements** - Internal communications
- ✅ **Messenger** - Real-time internal chat

### System Features
- ✅ **RBAC** - Role-based access control with 55+ permissions
- ✅ **Settings** - Comprehensive system configuration
- ✅ **Reports** - Custom reports and analytics
- ✅ **Integrations** - Pusher, Slack, Teams, Zoom, Google Calendar
- ✅ **Multi-language** - i18n support
- ✅ **Responsive** - Mobile-friendly design

---

## 🗄️ Database

**Total Tables:** 86

### Core Tables (14)
- users, user_roles, role_permissions, permissions
- employees, branches, departments, designations
- attendance, attendance_policies, shifts
- leave_types, leave_requests, leave_balances

### Additional Tables (72)
All other modules including payroll, performance, training, recruitment, assets, documents, expenses, calendar, announcements, messenger, settings, and configurations.

**Complete list:** See `backend/database/schema.sql`

---

## 📁 Project Structure

```
HRMSGO V5/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── database/         # Database scripts
│   │   ├── schema.sql              # Complete schema (86 tables)
│   │   ├── seeds.sql               # Complete sample data
│   │   ├── COMPLETE_CLEAN_RESET.js # Reset & reseed script
│   │   ├── RESET_ALL_TABLE_IDS.js  # Reset all IDs
│   │   └── seedLeaveData.js        # Seed leave data
│   ├── middleware/       # Express middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   └── server.js         # Entry point
│
├── src/
│   ├── components/       # Reusable components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── redux/            # Redux store
│   ├── routes/           # React routing
│   ├── sections/         # Feature sections
│   ├── services/         # API services
│   ├── theme/            # Material-UI theme
│   └── utils/            # Utilities
│
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── README.md            # This file
```

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# Server
PORT=8000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start backend server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start          # Start React dev server
npm run build      # Build for production
npm test           # Run tests
```

### Database
```bash
# Reset database completely
node backend/database/COMPLETE_CLEAN_RESET.js

# Reset all table IDs
node backend/database/RESET_ALL_TABLE_IDS.js

# Seed only leave data
node backend/database/seedLeaveData.js
```

---

## 🔐 Security

- **Password Hashing:** Bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **RBAC:** 5 roles with 55+ granular permissions
- **SQL Injection:** Protected with parameterized queries
- **XSS Protection:** Sanitized inputs
- **CORS:** Configured for secure cross-origin requests

---

## 🏗️ Architecture

### User-Employee Model
```
USERS (System Access)
├─ 10 users total
├─ 6 different types: super_admin, admin, hr_manager, hr, manager, employee
└─ Can optionally link to employee profile

EMPLOYEES (Workforce Data)
├─ 14 employees total
├─ All fields populated (no nulls in required fields)
└─ Can optionally link to user account

LINKING: employees.user_id → users.id (one-to-one, optional)
```

### RBAC Architecture
```
1. users (login credentials, user_type, role_id)
   ↓
2. user_roles (5 roles: Super Admin, HR Manager, HR, Manager, Employee)
   ↓
3. role_permissions (maps roles to permissions)
   ↓
4. permissions (55 permissions for all features/CRUD operations)
```

**For detailed architecture:** See `FINAL_ARCHITECTURE_GUIDE.md`

---

## 📚 Documentation

- `README.md` - This file (quick start & overview)
- `FINAL_ARCHITECTURE_GUIDE.md` - Complete architecture explanation
- `RBAC_ARCHITECTURE_EXPLAINED.md` - RBAC detailed guide
- `backend/database/schema.sql` - Complete database schema
- `backend/database/seeds.sql` - Complete sample data

---

## 🐛 Troubleshooting

### Cannot Login (401 Error)
```bash
# Clear browser storage
localStorage.clear();
sessionStorage.clear();
window.location.href = '/auth/login';

# Verify backend is running
curl http://localhost:8000/api/health

# Reset database
node backend/database/COMPLETE_CLEAN_RESET.js
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p -e "SHOW DATABASES;"

# Verify .env credentials
cat backend/.env

# Test connection
node backend/test-db.js
```

### Permission Errors
```bash
# Verify permissions are seeded
mysql -u root -p hrms_go_v5 -e "SELECT COUNT(*) FROM permissions;"
# Should return 55

# Re-run seeds if needed
mysql -u root -p hrms_go_v5 < backend/database/seeds.sql
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 📧 Support

For support and questions:
- Email: support@hrmsgo.com
- Documentation: See docs/ folder
- Issues: Create an issue in the repository

---

## ✅ Status

**Last Updated:** October 28, 2025  
**Version:** 5.0.0  
**Status:** ✅ Production Ready

**Database:**
- ✅ 86 tables with complete schema
- ✅ All tables populated with sample data
- ✅ No NULL values in required fields
- ✅ Complete RBAC with 55 permissions

**Authentication:**
- ✅ Login working (password123 for all users)
- ✅ JWT tokens
- ✅ Role-based access

**Features:**
- ✅ All core modules functional
- ✅ Dashboard, Employees, Attendance, Leaves
- ✅ Payroll, Performance, Training, Recruitment
- ✅ Assets, Documents, Expenses, Calendar
- ✅ Announcements, Messenger, Settings

---

**🚀 Ready to use! Follow the Quick Start guide above.**
