const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function checkIntegrationData() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n🔍 Checking integration data...\n');

    const integrationTables = [
      'integration_pusher',
      'integration_slack',
      'integration_teams',
      'integration_zoom'
    ];

    for (const tableName of integrationTables) {
      console.log(`\n━━━ ${tableName.toUpperCase()} ━━━`);
      
      // Get table structure
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      console.log('Columns:', columns.map(c => c.Field).join(', '));
      
      // Get data
      const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
      console.log(`Rows: ${rows.length}`);
      
      if (rows.length > 0) {
        console.log('Data:', JSON.stringify(rows[0], null, 2));
      } else {
        console.log('⚠️  No data found');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

checkIntegrationData()
  .then(() => {
    console.log('\n✅ Check complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

