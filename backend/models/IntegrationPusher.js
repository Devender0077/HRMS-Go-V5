const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const IntegrationPusher = sequelize.define('IntegrationPusher', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  appId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'app_id',
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  secret: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  cluster: {
    type: DataTypes.STRING(50),
    defaultValue: 'us2',
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_enabled',
  },
}, {
  tableName: 'integration_pusher',
  timestamps: true,
  underscored: true,
});

module.exports = IntegrationPusher;

