const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'employee_id',
  },
  contractType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'contract_type',
  },
  contractNumber: {
    type: DataTypes.STRING(100),
    field: 'contract_number',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2),
  },
  terms: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'expired', 'terminated'),
    defaultValue: 'active',
  },
  signedDate: {
    type: DataTypes.DATEONLY,
    field: 'signed_date',
  },
}, {
  tableName: 'contracts',
  timestamps: true,
  underscored: true,
});

module.exports = Contract;

