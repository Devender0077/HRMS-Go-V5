const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function checkPusherTables() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n🔍 Checking all Pusher-related tables...\n');

    // Find all tables with 'pusher' in name
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE '%pusher%'"
    );
    
    console.log('📋 Tables with "pusher" in name:');
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found with "pusher" in name');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log('   ✅', tableName);
      });
    }

    // Check each pusher table
    for (const tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      console.log(`\n━━━ ${tableName.toUpperCase()} ━━━`);
      
      // Get structure
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      console.log('Columns:', columns.map(c => `${c.Field} (${c.Type})`).join(', '));
      
      // Get data
      const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
      console.log(`Rows: ${rows.length}`);
      
      if (rows.length > 0) {
        rows.forEach((row, idx) => {
          console.log(`\nRow ${idx + 1}:`, JSON.stringify(row, null, 2));
        });
      } else {
        console.log('⚠️  No data found - table is empty');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

checkPusherTables()
  .then(() => {
    console.log('\n✅ Check complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

