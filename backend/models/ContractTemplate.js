const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractTemplate = sequelize.define('ContractTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'name',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description',
  },
  category: {
    type: DataTypes.ENUM('employee', 'vendor', 'msa', 'po', 'sow', 'nda', 'other'),
    defaultValue: 'employee',
    field: 'category',
  },
  region: {
    type: DataTypes.ENUM('usa', 'india', 'global'),
    defaultValue: 'global',
    field: 'region',
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'file_path',
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'file_type',
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'contract_templates',
  timestamps: true,
  underscored: false,
});

module.exports = ContractTemplate;

