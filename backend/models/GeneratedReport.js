const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const GeneratedReport = sequelize.define('GeneratedReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  report_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  report_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  parameters: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('parameters');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('parameters', value ? JSON.stringify(value) : null);
    },
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_size: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('processing', 'completed', 'failed'),
    defaultValue: 'processing',
  },
  generated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // Foreign key removed to avoid compatibility issues
    // In production, can be manually created after checking users.id type
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'generated_reports',
  timestamps: true,
  underscored: true,
});

module.exports = GeneratedReport;

