const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Payroll = sequelize.define('Payroll', {
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
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  basicSalary: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'basic_salary',
  },
  grossSalary: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'gross_salary',
  },
  totalDeductions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'total_deductions',
  },
  netSalary: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'net_salary',
  },
  status: {
    type: DataTypes.ENUM('draft', 'approved', 'paid'),
    defaultValue: 'draft',
  },
  paidAt: {
    type: DataTypes.DATE,
    field: 'paid_at',
  },
}, {
  tableName: 'payrolls',
  timestamps: true,
  underscored: true,
});

module.exports = Payroll;

