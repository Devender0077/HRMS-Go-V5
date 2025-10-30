const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const EmployeeOnboardingDocument = sequelize.define('EmployeeOnboardingDocument', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
  },
  contractInstanceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'contract_instance_id',
  },
  documentType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'document_type',
  },
  documentName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'document_name',
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'in_progress', 'completed', 'waived', 'overdue'),
    defaultValue: 'pending',
    field: 'status',
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'required',
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
  waivedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'waived_at',
  },
  waivedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'waived_by',
  },
  waiveReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'waive_reason',
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
  tableName: 'employee_onboarding_documents',
  timestamps: true,
  underscored: false,
});

module.exports = EmployeeOnboardingDocument;

