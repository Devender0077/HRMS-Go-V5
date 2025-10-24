const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const WebhookConfiguration = sequelize.define('WebhookConfiguration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  webhooksEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'webhooks_enabled',
  },
  webhookUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'webhook_url',
  },
  webhookSecret: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'webhook_secret',
  },
  events: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of events to trigger webhook',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'webhook_configurations',
  timestamps: true,
  underscored: true,
});

module.exports = WebhookConfiguration;

