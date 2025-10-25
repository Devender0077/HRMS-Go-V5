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

async function setupTables() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Create announcements table
    console.log('\n📋 Creating announcements table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
        target_audience ENUM('all', 'employees', 'managers', 'hr', 'admins') DEFAULT 'all',
        status ENUM('draft', 'published', 'archived') DEFAULT 'published',
        user_id BIGINT UNSIGNED NOT NULL COMMENT 'Author user ID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ announcements table ready');

    // Create conversations table
    console.log('\n💬 Creating conversations table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) DEFAULT NULL,
        type ENUM('direct', 'group') DEFAULT 'direct',
        avatar VARCHAR(500) DEFAULT NULL,
        last_message TEXT DEFAULT NULL,
        last_message_at TIMESTAMP NULL DEFAULT NULL,
        unread_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_updated_at (updated_at),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ conversations table ready');

    // Create conversation_participants table
    console.log('\n👥 Creating conversation_participants table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP NULL DEFAULT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_participant (conversation_id, user_id),
        INDEX idx_user_id (user_id),
        INDEX idx_conversation_id (conversation_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ conversation_participants table ready');

    // Create messages table
    console.log('\n💌 Creating messages table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id BIGINT UNSIGNED NOT NULL,
        content TEXT NOT NULL,
        type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_created_at (created_at),
        INDEX idx_is_read (is_read)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ messages table ready');

    // Add last_seen column to users table if it doesn't exist
    console.log('\n👤 Checking users table for last_seen column...');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'last_seen'
    `, [dbConfig.database]);

    if (columns.length === 0) {
      console.log('Adding last_seen column to users table...');
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN last_seen TIMESTAMP NULL DEFAULT NULL AFTER avatar
      `);
      console.log('✅ last_seen column added');
    } else {
      console.log('✅ last_seen column already exists');
    }

    // Insert sample announcements
    console.log('\n📢 Inserting sample announcements...');
    const [existingAnnouncements] = await connection.query('SELECT COUNT(*) as count FROM announcements');
    
    if (existingAnnouncements[0].count === 0) {
      await connection.query(`
        INSERT INTO announcements (title, content, priority, target_audience, user_id, created_at) VALUES
        ('Welcome to HRMS GO!', 'Welcome to our new HR Management System. We are excited to have you here!', 'normal', 'all', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
        ('System Maintenance', 'Scheduled maintenance on Saturday from 2 AM to 6 AM. Please save your work.', 'high', 'all', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
        ('New Policy Update', 'Please review the updated company policies in the HR section.', 'normal', 'employees', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
        ('Team Building Event', 'Join us for a team building event next Friday at 4 PM!', 'low', 'all', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
        ('Performance Reviews', 'Performance reviews will begin next week. Please prepare your self-assessments.', 'urgent', 'employees', 1, NOW())
      `);
      console.log('✅ Sample announcements inserted');
    } else {
      console.log('✅ Announcements already exist, skipping sample data');
    }

    // Insert sample conversation
    console.log('\n💬 Inserting sample conversation...');
    const [existingConversations] = await connection.query('SELECT COUNT(*) as count FROM conversations');
    
    if (existingConversations[0].count === 0) {
      // Get first two users
      const [users] = await connection.query('SELECT id FROM users LIMIT 2');
      
      if (users.length >= 2) {
        const [convResult] = await connection.query(`
          INSERT INTO conversations (name, type, last_message, last_message_at, updated_at) 
          VALUES ('Direct Message', 'direct', 'Hello! How are you?', NOW(), NOW())
        `);
        
        const conversationId = convResult.insertId;
        
        // Add participants
        await connection.query(`
          INSERT INTO conversation_participants (conversation_id, user_id) 
          VALUES (?, ?), (?, ?)
        `, [conversationId, users[0].id, conversationId, users[1].id]);
        
        // Add a sample message
        await connection.query(`
          INSERT INTO messages (conversation_id, sender_id, content, type, is_read) 
          VALUES (?, ?, 'Hello! How are you?', 'text', 0)
        `, [conversationId, users[0].id]);
        
        console.log('✅ Sample conversation created');
      } else {
        console.log('⚠️  Not enough users to create sample conversation');
      }
    } else {
      console.log('✅ Conversations already exist, skipping sample data');
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                                                        ║');
    console.log('║          ✅ SETUP COMPLETE!                            ║');
    console.log('║                                                        ║');
    console.log('║  Tables Created:                                       ║');
    console.log('║  • announcements                                       ║');
    console.log('║  • conversations                                       ║');
    console.log('║  • conversation_participants                           ║');
    console.log('║  • messages                                            ║');
    console.log('║                                                        ║');
    console.log('║  Sample Data Added:                                    ║');
    console.log('║  • 5 announcements                                     ║');
    console.log('║  • 1 conversation                                      ║');
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

// Run the setup
setupTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });

