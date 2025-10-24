const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const LocalizationSetting = sequelize.define('LocalizationSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  defaultLanguage: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
    field: 'default_language',
  },
  defaultCurrency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
    field: 'default_currency',
  },
  currencySymbol: {
    type: DataTypes.STRING(10),
    defaultValue: '$',
    field: 'currency_symbol',
  },
  currencyPosition: {
    type: DataTypes.ENUM('before', 'after'),
    defaultValue: 'before',
    field: 'currency_position',
  },
  thousandsSeparator: {
    type: DataTypes.STRING(5),
    defaultValue: ',',
    field: 'thousands_separator',
  },
  decimalSeparator: {
    type: DataTypes.STRING(5),
    defaultValue: '.',
    field: 'decimal_separator',
  },
  numberOfDecimals: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    field: 'number_of_decimals',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'localization_settings',
  timestamps: true,
  underscored: true,
});

module.exports = LocalizationSetting;

