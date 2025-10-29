const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Database connection - Import MySQL2 pool (default) and Sequelize instance
const db = require('./config/database'); // MySQL2 pool for raw queries
const { sequelize, syncStrategies } = require('./config/syncDatabase'); // Sequelize ORM with all models loaded

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const payrollRoutes = require('./routes/payroll.routes');
const recruitmentRoutes = require('./routes/recruitment.routes');
const performanceRoutes = require('./routes/performance.routes');
const trainingRoutes = require('./routes/training.routes');
const documentsRoutes = require('./routes/documents.routes');
const calendarRoutes = require('./routes/calendar.routes');
const messengerRoutes = require('./routes/messenger.routes');
const leaveBalanceRoutes = require('./routes/leaveBalance.routes');
const configurationRoutes = require('./routes/configuration.routes');

// Initialize app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting (increased for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for dev)
});
app.use('/api/', limiter);

// CORS - Allow multiple localhost ports in development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // In production, only allow specified origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/designations', require('./routes/designation.routes'));
app.use('/api/shifts', require('./routes/shift.routes'));
app.use('/api/policies', require('./routes/policy.routes'));
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/leave-balance', leaveBalanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/messenger', messengerRoutes);
app.use('/api/system-setup', require('./routes/systemSetup.routes'));
app.use('/api/assets', require('./routes/asset.routes'));
app.use('/api/asset-categories', require('./routes/assetCategory.routes'));
app.use('/api/asset-assignments', require('./routes/assetAssignment.routes'));
app.use('/api/asset-maintenance', require('./routes/assetMaintenance.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/permissions', require('./routes/permission.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));
app.use('/api/pusher', require('./routes/pusher.routes'));
app.use('/api/configuration', configurationRoutes);
app.use('/api/general-settings', require('./routes/generalSettings.routes'));
app.use('/api/organization', require('./routes/organization.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/contracts', require('./routes/contract.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/income', require('./routes/income.routes'));
app.use('/api/holidays', require('./routes/holiday.routes'));

// Route aliases for alternate paths (frontend compatibility)
app.use('/api/leave-types', (req, res, next) => {
  req.url = '/types';
  leaveRoutes(req, res, next);
});

app.use('/api/salary-components', (req, res, next) => {
  req.url = '/components';
  payrollRoutes(req, res, next);
});

app.use('/api/settings/general', (req, res) => {
  res.redirect(308, `/api/general-settings${req.url}`);
});

app.use('/api/job-postings', (req, res, next) => {
  req.url = '/jobs' + req.url;
  recruitmentRoutes(req, res, next);
});

app.use('/api/applications', (req, res, next) => {
  req.url = '/applications' + req.url;
  recruitmentRoutes(req, res, next);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HRMS Go V5 API is running',
    version: '5.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database connection and server start
const PORT = process.env.PORT || 8000;

// Choose sync strategy based on environment variable
// DB_SYNC_STRATEGY options: 'development' (default), 'developmentAlter', 'fresh', 'production'
const syncStrategy = process.env.DB_SYNC_STRATEGY || 'development';

// Test database connection and start server
syncStrategies[syncStrategy]()
  .then((result) => {
    console.log(`✅ Database ready (${result.models.length} models registered)`);
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════════════════════════════╗');
      console.log('║         🚀 HRMS Go V5 API Server Started Successfully          ║');
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log(`📊 Environment:    ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL:        http://localhost:${PORT}/api`);
      console.log(`💾 Database:       ${process.env.DB_NAME}`);
      console.log(`🔄 Sync Strategy:  ${syncStrategy}`);
      console.log(`📦 Models Loaded:  ${result.models.length}`);
      console.log('════════════════════════════════════════════════════════════════\n');
    });
  })
  .catch((err) => {
    console.error('\n❌ Unable to start server:', err.message);
    console.error('Please make sure:');
    console.error('  1. MySQL is running (docker ps)');
    console.error('  2. Database "hrms_go_v5" is created');
    console.error('  3. Database credentials are correct in .env');
    console.error('\nFull error:', err);
    process.exit(1);
  });

module.exports = app;

