const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING(100),
  },
  state: {
    type: DataTypes.STRING(100),
  },
  country: {
    type: DataTypes.STRING(100),
  },
  phone: {
    type: DataTypes.STRING(50),
  },
  email: {
    type: DataTypes.STRING(255),
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'branches',
  timestamps: true,
  underscored: true,
});

module.exports = Branch;

