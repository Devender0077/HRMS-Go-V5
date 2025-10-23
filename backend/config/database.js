const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create MySQL2 connection pool for raw queries (used in controllers)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'hrms_go_v5',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Create Sequelize instance for ORM models
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrms_go_v5',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || '127.0.0.1',
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

// Test connections
Promise.all([
  pool.getConnection().then(connection => {
    console.log('✅ MySQL2 Pool connection established successfully');
    connection.release();
  }),
  sequelize.authenticate().then(() => {
    console.log('✅ Sequelize ORM connection established successfully');
  })
]).catch((err) => {
  console.error('❌ Database connection error:', err);
});

// Export pool as default (for controllers using raw SQL)
module.exports = pool;
// Also export sequelize for models
module.exports.sequelize = sequelize;

