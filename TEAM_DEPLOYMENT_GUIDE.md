# 👥 Team Deployment Guide - HRMS Go V5

## For New Team Members & Production Deployment

This guide explains how your team can set up the HRMS Go V5 project on their local machines or deploy it to production.

## 📋 What Your Team Needs to Know

### 🗄️ Database Setup - How It Works

**Important:** You DON'T need SQL files for deployment! Here's why:

#### Option 1: Automatic Table Creation (Recommended) ✅

The backend uses **Sequelize ORM** which automatically creates all database tables!

**How it works:**
1. Team member clones the repo
2. Starts Docker (MySQL + phpMyAdmin)
3. Starts the backend with `npm start`
4. **Sequelize automatically creates all 59 tables** from the model files in `backend/models/`

**No SQL import needed!** 🎉

#### Option 2: Manual SQL Import (If Needed)

If you prefer manual control, we have SQL files in `backend/database/`:

```bash
# Create all tables
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/schema.sql

# Add sample data (optional)
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backend/database/seed.sql
```

## 🚀 Quick Setup for Team Members

### Step 1: Clone Repository

```bash
git clone your-repository-url
cd "HRMSGO V5"
```

### Step 2: Install Docker Desktop

Download from: https://www.docker.com/products/docker-desktop/

### Step 3: Start Docker Services

```bash
# Mac/Linux
./docker-start.sh

# Windows
docker-start.bat

# Or manual
docker-compose up -d
```

This automatically:
- ✅ Creates MySQL database
- ✅ Creates `hrms_go_v5` database
- ✅ Starts phpMyAdmin on port 8080

### Step 4: Setup Backend

```bash
cd backend
npm install
npm start
```

**Sequelize will automatically create all 59 tables!**

You'll see:
```
✅ MySQL2 Pool connection established successfully
✅ Sequelize ORM connection established successfully
✅ Database models synchronized ← Tables created here!
🚀 HRMS Go V5 API Server running on port 8000
```

### Step 5: Setup Frontend

```bash
# New terminal
npm install
npm start
```

Frontend opens at: http://localhost:3000

**That's it! Total setup time: ~5 minutes** ⏱️

## 🌐 Production Deployment Guide

### AWS EC2 / DigitalOcean / Linode

#### 1. Server Setup

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd "HRMSGO V5"

# Start Docker (MySQL)
docker-compose up -d

# Setup backend
cd backend
npm install

# Start with PM2 (keeps running after logout)
pm2 start server.js --name hrms-backend

# Setup frontend
cd ..
npm install
npm run build

# Serve with PM2
pm2 serve build 3000 --name hrms-frontend

# Save PM2 config
pm2 save
pm2 startup
```

#### 3. Setup Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/hrms
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### cPanel Deployment

#### 1. Create Database

1. Login to cPanel
2. Go to **MySQL Databases**
3. Create database: `username_hrms_go_v5`
4. Create user with password
5. Add user to database with ALL PRIVILEGES

#### 2. Import Database (Two Options)

**Option A: Let Sequelize Create Tables (Easier)**
- Just configure .env and start backend
- Tables auto-create!

**Option B: Manual Import**
1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Import `backend/database/schema.sql`
4. Import `backend/database/seed.sql` (optional)

#### 3. Upload Files

```bash
# Via FTP/SFTP
Upload entire project folder

# Or via Git
ssh into your cPanel account
git clone your-repo-url
```

#### 4. Setup Node.js Application

1. In cPanel, go to **Setup Node.js App**
2. Create application:
   - Node.js version: 14.x or higher
   - Application root: `public_html/HRMSGO V5`
   - Application URL: your domain
   - Application startup file: `backend/server.js`
   - Passenger log file: logs/passenger.log

3. Set environment variables in cPanel:
```
DB_HOST=localhost
DB_NAME=username_hrms_go_v5
DB_USER=username_dbuser
DB_PASSWORD=your_password
PORT=8000
NODE_ENV=production
```

4. Install dependencies:
```bash
cd backend
npm install --production
```

5. Start application via cPanel interface

## 🔧 Environment Configuration

### For Local Development

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=root

PORT=8000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### For Production

Update values:
```env
DB_HOST=your-production-host
DB_NAME=production_database_name
DB_USER=secure_user
DB_PASSWORD=strong_password

PORT=8000
NODE_ENV=production
JWT_SECRET=super-secure-random-string
```

## 💾 Database Backup & Migration

### Backup Production Database

```bash
# Create backup
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup_$(date +%Y%m%d).sql

