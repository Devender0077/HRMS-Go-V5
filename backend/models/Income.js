const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  incomeType: {
    type: DataTypes.STRING(100),
    field: 'income_type',
  },
  source: {
    type: DataTypes.STRING(100),
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
  incomeDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'income_date',
  },
  status: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'income',
  timestamps: true,
  underscored: true,
});

module.exports = Income;

