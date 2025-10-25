const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function checkTodayAttendance() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║          🔍 CHECKING TODAY\'S ATTENDANCE RECORDS                            ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log('Today\'s date:', today);
    console.log('');

    // Get all attendance records for today
    const [records] = await connection.execute(`
      SELECT a.*, 
             CONCAT(e.first_name, ' ', e.last_name) as employee_name,
             e.employee_id as emp_code,
             u.email as user_email
      FROM attendance a
      LEFT JOIN employees e ON a.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE a.date = ?
      ORDER BY a.id DESC
    `, [today]);

    if (records.length === 0) {
      console.log('❌ NO ATTENDANCE RECORDS FOUND FOR TODAY');
      console.log('');
      
      // Check most recent records
      const [recent] = await connection.execute(`
        SELECT a.*, 
               CONCAT(e.first_name, ' ', e.last_name) as employee_name,
               e.employee_id as emp_code
        FROM attendance a
        LEFT JOIN employees e ON a.employee_id = e.id
        ORDER BY a.date DESC, a.id DESC
        LIMIT 5
      `);
      
      console.log('📋 MOST RECENT ATTENDANCE RECORDS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      recent.forEach(r => {
        console.log(`Date: ${r.date} | Employee: ${r.employee_name} (${r.emp_code})`);
        console.log(`  Clock In: ${r.clock_in || 'NULL'}`);
        console.log(`  Clock Out: ${r.clock_out || 'NULL'}`);
        console.log('');
      });
    } else {
      console.log(`✅ FOUND ${records.length} RECORD(S) FOR TODAY:`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      records.forEach((r, idx) => {
        console.log(`\n${idx + 1}. Attendance ID: ${r.id}`);
        console.log(`   Employee: ${r.employee_name} (${r.emp_code})`);
        console.log(`   User Email: ${r.user_email || 'N/A'}`);
        console.log(`   Employee ID: ${r.employee_id}`);
        console.log(`   Date: ${r.date}`);
        console.log(`   Clock In: ${r.clock_in || 'NULL'}`);
        console.log(`   Clock Out: ${r.clock_out || 'NULL'}`);
        console.log(`   Status: ${r.status}`);
        console.log(`   Total Hours: ${r.total_hours || 'NULL'}`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Check Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run check
checkTodayAttendance()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

