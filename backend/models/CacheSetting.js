const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const CacheSetting = sequelize.define('CacheSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  cacheEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'cache_enabled',
  },
  cacheDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 3600,
    field: 'cache_duration',
    comment: 'Cache duration in seconds',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'cache_settings',
  timestamps: true,
  underscored: true,
});

module.exports = CacheSetting;

