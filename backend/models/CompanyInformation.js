const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const CompanyInformation = sequelize.define('CompanyInformation', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'company_name',
  },
  companyLegalName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'company_legal_name',
  },
  companyEmail: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: { isEmail: true },
    field: 'company_email',
  },
  companyPhone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'company_phone',
  },
  companyAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'company_address',
  },
  companyCity: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'company_city',
  },
  companyState: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'company_state',
  },
  companyCountry: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'company_country',
  },
  companyPostalCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'company_postal_code',
  },
  companyWebsite: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'company_website',
  },
  companyTaxId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'company_tax_id',
  },
  companyRegistrationNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'company_registration_number',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'company_information',
  timestamps: true,
  underscored: true,
});

module.exports = CompanyInformation;

