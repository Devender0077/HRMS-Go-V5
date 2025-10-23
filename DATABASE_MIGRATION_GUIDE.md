# 📦 Database Migration Guide - HRMS Go V5

## ✅ Problem Fixed!

**Issue:** Only 7 out of 25 models were being imported, so their tables were never created.

**Solution:** Created automatic database sync system that imports all 25 models and creates/updates tables automatically.

---

## 🎯 How Database Migration Works Now

### Automatic Migration (On Server Start)

When you start the backend server, it **automatically**:
1. ✅ Imports all 25 Sequelize models
2. ✅ Connects to MySQL database
3. ✅ Creates missing tables
4. ✅ Syncs schema with models

```bash
cd backend
npm run dev
```

You'll see:
```
✅ Loaded 25 models
📦 Starting database synchronization...
✅ Database connection established
✅ Database models synchronized successfully
📊 Total models synced: 25

╔════════════════════════════════════════════════════════════════╗
║         🚀 HRMS Go V5 API Server Started Successfully          ║
╚════════════════════════════════════════════════════════════════╝
📊 Environment:    development
🌐 API URL:        http://localhost:8000/api
💾 Database:       hrms_go_v5
🔄 Sync Strategy:  development
📦 Models Loaded:  25
```

---

## 📋 All 25 Models (Now Auto-Loading!)

### ✅ Core Models (5)
1. User
2. Employee
3. Role
4. Permission
5. GeneralSetting

### ✅ Organization Models (3)
6. Branch
7. Department
8. Designation

### ✅ Attendance & Leave Models (4)
9. Attendance
10. AttendancePolicy
11. Shift
12. Leave
13. LeaveType

### ✅ Payroll Models (2)
14. Payroll
15. SalaryComponent

### ✅ Recruitment Models (2)
16. JobPosting
17. JobApplication

### ✅ Performance & Training Models (2)
18. PerformanceGoal
19. TrainingProgram

### ✅ Document Models (1)
20. DocumentCategory

### ✅ Asset Models (4)
21. Asset
22. AssetCategory
23. AssetAssignment
24. AssetMaintenance

### ✅ Calendar Models (1)
25. CalendarEvent

---

## 🔄 Sync Strategies

You can control how tables are created/updated using the `DB_SYNC_STRATEGY` environment variable:

### 1. `development` (Default - SAFE)
```bash
DB_SYNC_STRATEGY=development
```
- ✅ **Creates missing tables only**
- ✅ **Never modifies existing tables**
- ✅ **Safe for production use**
- ✅ **No data loss**

**Use when:**
- First time setup
- Adding new features/tables
- Default for most development

### 2. `developmentAlter` (CAUTION)
```bash
DB_SYNC_STRATEGY=developmentAlter
```
- ⚠️ **Creates missing tables**
- ⚠️ **Updates existing tables to match models**
- ⚠️ **May add/remove columns**
- ⚠️ **Risk of data loss**

**Use when:**
- You've modified model definitions
- You need to add/remove columns
- You've backed up your data

### 3. `fresh` (DANGER!)
```bash
DB_SYNC_STRATEGY=fresh
```
- 🚨 **DROPS ALL TABLES**
- 🚨 **RECREATES EVERYTHING FROM SCRATCH**
- 🚨 **DESTROYS ALL DATA**
- 🚨 **CANNOT BE UNDONE**

**Use when:**
- Starting completely fresh
- Testing with clean database
- You have backup of important data

### 4. `production` (No Auto-Sync)
```bash
DB_SYNC_STRATEGY=production
```
- ✅ **No automatic table creation/modification**
- ✅ **Just connects to database**
- ✅ **Safest for production**
- ✅ **Use manual migrations instead**

**Use when:**
- Deploying to production server
- You manage database schema manually
- Using formal migration tools

---

## 🛠️ Manual Migration Commands

You can also run migrations manually without starting the server:

### Check Database Status
```bash
cd backend
npm run migrate:status
```

Output:
```
📊 Checking database status...
✅ Database connection: OK
📦 Models registered: 25

Registered models:
   1. User
   2. Employee
   3. Role
   ...
  25. CalendarEvent
```

### Create Missing Tables (Safe)
```bash
npm run migrate
# or
npm run migrate development
```

### Update Existing Tables (Caution)
```bash
npm run migrate:alter
```
⚠️ Waits 3 seconds before executing (Ctrl+C to cancel)

### Fresh Start (Danger!)
```bash
npm run migrate:fresh
```
🚨 Waits 5 seconds before executing (Ctrl+C to cancel)

### Show Help
```bash
npm run migrate help
```

---

## 📝 Workflow for Your Team

### First Time Setup

```bash
# 1. Clone repository
git clone https://github.com/Devender0077/HRMS-Go-V5.git
cd HRMS-Go-V5

# 2. Start Docker (MySQL + phpMyAdmin)
docker-compose up -d

# 3. Install backend dependencies
cd backend
npm install

# 4. Backend will auto-create tables on first run
npm run dev
```

**That's it!** All 25 tables are automatically created. ✅

### Adding New Features

When adding a new model (e.g., `NewFeature.js`):

1. **Create the model** in `backend/models/NewFeature.js`
2. **Add to sync config** in `backend/config/syncDatabase.js`:
   ```javascript
   const models = {
     // ... existing models
     NewFeature: require('../models/NewFeature'),
   };
   ```
