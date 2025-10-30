const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const TemplateField = sequelize.define('TemplateField', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'template_id',
  },
  fieldName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'field_name',
  },
  fieldType: {
    type: DataTypes.ENUM('text', 'date', 'signature', 'initials', 'checkbox', 'dropdown', 'email', 'number'),
    defaultValue: 'text',
    field: 'field_type',
  },
  fieldLabel: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'field_label',
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'required',
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'page_number',
  },
  xPosition: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'x_position',
  },
  yPosition: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'y_position',
  },
  width: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'width',
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'height',
  },
  defaultValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'default_value',
  },
  validationRules: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'validation_rules',
  },
  placeholder: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'placeholder',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'template_fields',
  timestamps: true,
  underscored: false,
});

module.exports = TemplateField;

