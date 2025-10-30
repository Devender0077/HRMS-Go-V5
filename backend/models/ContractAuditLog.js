const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractAuditLog = sequelize.define('ContractAuditLog', {
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
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'action',
  },
  performedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'performed_by',
  },
  performedByName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'performed_by_name',
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
  details: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'details',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'contract_audit_log',
  timestamps: false,
  updatedAt: false,
});

module.exports = ContractAuditLog;

