# 🚀 HRMS Go V5 - Backend API

## 📊 **Backend API for HRMS**

Complete REST API for Human Resource Management System with database integration.

---

## 🔧 **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL via Sequelize ORM
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting

---

## 🚀 **Quick Start**

### **Step 1: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 2: Setup Database**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE hrms_go_v5"

# Import schema
mysql -u root -p hrms_go_v5 < ../database/schema.sql
mysql -u root -p hrms_go_v5 < ../database/schema_part2.sql
mysql -u root -p hrms_go_v5 < ../database/schema_part3.sql
mysql -u root -p hrms_go_v5 < ../database/seeds.sql
```

### **Step 3: Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### **Step 4: Start Server**
```bash
npm run dev
```

Server runs at: **http://localhost:8000**

---

## 📁 **Project Structure**

```
backend/
├── config/
│   └── database.js           # Database connection
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── employee.controller.js
│   ├── attendance.controller.js
│   ├── leave.controller.js
│   └── payroll.controller.js
├── middleware/
│   └── auth.middleware.js    # JWT authentication
├── models/
│   ├── User.js              # User model
│   └── Employee.js          # Employee model
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   ├── employee.routes.js
│   ├── attendance.routes.js
│   ├── leave.routes.js
│   └── payroll.routes.js
├── .env.example
├── package.json
├── server.js               # Main server file
└── README.md              # This file
```

---

## 🔌 **API Endpoints**

### **Base URL**: `http://localhost:8000/api`

### **Authentication**
```
POST   /api/auth/login              # Email/password login
POST   /api/auth/login/face         # Face recognition login
POST   /api/auth/register           # Register new user
POST   /api/auth/register/face      # Register face for user
POST   /api/auth/logout             # Logout
POST   /api/auth/refresh            # Refresh token
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/verify-email       # Verify email
GET    /api/auth/me                 # Get current user
```

### **Employees**
```
GET    /api/employees               # Get all employees
GET    /api/employees/:id           # Get employee by ID
POST   /api/employees               # Create employee
PUT    /api/employees/:id           # Update employee
DELETE /api/employees/:id           # Delete employee
GET    /api/employees/stats/summary # Get statistics
```

### **Attendance**
```
POST   /api/attendance/clock-in            # Clock in
POST   /api/attendance/clock-out           # Clock out
GET    /api/attendance/records             # Get records
GET    /api/attendance/today               # Get today's record
POST   /api/attendance/regularization      # Request regularization
```

### **Leaves**
```
GET    /api/leaves/applications            # Get applications
POST   /api/leaves/applications            # Apply leave
PUT    /api/leaves/applications/:id/approve # Approve leave
PUT    /api/leaves/applications/:id/reject  # Reject leave
GET    /api/leaves/balances                # Get balances
GET    /api/leaves/types                   # Get leave types
```

### **Payroll**
```
GET    /api/payroll/runs                   # Get payroll runs
POST   /api/payroll/runs                   # Create payroll run
POST   /api/payroll/runs/:id/process       # Process payroll
GET    /api/payroll/payslips               # Get payslips
GET    /api/payroll/components             # Get salary components
```

---

## 🔐 **Authentication**

All API endpoints (except auth/login and auth/register) require JWT token:

```javascript
// Request header
Authorization: Bearer <your_jwt_token>
```

---

## 📝 **Example Requests**

### **Login**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123"
  }'
```

### **Get Employees**
```bash
curl -X GET http://localhost:8000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Clock In**
```bash
curl -X POST http://localhost:8000/api/attendance/clock-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### **Apply Leave**
```bash
curl -X POST http://localhost:8000/api/leaves/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leaveTypeId": 1,
    "startDate": "2024-10-25",
    "endDate": "2024-10-27",
    "totalDays": 3,
    "reason": "Family vacation"
  }'
```

---

## 🔧 **Environment Variables**

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 🏃 **Running the Backend**

### **Development Mode**
```bash
npm run dev
```

### **Production Mode**
```bash
npm start
```

---

## ✅ **Features Implemented**

- ✅ JWT Authentication
- ✅ Face Recognition Auth
- ✅ Employee CRUD
- ✅ Attendance Clock In/Out
- ✅ Leave Management
- ✅ Payroll (basic)
- ✅ Rate Limiting
- ✅ CORS
- ✅ Security Headers
- ✅ Error Handling

---

## 🎯 **Next Steps**

1. **Install dependencies**: `npm install`
2. **Setup database**: Import SQL files
3. **Configure .env**: Add database credentials
4. **Start server**: `npm run dev`
5. **Test endpoints**: Use Postman or curl
6. **Connect frontend**: Update API_URL in frontend .env

---

*Backend API is production-ready and fully functional!*

