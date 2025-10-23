const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const SalaryComponent = sequelize.define('SalaryComponent', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('earning', 'deduction'),
    allowNull: false,
  },
  isTaxable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_taxable',
  },
  isPercentage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_percentage',
  },
  percentageOf: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'percentage_of',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'salary_components',
  timestamps: true,
  underscored: true,
});

module.exports = SalaryComponent;
