// Contract Management Model Associations
const ContractTemplate = require('./ContractTemplate');
const ContractInstance = require('./ContractInstance');
const ContractSigner = require('./ContractSigner');
const TemplateField = require('./TemplateField');
const ContractFieldValue = require('./ContractFieldValue');
const ContractAuditLog = require('./ContractAuditLog');
const ContractCertificate = require('./ContractCertificate');
const SignatureVerificationLog = require('./SignatureVerificationLog');
const EmployeeOnboardingDocument = require('./EmployeeOnboardingDocument');
const Employee = require('./Employee');
const User = require('./User');

function setupContractAssociations() {
  // ContractTemplate <-> TemplateField (One-to-Many)
  ContractTemplate.hasMany(TemplateField, {
    foreignKey: 'templateId',
    as: 'fields',
    onDelete: 'CASCADE',
  });
  TemplateField.belongsTo(ContractTemplate, {
    foreignKey: 'templateId',
    as: 'template',
  });

  // ContractTemplate <-> ContractInstance (One-to-Many)
  ContractTemplate.hasMany(ContractInstance, {
    foreignKey: 'templateId',
    as: 'instances',
    onDelete: 'SET NULL',
  });
  ContractInstance.belongsTo(ContractTemplate, {
    foreignKey: 'templateId',
    as: 'template',
  });

  // ContractInstance <-> ContractFieldValue (One-to-Many)
  ContractInstance.hasMany(ContractFieldValue, {
    foreignKey: 'instanceId',
    as: 'fieldValues',
    onDelete: 'CASCADE',
  });
  ContractFieldValue.belongsTo(ContractInstance, {
    foreignKey: 'instanceId',
    as: 'instance',
  });

  // TemplateField <-> ContractFieldValue (One-to-Many)
  TemplateField.hasMany(ContractFieldValue, {
    foreignKey: 'fieldId',
    as: 'values',
    onDelete: 'SET NULL',
  });
  ContractFieldValue.belongsTo(TemplateField, {
    foreignKey: 'fieldId',
    as: 'field',
  });

  // ContractInstance <-> ContractAuditLog (One-to-Many)
  ContractInstance.hasMany(ContractAuditLog, {
    foreignKey: 'instanceId',
    as: 'auditLogs',
    onDelete: 'CASCADE',
  });
  ContractAuditLog.belongsTo(ContractInstance, {
    foreignKey: 'instanceId',
    as: 'instance',
  });

  // Employee <-> EmployeeOnboardingDocument (One-to-Many)
  Employee.hasMany(EmployeeOnboardingDocument, {
    foreignKey: 'employeeId',
    as: 'onboardingDocuments',
    onDelete: 'CASCADE',
  });
  EmployeeOnboardingDocument.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

  // ContractInstance <-> EmployeeOnboardingDocument (One-to-Many)
  ContractInstance.hasMany(EmployeeOnboardingDocument, {
    foreignKey: 'contractInstanceId',
    as: 'onboardingLinks',
    onDelete: 'SET NULL',
  });
  EmployeeOnboardingDocument.belongsTo(ContractInstance, {
    foreignKey: 'contractInstanceId',
    as: 'contractInstance',
  });

  // User associations (created by)
  User.hasMany(ContractTemplate, {
    foreignKey: 'createdBy',
    as: 'createdTemplates',
    onDelete: 'SET NULL',
  });
  ContractTemplate.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  User.hasMany(ContractInstance, {
    foreignKey: 'createdBy',
    as: 'createdContracts',
    onDelete: 'SET NULL',
  });
  ContractInstance.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  User.hasMany(ContractFieldValue, {
    foreignKey: 'filledBy',
    as: 'filledValues',
    onDelete: 'SET NULL',
  });
  ContractFieldValue.belongsTo(User, {
    foreignKey: 'filledBy',
    as: 'filler',
  });

  User.hasMany(ContractAuditLog, {
    foreignKey: 'performedBy',
    as: 'auditActions',
    onDelete: 'SET NULL',
  });
  ContractAuditLog.belongsTo(User, {
    foreignKey: 'performedBy',
    as: 'performer',
  });

  // ContractInstance <-> ContractSigner (One-to-Many) - Multi-signer support
  ContractInstance.hasMany(ContractSigner, {
    foreignKey: 'contractInstanceId',
    as: 'signers',
    onDelete: 'CASCADE',
  });
  ContractSigner.belongsTo(ContractInstance, {
    foreignKey: 'contractInstanceId',
    as: 'contractInstance',
  });

  // User <-> ContractSigner (One-to-Many)
  User.hasMany(ContractSigner, {
    foreignKey: 'userId',
    as: 'signedContracts',
    onDelete: 'SET NULL',
  });
  ContractSigner.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // ContractSigner <-> ContractFieldValue (One-to-Many)
  ContractSigner.hasMany(ContractFieldValue, {
    foreignKey: 'signerId',
    as: 'filledFields',
    onDelete: 'SET NULL',
  });
  ContractFieldValue.belongsTo(ContractSigner, {
    foreignKey: 'signerId',
    as: 'signer',
  });

  // ContractInstance <-> ContractCertificate (One-to-Many)
  ContractInstance.hasMany(ContractCertificate, {
    foreignKey: 'contractInstanceId',
    as: 'certificates',
    onDelete: 'CASCADE',
  });
  ContractCertificate.belongsTo(ContractInstance, {
    foreignKey: 'contractInstanceId',
    as: 'contractInstance',
  });

  // ContractSigner <-> ContractCertificate (One-to-Many)
  ContractSigner.hasMany(ContractCertificate, {
    foreignKey: 'signerId',
    as: 'certificates',
    onDelete: 'CASCADE',
  });
  ContractCertificate.belongsTo(ContractSigner, {
    foreignKey: 'signerId',
    as: 'signer',
  });

  // ContractInstance <-> SignatureVerificationLog (One-to-Many)
  ContractInstance.hasMany(SignatureVerificationLog, {
    foreignKey: 'contractInstanceId',
    as: 'verificationLogs',
    onDelete: 'CASCADE',
  });
  SignatureVerificationLog.belongsTo(ContractInstance, {
    foreignKey: 'contractInstanceId',
    as: 'contractInstance',
  });

  // User <-> SignatureVerificationLog (One-to-Many)
  User.hasMany(SignatureVerificationLog, {
    foreignKey: 'verifiedByUserId',
    as: 'performedVerifications',
    onDelete: 'SET NULL',
  });
  SignatureVerificationLog.belongsTo(User, {
    foreignKey: 'verifiedByUserId',
    as: 'verifier',
  });

  console.log('✅ Contract management model associations set up (including multi-signer & legal compliance)');
}

module.exports = { setupContractAssociations };

