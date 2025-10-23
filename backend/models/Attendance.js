const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'employee_id',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  clockIn: {
    type: DataTypes.DATE,
    field: 'clock_in',
  },
  clockOut: {
    type: DataTypes.DATE,
    field: 'clock_out',
  },
  clockInIp: {
    type: DataTypes.STRING(50),
    field: 'clock_in_ip',
  },
  clockOutIp: {
    type: DataTypes.STRING(50),
    field: 'clock_out_ip',
  },
  clockInLocation: {
    type: DataTypes.TEXT,
    field: 'clock_in_location',
  },
  clockOutLocation: {
    type: DataTypes.TEXT,
    field: 'clock_out_location',
  },
  clockInLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    field: 'clock_in_latitude',
  },
  clockInLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    field: 'clock_in_longitude',
  },
  clockOutLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    field: 'clock_out_latitude',
  },
  clockOutLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    field: 'clock_out_longitude',
  },
  deviceInfo: {
    type: DataTypes.TEXT,
    field: 'device_info',
  },
  totalHours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    field: 'total_hours',
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'half_day', 'late', 'leave'),
    defaultValue: 'present',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'attendance',
  timestamps: true,
  underscored: true,
});

module.exports = Attendance;

