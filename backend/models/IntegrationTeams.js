const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const IntegrationTeams = sequelize.define('IntegrationTeams', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  webhookUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'webhook_url',
  },
  tenantId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'tenant_id',
  },
  channelId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'channel_id',
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_enabled',
  },
}, {
  tableName: 'integration_teams',
  timestamps: true,
  underscored: true,
});

module.exports = IntegrationTeams;

