/**
 * Database Cleanup Script
 * Removes redundant tables and consolidates to specialized tables only
 */

const sequelize = require('../config/database2');
const db = require('../config/database');

async function cleanupDatabase() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    🧹 Database Cleanup - Removing Redundant Tables            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Tables to drop (redundant or unused)
    const tablesToDrop = [
      'general_settings',  // Replaced by specialized tables
      'system_settings',   // Duplicate of general_settings
    ];

    console.log('🗑️  Dropping Redundant Tables:\n');
    
    let dropped = 0;
    for (const table of tablesToDrop) {
      try {
        await db.query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`  ✅ Dropped: ${table}`);
        dropped++;
      } catch (error) {
        console.log(`  ⚠️  Could not drop ${table}:`, error.message);
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║    ✅ Cleanup Complete - ${dropped} Tables Dropped              ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Show remaining tables count
    const [tables] = await db.query('SHOW TABLES');
    console.log(`📊 Total tables remaining: ${tables.length}\n`);

    console.log('✅ Database is now clean and using specialized tables only!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };

