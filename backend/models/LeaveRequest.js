const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const LeaveRequest = sequelize.define('LeaveRequest', {
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
  leaveTypeId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'leave_type_id',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
  },
  days: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
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
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true,
});

module.exports = LeaveRequest;

