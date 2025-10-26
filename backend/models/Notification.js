const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'user_id',
    comment: 'User who receives this notification',
  },
  type: {
    type: DataTypes.ENUM(
      'leave_request',
      'leave_approved',
      'leave_rejected',
      'leave_cancelled',
      'attendance_alert',
      'attendance_approved',
      'payroll_generated',
      'document_uploaded',
      'document_approved',
      'system_announcement',
      'task_assigned',
      'task_completed',
      'performance_review',
      'training_enrollment',
      'birthday_reminder',
      'work_anniversary'
    ),
    allowNull: false,
    defaultValue: 'system_announcement',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  relatedId: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'related_id',
    comment: 'ID of related entity (leave_id, employee_id, etc.)',
  },
  relatedType: {
    type: DataTypes.STRING(50),
    field: 'related_type',
    comment: 'Type of related entity (leave, employee, payroll, etc.)',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
  avatar: {
    type: DataTypes.TEXT,
    comment: 'Avatar URL or path for notification icon',
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
});

module.exports = Notification;

