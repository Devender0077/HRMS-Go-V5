const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractFieldValue = sequelize.define('ContractFieldValue', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  contractInstanceId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'contract_instance_id',
  },
  templateFieldId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'template_field_id',
  },
  signerId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'signer_id',
  },
  
  // Field Data
  fieldValue: {
    type: DataTypes.TEXT,
    field: 'field_value',
  },
  filledAt: {
    type: DataTypes.DATE,
    field: 'filled_at',
  },
  filledByUserId: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'filled_by_user_id',
  },
  filledIp: {
    type: DataTypes.STRING(45),
    field: 'filled_ip',
  },
  
  // Verification
  valueHash: {
    type: DataTypes.STRING(255),
    field: 'value_hash',
  },
}, {
  tableName: 'contract_field_values',
  timestamps: true,
  underscored: true,
});

module.exports = ContractFieldValue;
