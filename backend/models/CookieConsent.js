const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const CookieConsent = sequelize.define('CookieConsent', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: 'We use cookies to improve your experience on our site.',
  },
  buttonText: {
    type: DataTypes.STRING(50),
    defaultValue: 'Accept',
    field: 'button_text',
  },
  position: {
    type: DataTypes.ENUM('top', 'bottom'),
    defaultValue: 'bottom',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'cookie_consent',
  timestamps: true,
  underscored: true,
});

module.exports = CookieConsent;

