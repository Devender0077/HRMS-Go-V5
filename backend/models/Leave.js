const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Leave = sequelize.define('Leave', {
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
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at',
  },
}, {
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true,
});

module.exports = Leave;

