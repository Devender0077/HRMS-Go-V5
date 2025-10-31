const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractCertificate = sequelize.define('ContractCertificate', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  contractInstanceId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'contract_instance_id',
  },
  signerId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'signer_id',
  },
  
  // Certificate Type
  certificateType: {
    type: DataTypes.ENUM('signing', 'completion', 'verification', 'timestamp'),
    allowNull: false,
    field: 'certificate_type',
  },
  
  // Certificate Data
  certificateData: {
    type: DataTypes.TEXT,
    field: 'certificate_data',
  },
  publicKey: {
    type: DataTypes.TEXT,
    field: 'public_key',
  },
  certificateHash: {
    type: DataTypes.STRING(255),
    field: 'certificate_hash',
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    field: 'serial_number',
  },
  
  // Issuer & Validity
  issuer: {
    type: DataTypes.STRING(255),
    defaultValue: 'HRMS GO Certificate Authority',
  },
  issuedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'issued_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    field: 'expires_at',
  },
  valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  
  // Timestamp Authority
  timestampAuthority: {
    type: DataTypes.STRING(255),
    field: 'timestamp_authority',
  },
  timestampToken: {
    type: DataTypes.TEXT,
    field: 'timestamp_token',
  },
}, {
  tableName: 'contract_certificates',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ContractCertificate;

