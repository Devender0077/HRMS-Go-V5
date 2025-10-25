const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function checkTables() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n🔍 Checking attendance-related tables...\n');
    
    const [tables] = await connection.execute("SHOW TABLES LIKE '%attendance%'");
    
    console.log('Tables found:');
    tables.forEach(table => {
      console.log(' -', Object.values(table)[0]);
    });

    console.log('\n✅ Done\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTables();

