const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const IntegrationZoom = sequelize.define('IntegrationZoom', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  apiKey: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'api_key',
  },
  apiSecret: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'api_secret',
  },
  accountId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'account_id',
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_enabled',
  },
}, {
  tableName: 'integration_zoom',
  timestamps: true,
  underscored: true,
});

module.exports = IntegrationZoom;

