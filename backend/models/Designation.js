const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Designation = sequelize.define('Designation', {
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
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'designations',
  timestamps: true,
  underscored: true,
});

module.exports = Designation;

