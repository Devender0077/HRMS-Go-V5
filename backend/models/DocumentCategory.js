const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const DocumentCategory = sequelize.define('DocumentCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isMandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_mandatory',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'document_categories',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DocumentCategory;

