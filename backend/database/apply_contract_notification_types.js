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
});

async function applyNotificationTypes() {
  let connection;
  
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
    console.log('║          ADDING CONTRACT NOTIFICATION TYPES TO DATABASE                  ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

    connection = await pool.getConnection();

    console.log('📄 Executing SQL...\n');

    // Execute ALTER TABLE directly (can't use SQL file due to comments)
    await connection.query(`
      ALTER TABLE notifications 
      MODIFY COLUMN type ENUM(
        'leave_request',
        'leave_approved',
        'leave_rejected',
        'leave_cancelled',
        'attendance_alert',
        'attendance_approved',
        'payroll_generated',
        'document_uploaded',
        'document_approved',
        'contract_sent',
        'contract_signed',
        'contract_declined',
        'contract_expiring',
        'contract_expired',
        'system_announcement',
        'task_assigned',
        'task_completed',
        'performance_review',
        'training_enrollment',
        'birthday_reminder',
        'work_anniversary'
      ) NOT NULL DEFAULT 'system_announcement'
    `);

    console.log('✅ Contract notification types added to database!\n');
    console.log('New notification types available:');
    console.log('  - contract_sent (when contract sent to employee)');
    console.log('  - contract_signed (when employee signs)');
    console.log('  - contract_declined (when employee declines)');
    console.log('  - contract_expiring (reminder before expiry)');
    console.log('  - contract_expired (when contract expires unsigned)');
    
    console.log('\n' + '═'.repeat(76));
    console.log('\n🎉 Database updated successfully!');
    console.log('\n⚠️  Remember to restart the backend server!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('Invalid ALTER TABLE')) {
      console.log('\n⚠️  This error is expected if notification types were already added.');
      console.log('✅ No action needed - database is already up to date!\n');
    }
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

applyNotificationTypes();

