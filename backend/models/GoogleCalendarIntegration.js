const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const GoogleCalendarIntegration = sequelize.define('GoogleCalendarIntegration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  clientId: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'client_id',
  },
  clientSecret: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'client_secret',
  },
  calendarId: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'calendar_id',
  },
  syncEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'sync_enabled',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'google_calendar_integrations',
  timestamps: true,
  underscored: true,
});

module.exports = GoogleCalendarIntegration;

