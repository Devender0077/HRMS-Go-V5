const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const SeoSetting = sequelize.define('SeoSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  seoTitle: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'seo_title',
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'seo_description',
  },
  seoKeywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'seo_keywords',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'seo_settings',
  timestamps: true,
  underscored: true,
});

module.exports = SeoSetting;

