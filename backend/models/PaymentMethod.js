const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'payment_methods',
  timestamps: true,
  underscored: true,
});

module.exports = PaymentMethod;

