# 🚀 START HERE - HRMS Go V5 with Docker

Welcome! Your HRMS Go V5 project has been configured to use Docker instead of XAMPP.

## ⚡ Quick Start (5 Minutes)

### 1. Make sure Docker Desktop is running

**Mac:** Look for the Docker icon in your menu bar (top right)  
**Windows:** Look for the Docker icon in your system tray (bottom right)

If Docker Desktop is not installed, download it from:
- Mac: https://www.docker.com/products/docker-desktop/
- Windows: https://www.docker.com/products/docker-desktop/

### 2. Start Docker Services

Open Terminal in this folder and run:

**Mac/Linux:**
```bash
./docker-start.sh
```

**Windows:**
```cmd
docker-start.bat
```

**Or manually:**
```bash
docker-compose up -d
```

### 3. Access phpMyAdmin

Open in your browser:
```
http://localhost:8080
```

Login with:
- Username: `root`
- Password: `root`

The database `hrms_go_v5` is already created!

### 4. Start Backend Server

Open a new Terminal/Command Prompt:

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ MySQL2 Pool connection established successfully
✅ Sequelize ORM connection established successfully
🚀 HRMS Go V5 API Server running on port 8000
```

### 5. Start Frontend Application

Open another Terminal/Command Prompt:

```bash
npm install
npm start
```

The app will open at: `http://localhost:3000`

## 🎯 That's It!

You now have:
- ✅ MySQL database running in Docker
- ✅ phpMyAdmin accessible at http://localhost:8080
- ✅ Backend API running at http://localhost:8000
- ✅ Frontend app running at http://localhost:3000

## 🔄 Daily Workflow

### Starting Your Work Day:

```bash
# 1. Start Docker (once per day)
./docker-start.sh

# 2. Start Backend
cd backend
npm start

# 3. Start Frontend (new terminal)
npm start
```

### Ending Your Work Day:

- Press `Ctrl+C` in Backend terminal
- Press `Ctrl+C` in Frontend terminal
- (Optional) Stop Docker: `docker-compose down`

**Note:** You can keep Docker running in the background if you want!

## 🧪 Test Your Setup

Verify everything is working:

```bash
# Check Docker containers are running
docker-compose ps

# Check database connection
docker exec hrms_mysql mysql -uroot -proot -e "SHOW DATABASES;"

# Access phpMyAdmin
open http://localhost:8080
```

## 📚 Documentation

| File | What It's For |
|------|---------------|
| **START_HERE.md** ← You are here | Quick start guide |
| **DOCKER_SETUP_GUIDE.md** | Detailed setup and troubleshooting |
| **README.md** | Project overview |

## 🆘 Something Not Working?

### Docker won't start?
- Make sure Docker Desktop is running
- Check the Docker icon in your menu bar/system tray
- Restart Docker Desktop

### Can't access phpMyAdmin?
- Wait 10-20 seconds after starting Docker
- Check containers are running: `docker-compose ps`
- View logs: `docker-compose logs phpmyadmin`

### Backend can't connect to database?
- Make sure `backend/.env` file exists
- Verify Docker containers are running: `docker-compose ps`
- Check MySQL is healthy (should show "healthy" in status)

### Port already in use?
```bash
# Mac/Linux - Check what's using the port
lsof -i :3306  # MySQL
lsof -i :8080  # phpMyAdmin

# Kill the process
kill -9 <PID>

# Windows - Check what's using the port
netstat -ano | findstr :3306
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F
```

### Need a fresh start?
```bash
# Stop everything and delete all data (⚠️ This deletes your database!)
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Stop Docker services?
```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## 🎁 Helpful Commands

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs -f

# Stop Docker services
docker-compose down

# Restart Docker services
docker-compose restart

# Backup database
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup.sql

# Restore database
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backup.sql
```

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:8000/api | - |
| API Health | http://localhost:8000/api/health | - |
| phpMyAdmin | http://localhost:8080 | root / root |

## 📖 What Changed from XAMPP?

1. ✅ MySQL now runs in Docker (not XAMPP)
2. ✅ phpMyAdmin now at port 8080 (not localhost/phpmyadmin)
3. ✅ Database config uses TCP connection (not Unix socket)
4. ✅ Added `backend/.env` file for configuration
5. ✅ Added Docker scripts for easy startup

**Everything else works the same!**

## 💡 Pro Tips

1. **Keep Docker Running**: Leave Docker running in the background - it uses minimal resources
2. **Use phpMyAdmin**: Great for viewing/editing database directly
3. **Check Logs**: When something breaks, always check logs first: `docker-compose logs -f`
4. **Backup Regularly**: Export your database from phpMyAdmin or use the backup command
5. **Read the Guides**: Detailed help in DOCKER_SETUP_GUIDE.md

## 🎓 Next Steps

1. ✅ Complete the Quick Start above
2. ✅ Access phpMyAdmin and explore your database
3. ✅ Import any existing data (if migrating from XAMPP)
4. ✅ Read DOCKER_QUICK_REFERENCE.md for common commands
5. ✅ Start building amazing HR features!

## 🚨 Emergency Commands

If everything is broken and you need to start fresh:

```bash
# Nuclear option - delete everything and start over
docker-compose down -v
rm -rf node_modules backend/node_modules
docker-compose up -d
cd backend && npm install && npm start
# In new terminal: npm install && npm start
```

---

## ✅ Checklist

Before you start developing, make sure:

- [ ] Docker Desktop is installed and running
- [ ] Ran `./docker-start.sh` successfully
- [ ] Can access phpMyAdmin at http://localhost:8080
- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can see database `hrms_go_v5` in phpMyAdmin

---

**Need More Help?**

Read the detailed guide:
- [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md) - Complete setup and troubleshooting guide

---

**Happy Coding! 🎉**

Your HRMS Go V5 is ready to go with Docker!

