const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractInstance = sequelize.define('ContractInstance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'template_id',
  },
  contractNumber: {
    type: DataTypes.STRING(100),
    unique: true,
    field: 'contract_number',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'title',
  },
  recipientType: {
    type: DataTypes.ENUM('employee', 'vendor', 'other'),
    defaultValue: 'employee',
    field: 'recipient_type',
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'recipient_id',
  },
  recipientEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'recipient_email',
  },
  recipientName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'recipient_name',
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'viewed', 'in_progress', 'completed', 'declined', 'expired', 'cancelled'),
    defaultValue: 'draft',
    field: 'status',
  },
  sentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_date',
  },
  viewedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'viewed_date',
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_date',
  },
  declinedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'declined_date',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
  originalFilePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'original_file_path',
  },
  signedFilePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'signed_file_path',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'metadata',
  },
  declineReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'decline_reason',
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
  tableName: 'contract_instances',
  timestamps: true,
  underscored: false,
});

module.exports = ContractInstance;

