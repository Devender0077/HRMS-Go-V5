const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const PerformanceGoal = sequelize.define('PerformanceGoal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING(100),
  },
  start_date: {
    type: DataTypes.DATEONLY,
  },
  end_date: {
    type: DataTypes.DATEONLY,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('on_track', 'ahead', 'behind', 'completed', 'cancelled'),
    defaultValue: 'on_track',
  },
  created_by: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'performance_goals',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PerformanceGoal;

