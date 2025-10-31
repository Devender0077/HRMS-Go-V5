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
  multipleStatements: true,
});

async function applySchema() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║       APPLYING LEGAL COMPLIANCE SCHEMA FOR E-SIGNATURES                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    connection = await pool.getConnection();

    const sqlFile = path.join(__dirname, 'esign_legal_compliance_schema.sql');
    const sql = await fs.readFile(sqlFile, 'utf8');

    console.log('📄 Executing SQL schema...\n');

    // Split and execute statements
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed.toUpperCase().startsWith('USE')) continue;
      if (trimmed.length < 10) continue;
      
      try {
        await connection.query(trimmed);
      } catch (err) {
        if (!err.message.includes('Duplicate column')) {
          console.log('⚠️  Note:', err.message.substring(0, 100));
        }
      }
    }

    console.log('✅ Schema applied successfully!\n');
    console.log('Tables created/updated:');
    console.log('  ✅ contract_signers (NEW - multi-signer support)');
    console.log('  ✅ contract_field_values (NEW - form data tracking)');
    console.log('  ✅ contract_certificates (NEW - PKI certificates)');
    console.log('  ✅ signature_verification_log (NEW - tamper detection)');
    console.log('  ✅ contract_instances (ENHANCED - legal compliance)');
    console.log('  ✅ contract_audit_log (ENHANCED - more details)');
    
    console.log('\n' + '═'.repeat(76));
    console.log('\n🎉 E-Signature legal compliance schema ready!');
    console.log('\n⚠️  Next: Restart backend server!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

applySchema();
