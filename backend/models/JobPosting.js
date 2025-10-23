const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const JobPosting = sequelize.define('JobPosting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  department_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  location: {
    type: DataTypes.STRING(255),
  },
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern'),
    defaultValue: 'full_time',
  },
  experience_required: {
    type: DataTypes.STRING(100),
  },
  salary_range: {
    type: DataTypes.STRING(100),
  },
  positions: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  description: {
    type: DataTypes.TEXT,
  },
  requirements: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'on_hold'),
    defaultValue: 'open',
  },
  posted_date: {
    type: DataTypes.DATEONLY,
  },
  closing_date: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName: 'job_postings',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = JobPosting;

