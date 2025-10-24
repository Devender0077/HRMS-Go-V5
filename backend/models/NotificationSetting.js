const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const NotificationSetting = sequelize.define('NotificationSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  enableEmailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_email_notifications',
  },
  enableBrowserNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'enable_browser_notifications',
  },
  notifyEmployeeLeave: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_employee_leave',
  },
  notifyEmployeeAttendance: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_employee_attendance',
  },
  notifyPayroll: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_payroll',
  },
  notifyDocumentUpload: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_document_upload',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'notification_settings',
  timestamps: true,
  underscored: true,
});

module.exports = NotificationSetting;

