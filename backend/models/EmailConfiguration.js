const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const EmailConfiguration = sequelize.define('EmailConfiguration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  smtpHost: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'smtp_host',
  },
  smtpPort: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 587,
    field: 'smtp_port',
  },
  smtpUsername: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'smtp_username',
  },
  smtpPassword: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'smtp_password',
  },
  smtpEncryption: {
    type: DataTypes.ENUM('tls', 'ssl', 'none'),
    defaultValue: 'tls',
    field: 'smtp_encryption',
  },
  mailFromName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'mail_from_name',
  },
  mailFromAddress: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: { isEmail: true },
    field: 'mail_from_address',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  lastTestedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_tested_at',
  },
}, {
  tableName: 'email_configurations',
  timestamps: true,
  underscored: true,
});

module.exports = EmailConfiguration;

