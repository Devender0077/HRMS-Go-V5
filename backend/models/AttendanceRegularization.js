const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const AttendanceRegularization = sequelize.define('AttendanceRegularization', {
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
  attendanceId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'attendance_id',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  currentClockIn: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'current_clock_in',
  },
  currentClockOut: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'current_clock_out',
  },
  requestedClockIn: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'requested_clock_in',
  },
  requestedClockOut: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'requested_clock_out',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  },
}, {
  tableName: 'attendance_regularizations',
  timestamps: true,
  underscored: true,
});

module.exports = AttendanceRegularization;

