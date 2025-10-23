const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const AssetAssignment = sequelize.define('AssetAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assigned_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  expected_return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  actual_return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  condition_at_assignment: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good',
  },
  condition_at_return: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    allowNull: true,
  },
  assignment_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  return_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'lost', 'damaged'),
    defaultValue: 'active',
  },
}, {
  tableName: 'asset_assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AssetAssignment;

