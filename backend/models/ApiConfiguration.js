const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ApiConfiguration = sequelize.define('ApiConfiguration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  apiEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'api_enabled',
  },
  apiRateLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    field: 'api_rate_limit',
    comment: 'Requests per hour',
  },
  apiVersion: {
    type: DataTypes.STRING(20),
    defaultValue: 'v1',
    field: 'api_version',
  },
  apiDocumentationUrl: {
    type: DataTypes.STRING(300),
    allowNull: true,
    field: 'api_documentation_url',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'api_configurations',
  timestamps: true,
  underscored: true,
});

module.exports = ApiConfiguration;

