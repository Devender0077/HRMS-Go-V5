const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const ContractSigner = sequelize.define('ContractSigner', {
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
  
  // Signer Information
  signerType: {
    type: DataTypes.ENUM('sender', 'employee', 'manager', 'hr_manager', 'witness', 'third_party'),
    allowNull: false,
    field: 'signer_type',
  },
  signerOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'signer_order',
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'user_id',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'full_name',
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  
  // Status Tracking
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'viewed', 'in_progress', 'signed', 'declined', 'expired'),
    defaultValue: 'pending',
  },
  sentAt: {
    type: DataTypes.DATE,
    field: 'sent_at',
  },
  viewedAt: {
    type: DataTypes.DATE,
    field: 'viewed_at',
  },
  signedAt: {
    type: DataTypes.DATE,
    field: 'signed_at',
  },
  declinedAt: {
    type: DataTypes.DATE,
    field: 'declined_at',
  },
  declineReason: {
    type: DataTypes.TEXT,
    field: 'decline_reason',
  },
  
  // Signature Data
  signatureMethod: {
    type: DataTypes.ENUM('draw', 'type', 'upload', 'digital_certificate'),
    field: 'signature_method',
  },
  signatureData: {
    type: DataTypes.TEXT('long'),
    field: 'signature_data',
  },
  signatureHash: {
    type: DataTypes.STRING(255),
    field: 'signature_hash',
  },
  typedSignatureText: {
    type: DataTypes.STRING(255),
    field: 'typed_signature_text',
  },
  typedSignatureFont: {
    type: DataTypes.STRING(100),
    field: 'typed_signature_font',
  },
  
  // Legal Compliance
  consentGiven: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'consent_given',
  },
  consentTimestamp: {
    type: DataTypes.DATE,
    field: 'consent_timestamp',
  },
  consentText: {
    type: DataTypes.TEXT,
    field: 'consent_text',
  },
  consentIp: {
    type: DataTypes.STRING(45),
    field: 'consent_ip',
  },
  intentToSign: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'intent_to_sign',
  },
  intentTimestamp: {
    type: DataTypes.DATE,
    field: 'intent_timestamp',
  },
  
  // Authentication & Security
  authenticationMethod: {
    type: DataTypes.ENUM('email', 'sms', 'password', 'sso', 'biometric'),
    field: 'authentication_method',
  },
  authenticationToken: {
    type: DataTypes.STRING(255),
    field: 'authentication_token',
  },
  authenticationVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'authentication_verified',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'user_agent',
  },
  geoLocation: {
    type: DataTypes.STRING(255),
    field: 'geo_location',
  },
  deviceFingerprint: {
    type: DataTypes.STRING(255),
    field: 'device_fingerprint',
  },
  browserFingerprint: {
    type: DataTypes.TEXT,
    field: 'browser_fingerprint',
  },
  
  // Reminders
  reminderCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'reminder_count',
  },
  lastReminderSent: {
    type: DataTypes.DATE,
    field: 'last_reminder_sent',
  },
  accessCode: {
    type: DataTypes.STRING(100),
    field: 'access_code',
  },
  accessCodeExpires: {
    type: DataTypes.DATE,
    field: 'access_code_expires',
  },
}, {
  tableName: 'contract_signers',
  timestamps: true,
  underscored: true,
});

module.exports = ContractSigner;

