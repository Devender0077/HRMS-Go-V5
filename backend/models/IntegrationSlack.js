const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const IntegrationSlack = sequelize.define('IntegrationSlack', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  workspaceName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'workspace_name',
  },
  webhookUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'webhook_url',
  },
  defaultChannel: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'default_channel',
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_enabled',
  },
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_sync_at',
  },
  errorCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'error_count',
  },
  lastError: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'last_error',
  },
}, {
  tableName: 'integration_slack',
  timestamps: true,
  underscored: true,
});

module.exports = IntegrationSlack;

