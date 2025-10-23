const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const TrainingProgram = sequelize.define('TrainingProgram', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
  },
  duration: {
    type: DataTypes.STRING(100),
  },
  trainer_name: {
    type: DataTypes.STRING(255),
  },
  description: {
    type: DataTypes.TEXT,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  enrolled_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  start_date: {
    type: DataTypes.DATEONLY,
  },
  end_date: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled', 'full'),
    defaultValue: 'upcoming',
  },
}, {
  tableName: 'training_programs',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TrainingProgram;

