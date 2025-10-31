const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const SignatureVerificationLog = sequelize.define('SignatureVerificationLog', {
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
  
  // Verification Details
  verifiedByUserId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'verified_by_user_id',
  },
  verificationTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'verification_timestamp',
  },
  verificationMethod: {
    type: DataTypes.ENUM('manual', 'automatic', 'scheduled'),
    defaultValue: 'manual',
    field: 'verification_method',
  },
  
  // Hash Verification
  documentHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'document_hash',
  },
  expectedHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'expected_hash',
  },
  hashesMatch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'hashes_match',
  },
  
  // Verification Result
  verificationResult: {
    type: DataTypes.ENUM('valid', 'invalid', 'tampered', 'corrupted', 'expired'),
    allowNull: false,
    field: 'verification_result',
  },
  tamperDetected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'tamper_detected',
  },
  tamperDetails: {
    type: DataTypes.TEXT,
    field: 'tamper_details',
  },
  
  // Certificate Validation
  certificateValid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'certificate_valid',
  },
  certificateExpired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'certificate_expired',
  },
  signatureValid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'signature_valid',
  },
  
  // Metadata
  verificationNotes: {
    type: DataTypes.TEXT,
    field: 'verification_notes',
  },
}, {
  tableName: 'signature_verification_log',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = SignatureVerificationLog;

