const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractFieldValue = sequelize.define('ContractFieldValue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instanceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'instance_id',
  },
  fieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'field_id',
  },
  fieldName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'field_name',
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'value',
  },
  signatureData: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    field: 'signature_data',
  },
  filledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'filled_at',
  },
  filledBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'filled_by',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
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
  tableName: 'contract_field_values',
  timestamps: true,
  underscored: false,
});

module.exports = ContractFieldValue;

