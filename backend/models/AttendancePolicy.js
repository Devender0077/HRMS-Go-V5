const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const AttendancePolicy = sequelize.define('AttendancePolicy', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  minHoursPerDay: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 8.00,
  },
  maxLateMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
  },
  halfDayThresholdHours: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 4.00,
  },
  allowOvertime: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  overtimeMultiplier: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.50,
  },
  trackLocation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'attendance_policies',
  timestamps: true,
  underscored: true,
});

module.exports = AttendancePolicy;

