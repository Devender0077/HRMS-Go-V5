// Contract Management Model Associations
const ContractTemplate = require('./ContractTemplate');
const ContractInstance = require('./ContractInstance');
const TemplateField = require('./TemplateField');
const ContractFieldValue = require('./ContractFieldValue');
const ContractAuditLog = require('./ContractAuditLog');
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

  console.log('✅ Contract management model associations set up');
}

module.exports = { setupContractAssociations };

