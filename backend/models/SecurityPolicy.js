const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const SecurityPolicy = sequelize.define('SecurityPolicy', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  passwordMinLength: {
    type: DataTypes.INTEGER,
    defaultValue: 8,
    field: 'password_min_length',
  },
  passwordRequireUppercase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'password_require_uppercase',
  },
  passwordRequireLowercase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'password_require_lowercase',
  },
  passwordRequireNumbers: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'password_require_numbers',
  },
  passwordRequireSpecial: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'password_require_special',
  },
  passwordExpiryDays: {
    type: DataTypes.INTEGER,
    defaultValue: 90,
    field: 'password_expiry_days',
  },
  twoFactorAuth: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'two_factor_auth',
  },
  sessionTimeout: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    field: 'session_timeout',
    comment: 'Session timeout in minutes',
  },
  maxLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    field: 'max_login_attempts',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'security_policies',
  timestamps: true,
  underscored: true,
});

module.exports = SecurityPolicy;

