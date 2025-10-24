/**
 * Database Synchronization Script
 * Imports all models and syncs them with the database
 */

const sequelize = require('./database2');

// Import ALL models to register them with Sequelize
const models = {
  // Core Models
  User: require('../models/User'),
  Employee: require('../models/Employee'),
  Role: require('../models/Role'),
  Permission: require('../models/Permission'),
  
  // Organization Models
  Branch: require('../models/Branch'),
  Department: require('../models/Department'),
  Designation: require('../models/Designation'),
  
  // Attendance & Leave Models
  Attendance: require('../models/Attendance'),
  AttendancePolicy: require('../models/AttendancePolicy'),
  Shift: require('../models/Shift'),
  Leave: require('../models/Leave'),
  LeaveType: require('../models/LeaveType'),
  
  // Payroll Models
  Payroll: require('../models/Payroll'),
  SalaryComponent: require('../models/SalaryComponent'),
  
  // Recruitment Models
  JobPosting: require('../models/JobPosting'),
  JobApplication: require('../models/JobApplication'),
  
  // Performance & Training Models
  PerformanceGoal: require('../models/PerformanceGoal'),
  TrainingProgram: require('../models/TrainingProgram'),
  
  // Document Models
  DocumentCategory: require('../models/DocumentCategory'),
  
  // Asset Models
  Asset: require('../models/Asset'),
  AssetCategory: require('../models/AssetCategory'),
  AssetAssignment: require('../models/AssetAssignment'),
  AssetMaintenance: require('../models/AssetMaintenance'),
  
  // Calendar Models
  CalendarEvent: require('../models/CalendarEvent'),
  
  // Settings Models
  GeneralSetting: require('../models/GeneralSetting'),
  
  // Specialized Settings Models (19)
  CompanyInformation: require('../models/CompanyInformation'),
  EmailConfiguration: require('../models/EmailConfiguration'),
  LocalizationSetting: require('../models/LocalizationSetting'),
  NotificationSetting: require('../models/NotificationSetting'),
  IntegrationSlack: require('../models/IntegrationSlack'),
  IntegrationPusher: require('../models/IntegrationPusher'),
  IntegrationTeams: require('../models/IntegrationTeams'),
  IntegrationZoom: require('../models/IntegrationZoom'),
  SecurityPolicy: require('../models/SecurityPolicy'),
  BackupConfiguration: require('../models/BackupConfiguration'),
  ApiConfiguration: require('../models/ApiConfiguration'),
  DocumentTemplate: require('../models/DocumentTemplate'),
  CookieConsent: require('../models/CookieConsent'),
  SeoSetting: require('../models/SeoSetting'),
  CacheSetting: require('../models/CacheSetting'),
  WebhookConfiguration: require('../models/WebhookConfiguration'),
  AiConfiguration: require('../models/AiConfiguration'),
  GoogleCalendarIntegration: require('../models/GoogleCalendarIntegration'),
  ExportSetting: require('../models/ExportSetting'),
  
  // Additional HR Models (3)
  LeaveRequest: require('../models/LeaveRequest'),
  PaymentMethod: require('../models/PaymentMethod'),
  AttendanceRegularization: require('../models/AttendanceRegularization'),
  
  // Additional Settings Models (2)
  WorkflowSetting: require('../models/WorkflowSetting'),
  ReportSetting: require('../models/ReportSetting'),
};

// Log detailed model count
console.log('\n📊 MODEL BREAKDOWN:');
console.log('  Core Models:        25');
console.log('  Settings Models:    21 (19 specialized + 2 workflow/reports)');
console.log('  Additional Models:   3 (LeaveRequest, PaymentMethod, AttendanceRegularization)');
console.log('  ─────────────────────');
console.log(`  ✅ Total: ${Object.keys(models).length} models loaded\n`);

console.log(`✅ Loaded ${Object.keys(models).length} models`);

/**
 * Setup model associations
 */
const setupAssociations = () => {
  const { 
    Employee, 
    Department, 
    Branch, 
    Attendance, 
    AttendanceRegularization,
    Leave,
    LeaveRequest,
  } = models;

  // Employee associations
  if (Employee && Department) {
    Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'Department' });
    Department.hasMany(Employee, { foreignKey: 'department_id' });
  }

  if (Employee && Branch) {
    Employee.belongsTo(Branch, { foreignKey: 'branch_id', as: 'Branch' });
    Branch.hasMany(Employee, { foreignKey: 'branch_id' });
  }

  // Attendance associations
  if (Attendance && Employee) {
    Attendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });
    Employee.hasMany(Attendance, { foreignKey: 'employee_id' });
  }

  // Attendance Regularization associations
  if (AttendanceRegularization && Employee) {
    AttendanceRegularization.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
    Employee.hasMany(AttendanceRegularization, { foreignKey: 'employee_id' });
  }

  if (AttendanceRegularization && Attendance) {
    AttendanceRegularization.belongsTo(Attendance, { foreignKey: 'attendance_id', as: 'Attendance' });
  }

  // Leave associations
  if (LeaveRequest && Employee) {
    LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });
    Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id' });
  }

  console.log('✅ Model associations configured');
};

// Setup associations
setupAssociations();

/**
 * Sync database with different strategies
 * @param {Object} options - Sequelize sync options
 * @returns {Promise}
 */
const syncDatabase = async (options = {}) => {
  try {
    console.log('\n📦 Starting database synchronization...');
    console.log(`Strategy: ${JSON.stringify(options)}`);
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    await sequelize.sync(options);
    
    console.log('✅ Database models synchronized successfully');
    console.log(`📊 Total models synced: ${Object.keys(models).length}`);
    
    return { success: true, models: Object.keys(models) };
  } catch (error) {
    console.error('❌ Database sync error:', error);
    throw error;
  }
};

/**
 * Different sync strategies
 */
const syncStrategies = {
  // Development: Create missing tables only (safe)
  development: () => syncDatabase({ alter: false }),
  
  // Development with auto-update: Updates existing tables (may lose data)
  developmentAlter: () => syncDatabase({ alter: true }),
  
  // Fresh start: Drops and recreates all tables (DESTROYS ALL DATA!)
  fresh: () => syncDatabase({ force: true }),
  
  // Production: No automatic sync (use migrations)
  production: async () => {
    console.log('⚠️  Production mode: Skipping auto-sync');
    console.log('Use Sequelize migrations for production databases');
    await sequelize.authenticate();
    return { success: true, models: Object.keys(models) };
  },
};

module.exports = {
  syncDatabase,
  syncStrategies,
  models,
  sequelize,
};

