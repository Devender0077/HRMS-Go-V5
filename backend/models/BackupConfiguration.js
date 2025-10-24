const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const BackupConfiguration = sequelize.define('BackupConfiguration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  autoBackupEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'auto_backup_enabled',
  },
  backupFrequency: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
    defaultValue: 'daily',
    field: 'backup_frequency',
  },
  backupTime: {
    type: DataTypes.TIME,
    defaultValue: '02:00:00',
    field: 'backup_time',
  },
  backupRetentionDays: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    field: 'backup_retention_days',
  },
  storageType: {
    type: DataTypes.ENUM('local', 's3', 'azure', 'gcp'),
    defaultValue: 'local',
    field: 'storage_type',
  },
  s3Bucket: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 's3_bucket',
  },
  s3Region: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 's3_region',
  },
  s3AccessKey: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 's3_access_key',
  },
  s3SecretKey: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 's3_secret_key',
  },
  lastBackupAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_backup_at',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'backup_configurations',
  timestamps: true,
  underscored: true,
});

module.exports = BackupConfiguration;

