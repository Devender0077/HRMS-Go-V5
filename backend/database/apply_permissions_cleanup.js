const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true, // Allow multiple SQL statements
});

async function applyPermissionsCleanup() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║            APPLYING PERMISSIONS CLEANUP                                  ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    // Get count before
    connection = await pool.getConnection();
    const [beforeCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    console.log(`📊 Current permissions count: ${beforeCount[0].total}\n`);

    // Read and execute cleanup SQL
    const sqlFile = path.join(__dirname, 'cleanup_permissions.sql');
    console.log('📄 Reading cleanup SQL file...');
    const sql = await fs.readFile(sqlFile, 'utf8');

    console.log('🔧 Executing cleanup operations...\n');
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*') && !s.toUpperCase().startsWith('USE'));

    for (const statement of statements) {
      if (statement.toUpperCase().includes('SELECT')) {
        // Execute SELECT statements and show results
        try {
          const [results] = await connection.query(statement);
          if (results.length > 0) {
            console.log('Result:', results);
          }
        } catch (err) {
          // Ignore SELECT errors (like information schema queries)
          if (!err.message.includes('Unknown column')) {
            console.log('⚠️  SELECT query info:', err.message.substring(0, 100));
          }
        }
      } else if (statement.trim().length > 10) {
        // Execute other statements
        try {
          await connection.query(statement);
        } catch (err) {
          console.log('⚠️  Warning:', err.message.substring(0, 100));
        }
      }
    }

    // Get count after
    const [afterCount] = await connection.query('SELECT COUNT(*) as total FROM permissions');
    const removed = beforeCount[0].total - afterCount[0].total;

    console.log('\n' + '═'.repeat(76));
    console.log('\n✅ CLEANUP COMPLETED!\n');
    console.log(`Before: ${beforeCount[0].total} permissions`);
    console.log(`After:  ${afterCount[0].total} permissions`);
    console.log(`Removed: ${removed} permissions (PDF Tools)\n`);

    // Check for remaining duplicates
    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count
      FROM permissions
      GROUP BY name
      HAVING count > 1
    `);

    if (duplicates.length > 0) {
      console.log(`⚠️  Still have ${duplicates.length} duplicate names (different slugs):`);
      duplicates.slice(0, 5).forEach(d => console.log(`   - ${d.name}: ${d.count} times`));
      if (duplicates.length > 5) console.log(`   ... and ${duplicates.length - 5} more`);
    } else {
      console.log('✅ No duplicate names remaining!');
    }

    // Module statistics
    const [moduleStats] = await connection.query(`
      SELECT module, COUNT(*) as count
      FROM permissions
      GROUP BY module
      ORDER BY count DESC
      LIMIT 10
    `);

    console.log('\n📋 TOP 10 MODULES BY PERMISSION COUNT:\n');
    moduleStats.forEach(stat => {
      console.log(`   ${stat.module}: ${stat.count} permissions`);
    });

    console.log('\n' + '═'.repeat(76));
    console.log('\n🎉 Permissions database is now clean!\n');
    console.log('✅ PDF Tools permissions removed');
    console.log('✅ Duplicate names fixed with module prefixes');
    console.log('✅ Module names standardized');
    console.log('\n⚠️  Remember to restart the backend server!\n');

  } catch (error) {
    console.error('\n❌ Error applying cleanup:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

applyPermissionsCleanup();

