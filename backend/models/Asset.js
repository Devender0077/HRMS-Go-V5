const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  asset_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  serial_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  purchase_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  current_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  warranty_period: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Warranty period in months',
  },
  warranty_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  current_status: {
    type: DataTypes.ENUM('available', 'assigned', 'under_maintenance', 'retired'),
    defaultValue: 'available',
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good',
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  qr_code: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'assets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Asset;

