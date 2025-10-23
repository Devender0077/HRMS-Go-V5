# HRMS Go V5 🚀

A comprehensive Human Resource Management System built with React and Node.js, now powered by Docker!

## 📋 Features

- 👥 **Employee Management** - Complete employee lifecycle management
- 📅 **Attendance Tracking** - Real-time attendance monitoring
- 🏖️ **Leave Management** - Streamlined leave request and approval system
- 💰 **Payroll Processing** - Automated payroll calculation and management
- 📊 **Performance Management** - Goal setting and performance reviews
- 📚 **Training & Development** - Training program management
- 🔐 **Role-Based Access Control** - Secure user permissions
- 📱 **Responsive Design** - Works on all devices
- 🔔 **Real-time Notifications** - Stay updated with instant alerts

## 🐳 Quick Start with Docker

### Prerequisites

- **Docker Desktop** installed and running
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "HRMSGO V5"
```

2. **Start Docker Services (MySQL + phpMyAdmin)**
```bash
./docker-start.sh
```

Or manually:
```bash
docker-compose up -d
```

3. **Access phpMyAdmin**
```
URL: http://localhost:8080
Username: root
Password: root
Database: hrms_go_v5
```

4. **Install and Start Backend**
```bash
cd backend
npm install
npm start
```

Backend will run on: `http://localhost:8000`

5. **Install and Start Frontend**
```bash
# In a new terminal, from project root
npm install
npm start
```

Frontend will run on: `http://localhost:3000`

### One Command Startup

Start everything at once:
```bash
./start-all.sh
```

This will start Docker, Backend, and Frontend automatically!

## 🛠️ Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Fresh Start (Remove all data)
```bash
docker-compose down -v
docker-compose up -d
```

## 📊 Available Services

| Service | URL | Port | Credentials |
|---------|-----|------|-------------|
| Frontend | http://localhost:3000 | 3000 | - |
| Backend API | http://localhost:8000 | 8000 | - |
| MySQL | localhost | 3306 | root / root |
| phpMyAdmin | http://localhost:8080 | 8080 | root / root |

## 🔧 Configuration

### Environment Variables

Backend configuration is in `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_go_v5
DB_USER=root
DB_PASSWORD=root

PORT=8000
NODE_ENV=development

JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
```

## 📁 Project Structure

```
HRMSGO V5/
├── backend/                 # Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Server entry point
├── src/                    # React Frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── sections/           # Section components
│   ├── services/           # API services
│   ├── redux/              # State management
│   └── theme/              # Theme configuration
├── public/                 # Static assets
├── docker-compose.yml      # Docker configuration
├── docker-start.sh         # Docker start script
├── docker-stop.sh          # Docker stop script
└── start-all.sh            # Complete startup script
```

## 🗄️ Database

The application uses MySQL 8.0 running in Docker. The database schema is automatically created by Sequelize ORM on first run.

### Database Backup

```bash
# Export database
docker exec hrms_mysql mysqldump -uroot -proot hrms_go_v5 > backup.sql

# Import database
docker exec -i hrms_mysql mysql -uroot -proot hrms_go_v5 < backup.sql
```

## 🧪 Testing

### Test Backend Connection
```bash
cd backend
node test-db.js
```

### Test API Health
```
http://localhost:8000/api/health
```

## 🚨 Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Check what's using the port
lsof -i :3306  # MySQL
lsof -i :8080  # phpMyAdmin
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill the process
kill -9 <PID>
```

### Docker Issues

```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs mysql
docker-compose logs phpmyadmin

# Restart everything
docker-compose down
docker-compose up -d
```

### Database Connection Issues

1. Ensure Docker containers are running: `docker-compose ps`
2. Check MySQL is healthy: `docker-compose logs mysql`
3. Verify `.env` file in backend directory
4. Wait 10-20 seconds after starting Docker for MySQL to initialize

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** ⭐ - Quick start guide for Docker setup
- **[DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)** - Detailed Docker instructions and troubleshooting

## 🔐 Default Login Credentials

After setting up, create an admin user via phpMyAdmin or use the application's registration flow.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 💬 Support

For support and questions, please refer to:
- [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

## 🎉 Acknowledgments

Built with ❤️ using:
- React
- Node.js
- Express
- MySQL
- Docker
- Material-UI

---

**Happy HR Managing! 🎯**
