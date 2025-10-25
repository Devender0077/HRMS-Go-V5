const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function checkIntegrationTables() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n🔍 Checking integration-related tables and data...\n');

    // Check for integration tables
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE '%integration%'"
    );
    
    console.log('📋 Tables with "integration" in name:');
    if (tables.length === 0) {
      console.log('   ⚠️  No dedicated integration tables found');
    } else {
      tables.forEach(table => console.log('   ✅', Object.values(table)[0]));
    }

    // Check general_settings for integration data
    console.log('\n📋 Checking general_settings for integration data...');
    const [settings] = await connection.execute(
      "SELECT * FROM general_settings WHERE setting_key LIKE '%pusher%' OR setting_key LIKE '%slack%' OR setting_key LIKE '%teams%' OR setting_key LIKE '%zoom%'"
    );
    
    if (settings.length === 0) {
      console.log('   ⚠️  No integration settings found in general_settings');
    } else {
      console.log(`   ✅ Found ${settings.length} integration settings:`);
      settings.forEach(s => console.log(`      - ${s.setting_key}: ${s.setting_value ? 'HAS VALUE' : 'EMPTY'}`));
    }

    // Check all specialized tables for integration data
    const specializeTables = [
      'slack_integration_settings',
      'pusher_integration_settings',
      'teams_integration_settings',
      'zoom_integration_settings',
      'integration_settings'
    ];

    console.log('\n📋 Checking specialized integration tables...');
    for (const tableName of specializeTables) {
      try {
        const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 1`);
        console.log(`   ✅ ${tableName}: ${rows.length} row(s)`);
        if (rows.length > 0) {
          console.log('      Columns:', Object.keys(rows[0]).join(', '));
        }
      } catch (error) {
        console.log(`   ❌ ${tableName}: Does not exist`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

checkIntegrationTables()
  .then(() => {
    console.log('\n✅ Check complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

