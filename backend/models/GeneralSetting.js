const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const GeneralSetting = sequelize.define('GeneralSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  settingKey: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'setting_key',
  },
  settingValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'setting_value',
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'general',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('text', 'number', 'boolean', 'json', 'file', 'image'),
    defaultValue: 'text',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public',
    comment: 'Whether this setting should be exposed to frontend',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'general_settings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['setting_key'] },
    { fields: ['category'] },
    { fields: ['status'] },
  ],
});

module.exports = GeneralSetting;

