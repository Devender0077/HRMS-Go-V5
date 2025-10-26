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

async function setUsersOnline() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    // Update last_seen for all active users to NOW (makes them all online)
    console.log('⏰ Setting all active users as online...');
    const [result] = await connection.query(`
      UPDATE users 
      SET last_seen = NOW() 
      WHERE status = 'active'
    `);
    
    console.log('✅ Updated', result.affectedRows, 'users\n');

    // Verify the update
    const [users] = await connection.query(`
      SELECT 
        id,
        name,
        email,
        last_seen,
        CASE WHEN last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online' ELSE 'offline' END as status
      FROM users 
      WHERE status = 'active'
      ORDER BY last_seen DESC
      LIMIT 10
    `);

    console.log('📊 User Status After Update:\n');
    console.table(users.map(u => ({
      id: u.id,
      name: u.name,
      status: u.status,
      last_seen: u.last_seen ? u.last_seen.toISOString().split('T')[1].split('.')[0] : 'NULL'
    })));

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                                                        ║');
    console.log('║          ✅ ALL USERS SET TO ONLINE!                   ║');
    console.log('║                                                        ║');
    console.log('║  Refresh your messenger page to see green dots!       ║');
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
setUsersOnline()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

