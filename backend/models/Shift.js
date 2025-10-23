const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Shift = sequelize.define('Shift', {
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
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  gracePeriodMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
  },
  breakDurationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  weeklyOff: {
    type: DataTypes.STRING(50),
    defaultValue: 'Sunday',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'shifts',
  timestamps: true,
  underscored: true,
});

module.exports = Shift;

