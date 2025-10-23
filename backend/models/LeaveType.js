const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const LeaveType = sequelize.define('LeaveType', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  daysPerYear: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'days_per_year',
  },
  carryForward: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'carry_forward',
  },
  maxCarryForward: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'max_carry_forward',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'leave_types',
  timestamps: true,
  underscored: true,
});

module.exports = LeaveType;

