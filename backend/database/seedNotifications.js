const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
};

async function seedNotifications() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('\n📬 Seeding sample notifications...\n');

    // Get test user IDs
    const [users] = await connection.execute(
      'SELECT id, email FROM users WHERE email IN (?, ?, ?, ?, ?)',
      ['employee@test.com', 'manager@test.com', 'hr@test.com', 'hrmanager@test.com', 'superadmin@test.com']
    );

    if (users.length === 0) {
      console.log('❌ No test users found');
      return;
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Sample notifications for each user
    const notifications = [];

    users.forEach(user => {
      // Recent notifications (unread)
      notifications.push({
        user_id: user.id,
        type: 'system_announcement',
        title: 'Welcome to HRMS Go V5',
        description: 'Your account has been set up successfully. Explore the features!',
        is_read: false,
        avatar: '/assets/icons/notification/ic_mail.svg',
        created_at: now,
        updated_at: now,
      });

      notifications.push({
        user_id: user.id,
        type: 'attendance_alert',
        title: 'Attendance Reminder',
        description: 'Don\'t forget to clock in today.',
        is_read: false,
        avatar: '/assets/icons/notification/ic_package.svg',
        created_at: yesterday,
        updated_at: yesterday,
      });

      // Older notifications (read)
      notifications.push({
        user_id: user.id,
        type: 'leave_approved',
        title: 'Leave Request Approved',
        description: 'Your leave request for Oct 20-22 has been approved.',
        is_read: true,
        avatar: '/assets/icons/notification/ic_chat.svg',
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
      });

      // Role-specific notifications
      if (user.email.includes('manager') || user.email.includes('hr') || user.email.includes('admin')) {
        notifications.push({
          user_id: user.id,
          type: 'leave_request',
          title: 'New Leave Request',
          description: 'John Doe has requested leave for Oct 28-30.',
          is_read: false,
          related_type: 'leave',
          related_id: 1,
          avatar: '/assets/icons/notification/ic_mail.svg',
          created_at: now,
          updated_at: now,
        });
      }
    });

    // Insert notifications
    for (const notif of notifications) {
      await connection.execute(
        `INSERT INTO notifications 
        (user_id, type, title, description, is_read, avatar, related_type, related_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notif.user_id,
          notif.type,
          notif.title,
          notif.description,
          notif.is_read,
          notif.avatar,
          notif.related_type || null,
          notif.related_id || null,
          notif.created_at,
          notif.updated_at,
        ]
      );
    }

    console.log(`✅ Created ${notifications.length} sample notifications`);
    console.log(`✅ For ${users.length} test users\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run seeding
seedNotifications()
  .then(() => {
    console.log('✅ Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });

