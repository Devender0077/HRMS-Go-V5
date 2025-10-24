const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const DocumentTemplate = sequelize.define('DocumentTemplate', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  templateName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'template_name',
  },
  templateType: {
    type: DataTypes.ENUM('offer_letter', 'joining_letter', 'experience_certificate', 'noc', 'other'),
    allowNull: false,
    field: 'template_type',
  },
  templateContent: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    field: 'template_content',
  },
  emailSubject: {
    type: DataTypes.STRING(300),
    allowNull: true,
    field: 'email_subject',
  },
  autoSend: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'auto_send',
  },
  validityDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'validity_days',
  },
  footerText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'footer_text',
  },
  variables: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'List of available variables in template',
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  createdBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'created_by',
  },
  updatedBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'updated_by',
  },
}, {
  tableName: 'document_templates',
  timestamps: true,
  underscored: true,
});

module.exports = DocumentTemplate;

