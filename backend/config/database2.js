const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance for ORM models
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrms_go_v5',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize ORM connection established'))
  .catch((err) => console.error('❌ Sequelize connection error:', err));

module.exports = sequelize;

