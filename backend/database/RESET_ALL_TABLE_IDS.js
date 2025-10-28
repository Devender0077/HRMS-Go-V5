/**
 * RESET ALL TABLE AUTO-INCREMENT IDS
 * 
 * Resets auto-increment for ALL tables in the database
 * This ensures clean, sequential IDs starting from 1
 */

require('dotenv').config();
const db = require('../config/database');

async function resetAllTableIDs() {
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║          🔄 RESETTING ALL TABLE AUTO-INCREMENT IDs              ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    // Get all tables in database
    const [tables] = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`📊 Found ${tables.length} tables in database\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let resetCount = 0;
    let skippedCount = 0;

    for (const table of tables) {
      const tableName = table.table_name || table.TABLE_NAME;
      
      try {
        // Get current max ID
        const [maxResult] = await db.query(`SELECT MAX(id) as maxId FROM \`${tableName}\``);
        const maxId = maxResult[0]?.maxId || 0;
        
        // Reset auto-increment to maxId + 1 (or 1 if table is empty)
        const nextId = maxId + 1;
        await db.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${nextId}`);
        
        console.log(`✅ ${tableName.padEnd(40)} → Next ID: ${nextId} (Max: ${maxId || 'empty'})`);
        resetCount++;
      } catch (error) {
        // Skip tables without 'id' column
        if (error.message.includes('Unknown column')) {
          console.log(`⏭️  ${tableName.padEnd(40)} → No 'id' column (skipped)`);
          skippedCount++;
        } else {
          console.log(`❌ ${tableName.padEnd(40)} → Error: ${error.message}`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   ✅ Tables reset: ${resetCount}`);
    console.log(`   ⏭️  Tables skipped: ${skippedCount}`);
    console.log(`   📊 Total tables: ${tables.length}\n`);

    console.log('✅ ALL TABLE IDs RESET!\n');
    console.log('   New records will use clean, sequential IDs\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.end();
  }
}

resetAllTableIDs();

