# 📚 Database Setup Guide

## For Team Members & Deployment

This folder contains all database-related files for HRMS Go V5.

## 📁 Files in This Folder

1. **schema.sql** - Complete database structure (all 59 tables)
2. **seed.sql** - Sample/default data for testing
3. **README.md** - This file (setup instructions)

## 🚀 Quick Setup (For Team Members)

### Option 1: Using Docker (Recommended)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Start Docker services:**
```bash
docker-compose up -d
```

3. **Database is auto-created!** The Docker MySQL container automatically creates the `hrms_go_v5` database.

4. **Import schema (create tables):**
```bash
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql
```

5. **Import sample data (optional):**
```bash
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/seed.sql
```

6. **Access phpMyAdmin:**
```
URL: http://localhost:8080
Username: root
Password: root
```

### Option 2: Using Sequelize (Auto-Migration)

The backend automatically creates tables when you start it!

1. **Configure environment:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

2. **Start backend:**
```bash
npm install
npm start
```

Sequelize ORM will automatically:
- Connect to the database
- Create all tables from models
- Sync the schema

## 🌐 For VPS/Cloud Deployment

### AWS, DigitalOcean, Linode, etc.

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Clone your repository:**
```bash
git clone your-repo-url
cd HRMSGO\ V5
```

4. **Start Docker services:**
```bash
docker-compose up -d
```

5. **Import database:**
```bash
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/seed.sql
```

6. **Start application:**
```bash
cd backend && npm install && npm start
```

### cPanel Deployment

1. **Upload files via File Manager or FTP**

2. **Create MySQL database via cPanel:**
   - Go to MySQL Databases
   - Create database: `username_hrms_go_v5`
   - Create database user
   - Add user to database with ALL PRIVILEGES

3. **Import database:**
   - Go to phpMyAdmin in cPanel
   - Select your database
   - Click "Import" tab
   - Upload `backend/database/schema.sql`
   - Click "Go"
   - Upload `backend/database/seed.sql`
   - Click "Go"

4. **Update backend/.env:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=username_hrms_go_v5
DB_USER=username_dbuser
DB_PASSWORD=your_password
```

5. **Setup Node.js app** (if cPanel supports Node.js):
   - Use cPanel's "Setup Node.js App" feature
   - Point to backend/server.js
   - Install dependencies
   - Start application

## 🔄 Database Migration Process

### First Time Setup
```bash
# 1. Create all tables
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql

# 2. Add sample data
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/seed.sql
```

### Update Existing Database
```bash
# Backup first!
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup.sql

# Then import new schema
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql
```

## 💾 Backup & Restore

### Backup Database
```bash
# Using Docker
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup_$(date +%Y%m%d).sql

# Direct MySQL
mysqldump -u root -p hrms_go_v5 > backup.sql
```

### Restore Database
```bash
# Using Docker
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backup.sql

# Direct MySQL
mysql -u root -p hrms_go_v5 < backup.sql
```

## 📊 Database Tables (59 Total)

### Core Tables
- users, employees, branches, departments, designations

### Attendance
- attendance, attendance_policies, shifts

### Leave Management
- leave_types, leave_requests, leave_balances, leave_policies

### Payroll
- payrolls, payslips, salary_components, payment_methods, tax_settings

### Recruitment
- job_postings, job_applications, interviews, job_offers
- job_categories, job_types, hiring_stages

### Performance
- performance_goals, performance_reviews, performance_feedback
- kpi_indicators, review_cycles, goal_categories

### Training
- training_programs, training_sessions, training_types

### Assets
- assets, asset_categories, asset_assignments, asset_maintenance

### Finance
- expenses, income, expense_categories, expense_limits
- income_categories, income_sources

### Documents
- employee_documents, document_categories, document_types, company_policies

### Communication
- announcements, calendar_events, message_templates, notification_settings

### Contracts
- contracts, contract_types

### Security
- roles, permissions, system_settings

### Termination
- termination_types, termination_reasons

### Awards
- award_types

## 🔧 Troubleshooting

### "Table already exists" error
This is normal if you've run schema.sql before. It uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times.

### "Field doesn't have a default value"
Make sure you're using MySQL 5.7+ or MySQL 8.0+. The schema is designed for these versions.

### Connection refused
1. Make sure Docker/MySQL is running
2. Check database credentials in `backend/.env`
3. Verify firewall rules

### Import fails
1. Make sure database `hrms_go_v5` exists
2. Check file encoding (should be UTF-8)
3. Try importing via phpMyAdmin instead

## 🎓 How the Database Works

### Automatic Table Creation (Sequelize ORM)
When you start the backend with `npm start`, Sequelize:
1. Reads all models from `backend/models/`
2. Connects to MySQL
3. Creates/updates tables automatically
4. Syncs the schema

### Manual Table Creation (SQL Files)
If you prefer manual control:
1. Use `schema.sql` to create tables
2. Use `seed.sql` to add sample data
3. Backend will connect to existing tables

Both methods work! Choose what you prefer.

## 🆘 Need Help?

1. Check Docker is running: `docker-compose ps`
2. View MySQL logs: `docker-compose logs mysql`
3. Test database connection: `docker exec hrms_mysql mysql -uroot -proot -e "SHOW DATABASES;"`
4. Access phpMyAdmin: http://localhost:8080

---

**Quick Command Reference:**

```bash
# Create tables
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql

# Add sample data
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/seed.sql

# Backup database
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup.sql

# List all tables
docker exec hrms_mysql mysql -uroot -proot hrms_go_v5 -e "SHOW TABLES;"

# Check table structure
docker exec hrms_mysql mysql -uroot -proot hrms_go_v5 -e "DESCRIBE table_name;"
```

---

**Your team can now easily set up the database on any environment!** 🎉

