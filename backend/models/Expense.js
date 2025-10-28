const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Expense = sequelize.define('Expense', {
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
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'expense_date',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'),
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    field: 'approved_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason',
  },
  receiptPath: {
    type: DataTypes.STRING(500),
    field: 'receipt_path',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'expenses',
  timestamps: true,
  underscored: true,
});

module.exports = Expense;

