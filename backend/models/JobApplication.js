const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'job_postings',
      key: 'id',
    },
  },
  candidate_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
  },
  experience: {
    type: DataTypes.INTEGER,
  },
  current_company: {
    type: DataTypes.STRING(255),
  },
  resume_path: {
    type: DataTypes.STRING(500),
  },
  cover_letter: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('applied', 'screening', 'interview', 'offer', 'rejected', 'hired'),
    defaultValue: 'applied',
  },
  applied_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'job_applications',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = JobApplication;

