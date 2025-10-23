const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const AssetMaintenance = sequelize.define('AssetMaintenance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maintenance_type: {
    type: DataTypes.ENUM('scheduled', 'repair', 'warranty', 'upgrade', 'inspection'),
    defaultValue: 'scheduled',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  service_provider: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'asset_maintenance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AssetMaintenance;

