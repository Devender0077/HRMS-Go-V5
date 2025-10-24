const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const AiConfiguration = sequelize.define('AiConfiguration', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  aiEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ai_enabled',
  },
  openaiApiKey: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'openai_api_key',
  },
  model: {
    type: DataTypes.STRING(50),
    defaultValue: 'gpt-4',
  },
  maxTokens: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    field: 'max_tokens',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'ai_configurations',
  timestamps: true,
  underscored: true,
});

module.exports = AiConfiguration;

