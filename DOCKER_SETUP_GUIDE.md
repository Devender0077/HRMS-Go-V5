# 🐳 Docker Setup Guide for HRMS Go V5

This guide will help you set up and run the HRMS Go V5 application using Docker with phpMyAdmin.

## 📋 Prerequisites

- **Docker Desktop** installed and running
  - For Mac: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
  - For Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
  - For Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

## 🚀 Quick Start

### 1. Start Docker Services

Open Terminal in the project root directory and run:

```bash
docker-compose up -d
```

This will start two services:
- **MySQL Database** on port `3306`
- **phpMyAdmin** on port `8080`

### 2. Verify Services are Running

```bash
docker-compose ps
```

You should see both `hrms_mysql` and `hrms_phpmyadmin` containers running.

### 3. Access phpMyAdmin

Open your browser and navigate to:
```
http://localhost:8080
```

**Login credentials:**
- Username: `root`
- Password: `root`

### 4. Create Database Tables

The database `hrms_go_v5` will be created automatically. Now you need to run the backend server to create tables:

```bash
cd backend
npm install
npm start
```

The Sequelize ORM will automatically create all necessary tables on first run.

## 📊 Available Services

| Service | URL | Port | Credentials |
|---------|-----|------|-------------|
| MySQL | localhost:3306 | 3306 | root / root |
| phpMyAdmin | http://localhost:8080 | 8080 | root / root |
| Backend API | http://localhost:8000/api | 8000 | - |
| Frontend | http://localhost:3000 | 3000 | - |

## 🛠️ Common Docker Commands

### View Container Logs
```bash
# View all logs
docker-compose logs

# View MySQL logs
docker-compose logs mysql

# View phpMyAdmin logs
docker-compose logs phpmyadmin

# Follow logs in real-time
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove All Data (Fresh Start)
```bash
docker-compose down -v
```
⚠️ **Warning:** This will delete all database data!

### Restart Services
```bash
docker-compose restart
```

### Restart Specific Service
```bash
docker-compose restart mysql
docker-compose restart phpmyadmin
```

### Check Container Status
```bash
docker-compose ps
```

## 🔧 Troubleshooting

### Port Already in Use

If you get an error like "port is already allocated":

**For MySQL (Port 3306):**
```bash
# Check what's using port 3306
lsof -i :3306

# Kill the process (if needed)
kill -9 <PID>
```

**For phpMyAdmin (Port 8080):**
```bash
# Check what's using port 8080
lsof -i :8080

# Change port in docker-compose.yml if needed
# Change "8080:80" to "8081:80" for example
```

### MySQL Container Won't Start

1. Check logs:
```bash
docker-compose logs mysql
```

2. Remove old volumes and restart:
```bash
docker-compose down -v
docker-compose up -d
```

### Can't Connect to Database from Backend

1. Make sure the `.env` file in `backend/` directory has correct settings:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=root
```

2. Verify MySQL container is healthy:
```bash
docker-compose ps
```

3. Test connection:
```bash
docker exec -it hrms_mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

### phpMyAdmin Shows "Connection Refused"

Wait 10-20 seconds after starting containers. MySQL needs time to initialize on first run.

```bash
# Watch the MySQL container until it's ready
docker-compose logs -f mysql
```

Look for: `mysqld: ready for connections`

## 💾 Database Backup and Restore

### Backup Database
```bash
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup.sql
```

### Restore Database
```bash
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backup.sql
```

### Export via phpMyAdmin
1. Go to http://localhost:8080
2. Select `hrms_go_v5` database
3. Click "Export" tab
4. Click "Go" button

## 🔐 Security Notes

**For Production:**

1. Change default passwords in `docker-compose.yml`:
```yaml
MYSQL_ROOT_PASSWORD: your_secure_password
```

2. Update `.env` file accordingly:
```env
DB_PASSWORD=your_secure_password
```

3. Use environment-specific files (`.env.production`)

## 📱 Running the Full Application

### Terminal 1: Start Docker Services
```bash
docker-compose up -d
```

### Terminal 2: Start Backend Server
```bash
cd backend
npm install
npm start
```

### Terminal 3: Start Frontend Application
```bash
npm install
npm start
```

Access the application at: http://localhost:3000

## 🔄 Switching from XAMPP to Docker

If you previously used XAMPP:

1. ✅ **Backup your data** (export from XAMPP phpMyAdmin)
2. ✅ **Stop XAMPP** services (Apache, MySQL)
3. ✅ **Start Docker** containers (this setup)
4. ✅ **Import your data** in Docker phpMyAdmin
5. ✅ **Update backend** `.env` file (already done)

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [phpMyAdmin Docker Image](https://hub.docker.com/_/phpmyadmin)

## 🆘 Getting Help

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify Docker Desktop is running
3. Make sure ports 3306 and 8080 are available
4. Try stopping and restarting: `docker-compose down && docker-compose up -d`

---

**Happy Developing! 🚀**

