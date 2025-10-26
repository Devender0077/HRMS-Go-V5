const mysql = require('mysql2/promise');

// Load environment variables
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function updateNotificationTypes() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    console.log('🔧 Updating notification type ENUM...');
    
    // Alter the type column to include all new types
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
        'system_announcement',
        'task_assigned',
        'task_completed',
        'performance_review',
        'training_enrollment',
        'birthday_reminder',
        'work_anniversary'
      ) NOT NULL DEFAULT 'system_announcement'
    `);
    
    console.log('✅ Notification types updated successfully\n');

    // Show current notification types in use
    const [types] = await connection.query(`
      SELECT type, COUNT(*) as count 
      FROM notifications 
      GROUP BY type
      ORDER BY count DESC
    `);

    console.log('📊 Notification Types in Use:\n');
    console.table(types);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                                                        ║');
    console.log('║          ✅ NOTIFICATION TYPES UPDATED!                 ║');
    console.log('║                                                        ║');
    console.log('║  Now supports 16 notification types:                   ║');
    console.log('║  • Leave: request, approved, rejected, cancelled       ║');
    console.log('║  • Attendance: alert, approved                         ║');
    console.log('║  • Payroll: generated                                  ║');
    console.log('║  • Documents: uploaded, approved                       ║');
    console.log('║  • System: announcement                                ║');
    console.log('║  • Tasks: assigned, completed                          ║');
    console.log('║  • Performance: review                                 ║');
    console.log('║  • Training: enrollment                                ║');
    console.log('║  • HR: birthday, work anniversary                      ║');
    console.log('║                                                        ║');
    console.log('╚════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the script
updateNotificationTypes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

