const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const CalendarEvent = sequelize.define('CalendarEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  all_day: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  event_type: {
    type: DataTypes.ENUM('Meeting', 'Appointment', 'Conference', 'Workshop', 'Training', 'Other'),
    defaultValue: 'Other',
  },
  visibility: {
    type: DataTypes.ENUM('Everyone', 'Team', 'Private', 'Public'),
    defaultValue: 'Everyone',
  },
  reminder: {
    type: DataTypes.STRING(50),
    defaultValue: 'None',
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#1890FF',
  },
  text_color: {
    type: DataTypes.STRING(7),
    defaultValue: '#FFFFFF',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'calendar_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Add association for creator
CalendarEvent.belongsTo(require('./User'), {
  foreignKey: 'created_by',
  as: 'creator',
});
module.exports = CalendarEvent;
