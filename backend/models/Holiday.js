const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('national', 'regional', 'company', 'religious', 'optional'),
    defaultValue: 'company',
  },
  region: {
    type: DataTypes.ENUM('india', 'usa', 'both', 'other'),
    defaultValue: 'both',
    comment: 'Which region this holiday applies to',
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_recurring',
    comment: 'If true, holiday repeats every year',
  },
  branchId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'branch_id',
    comment: 'If specified, holiday only applies to this branch',
  },
  departmentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'department_id',
    comment: 'If specified, holiday only applies to this department',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'holidays',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['date'] },
    { fields: ['type'] },
    { fields: ['region'] },
    { fields: ['status'] },
    { fields: ['branch_id'] },
  ],
});

module.exports = Holiday;