3. **Restart server** - table is automatically created!

### Modifying Existing Models

When changing a model's schema:

**Option 1: Safe (Recommended)**
1. Make changes to model
2. Run manual migration:
   ```bash
   npm run migrate:alter
   ```

**Option 2: Automatic**
1. Make changes to model
2. Set in `.env`:
   ```
   DB_SYNC_STRATEGY=developmentAlter
   ```
3. Restart server
4. **Don't forget** to change back to `development` after!

---

## 🎯 Common Scenarios

### Scenario 1: Team Member Joins
```bash
git clone repo
cd HRMS-Go-V5
docker-compose up -d
cd backend
npm install
npm run dev  # Tables auto-created ✅
```

### Scenario 2: Pull Latest Code with New Models
```bash
git pull origin main
cd backend
npm run dev  # New tables auto-created ✅
```

### Scenario 3: Modified Model Definitions
```bash
# Safe way:
npm run migrate:alter

# Or set in .env:
DB_SYNC_STRATEGY=developmentAlter
npm run dev
```

### Scenario 4: Fresh Database for Testing
```bash
npm run migrate:fresh  # Deletes all data, recreates tables
npm run db:seed        # Add sample data
npm run db:seed:general # Add general settings
```

### Scenario 5: Production Deployment
```bash
# In production .env:
DB_SYNC_STRATEGY=production  # No auto-sync
NODE_ENV=production

# Use proper migration tools or run SQL scripts manually
```

---

## 🗄️ Adding Sample Data

After tables are created, add sample data:

### Option 1: Run Seed Scripts
```bash
cd backend

# Add dashboard sample data (employees, attendance, etc.)
npm run db:seed

# Add general settings
npm run db:seed:general

# Add template fields
npm run db:seed:templates
```

### Option 2: Use phpMyAdmin
1. Open http://localhost:8080
2. Login: root / root
3. Select `hrms_go_v5` database
4. Click "SQL" tab
5. Copy content from `ADD_SAMPLE_DATA.sql`
6. Execute

### Option 3: Use SQL Scripts
```bash
# From project root
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < ADD_SAMPLE_DATA.sql
```

---

## 🔧 Troubleshooting

### Issue: Tables not being created

**Check:**
```bash
cd backend
npm run migrate:status
```

If it shows connection error:
1. Verify Docker is running: `docker ps`
2. Check MySQL is healthy: `docker logs hrms_mysql`
3. Verify credentials in `backend/.env`

### Issue: Foreign key errors

This happens when tables are created in wrong order.

**Fix:**
```bash
npm run migrate:fresh  # Recreates in correct order
```

### Issue: Schema changes not reflecting

**Solution:**
```bash
npm run migrate:alter  # Updates existing tables
```

### Issue: Want to see what's in database

**Check:**
```bash
# Option 1: Use phpMyAdmin
open http://localhost:8080

# Option 2: MySQL command line
docker exec -it hrms_mysql mysql -uroot -proot hrms_go_v5
SHOW TABLES;
DESCRIBE employees;
```

---

## 📚 Files Created/Modified

### New Files
- ✅ `backend/config/syncDatabase.js` - Central sync system
- ✅ `backend/database/migrate.js` - Standalone migration tool
- ✅ `DATABASE_MIGRATION_GUIDE.md` - This guide

### Modified Files
- ✅ `backend/server.js` - Now imports all 25 models
- ✅ `backend/package.json` - Added migration scripts
- ✅ `backend/.env` - Added DB_SYNC_STRATEGY
- ✅ `backend/.env.example` - Added DB_SYNC_STRATEGY

---

## ✅ What's Fixed

### Before
- ❌ Only 7 models imported
- ❌ 18 models missing → tables never created
- ❌ Manual SQL scripts required
- ❌ Team members confused about setup
- ❌ Inconsistent database state

### After
- ✅ All 25 models automatically loaded
- ✅ Tables auto-created on server start
- ✅ Manual migration commands available
- ✅ Different strategies for dev/prod
- ✅ Team can set up in 3 commands
- ✅ Consistent database across all environments

---

## 🎓 Best Practices

### Development
- Use `DB_SYNC_STRATEGY=development` (default)
- Let auto-sync create missing tables
- Run `migrate:alter` when you change models

### Testing
- Use `migrate:fresh` for clean slate
- Run seed scripts after fresh migration
- Test with realistic data

### Production
- Use `DB_SYNC_STRATEGY=production`
- Never use auto-sync in production
- Use proper migration tools (Sequelize CLI)
- Always backup before schema changes

---

## 🚀 Next Steps

1. ✅ Pull latest code from GitHub
2. ✅ Restart backend server
3. ✅ Watch console - should see all 25 models loaded
4. ✅ Check phpMyAdmin - all tables should be there
5. ✅ Run seed scripts to add sample data
6. ✅ Test application

**Everything should work automatically now!** 🎉

---

## 📖 Additional Resources

- Sequelize Docs: https://sequelize.org/docs/v6/core-concepts/model-basics/
- Sequelize Migrations: https://sequelize.org/docs/v6/other-topics/migrations/
- MySQL Docker: https://hub.docker.com/_/mysql

---

**Questions?** Check `TEAM_INSTALL_GUIDE.md` or `backend/database/migrate.js help`

