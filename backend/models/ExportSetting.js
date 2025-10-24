const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ExportSetting = sequelize.define('ExportSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  exportMaxRows: {
    type: DataTypes.INTEGER,
    defaultValue: 10000,
    field: 'export_max_rows',
  },
  defaultFormat: {
    type: DataTypes.ENUM('pdf', 'excel', 'csv'),
    defaultValue: 'excel',
    field: 'default_format',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'export_settings',
  timestamps: true,
  underscored: true,
});

module.exports = ExportSetting;

