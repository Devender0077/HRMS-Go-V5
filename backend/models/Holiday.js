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
    type: DataTypes.ENUM('public', 'optional', 'company'),
    defaultValue: 'public',
  },
  region: {
    type: DataTypes.STRING(500), // Changed to support multiple regions as JSON array
    allowNull: false,
    defaultValue: '["global"]',
    comment: 'JSON array of regions this holiday applies to',
    get() {
      const rawValue = this.getDataValue('region');
      try {
        // If it's already a string that looks like JSON, parse it
        if (typeof rawValue === 'string' && rawValue.startsWith('[')) {
          return JSON.parse(rawValue);
        }
        // If it's a plain string (old ENUM value), wrap in array
        if (typeof rawValue === 'string') {
          return [rawValue];
        }
        // If it's already an array, return as is
        return Array.isArray(rawValue) ? rawValue : ['global'];
      } catch {
        return ['global']; // Fallback
      }
    },
    set(value) {
      // Convert array to JSON string for storage
      if (Array.isArray(value)) {
        this.setDataValue('region', JSON.stringify(value));
      } else if (typeof value === 'string') {
        // If already a JSON string, use as is
        this.setDataValue('region', value.startsWith('[') ? value : `["${value}"]`);
      } else {
        this.setDataValue('region', '["global"]');
      }
    },
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