# Or on production server
mysqldump -u user -p database_name > backup.sql
```

### Migrate to New Server

```bash
# On new server, after setting up Docker:
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backup.sql
```

## 🎯 Key Points for Your Team

### 1. No SQL Files Needed! ✨

**Sequelize ORM handles everything:**
- Reads model files from `backend/models/`
- Connects to MySQL
- Creates/updates tables automatically
- Your team just runs `npm start`!

### 2. SQL Files Are Optional

We provide them in `backend/database/` for:
- Manual control if needed
- Understanding the database structure
- Quick database recreation
- Documentation purposes

### 3. How Tables Are Created

```javascript
// backend/models/Department.js
const Department = sequelize.define('Department', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  // ...
});
```

When backend starts:
1. Sequelize reads this model
2. Connects to MySQL
3. Creates `departments` table
4. Adds columns based on model definition

**All 59 tables are created from the 24 model files!**

### 4. Adding Sample Data

**Option A: Via phpMyAdmin**
- Go to http://localhost:8080
- Insert records manually

**Option B: Via Application**
- Use the frontend to create records
- Navigate to each module and click "Add New"

**Option C: Via SQL**
- Run `backend/database/seed.sql`

## 📊 What Files to Share with Team

### Essential Files ✅
- ✅ `docker-compose.yml` - Docker configuration
- ✅ `backend/` folder - All backend code
- ✅ `src/` folder - All frontend code
- ✅ `package.json` - Dependencies
- ✅ `README.md` - Project overview
- ✅ `START_HERE.md` - Setup guide

### Optional Files
- `backend/database/schema.sql` - Table structures (auto-created by Sequelize)
- `backend/database/seed.sql` - Sample data (optional)

### DON'T Share
- ❌ `backend/.env` - Contains sensitive credentials
- ❌ `node_modules/` - Will be installed via npm
- ❌ `build/` - Will be created during build

## 🆘 Common Team Issues

### "Database connection failed"

**Solution:**
1. Check Docker is running: `docker-compose ps`
2. Verify `backend/.env` exists with correct credentials
3. Wait 10-20 seconds for MySQL to initialize

### "Tables don't exist"

**Solution:**
- Just start the backend: `npm start`
- Sequelize will create them automatically!

### "Port already in use"

**Solution:**
```bash
# Check what's using the port
lsof -i :3306  # MySQL
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill the process
kill -9 <PID>
```

### "npm install fails"

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 Team Resources

### Documentation to Read
1. **START_HERE.md** - Quick setup guide
2. **DOCKER_SETUP_GUIDE.md** - Docker details
3. **backend/database/README.md** - Database guide

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- phpMyAdmin: http://localhost:8080 (root/root)
- API Health: http://localhost:8000/api/health

### Sample API Test
```bash
# Check if backend is working
curl http://localhost:8000/api/health

# Get departments
curl http://localhost:8000/api/departments

# Get shifts
curl http://localhost:8000/api/configuration/shifts
```

## 🎓 Understanding the Architecture

### Folder Structure
```
HRMSGO V5/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # API logic
│   ├── models/          # Database models (CREATE TABLES!)
│   ├── routes/          # API endpoints
│   ├── database/        # Optional SQL files
│   └── server.js        # Entry point
├── src/                 # Frontend React code
├── docker-compose.yml   # Docker setup
└── package.json         # Dependencies
```

### Database Flow
```
1. Docker starts → MySQL running
2. Backend starts → Sequelize connects
3. Sequelize reads models/ → Creates tables
4. Tables ready → API works
5. Frontend calls API → Data displayed
```

## ✅ Deployment Checklist

- [ ] Docker Desktop installed
- [ ] Repository cloned
- [ ] Docker services started
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed
- [ ] Backend running (port 8000)
- [ ] Frontend dependencies installed  
- [ ] Frontend running (port 3000)
- [ ] Can access phpMyAdmin (port 8080)
- [ ] Can login to application

## 🎉 Summary

### For Local Development:
```bash
1. docker-compose up -d
2. cd backend && npm install && npm start
3. npm install && npm start
```

### For Production:
```bash
1. Setup Docker on server
2. Clone repository
3. Configure .env for production
4. Start with PM2 for auto-restart
5. Setup Nginx reverse proxy
6. Configure domain and SSL
```

### Database Tables:
- ✅ Auto-created by Sequelize (no SQL import needed!)
- ✅ Or use provided SQL files if you prefer
- ✅ Both methods work perfectly!

---

**Your team can now deploy HRMS Go V5 anywhere! 🚀**

Questions? Check the documentation files or Docker logs: `docker-compose logs -f`

