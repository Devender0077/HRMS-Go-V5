-- ============================================================================
-- MESSENGER & ANNOUNCEMENTS DATABASE TABLES
-- Run this script in your MySQL client to create all required tables
-- ============================================================================

USE hrms_go_v5;

-- ============================================================================
-- 1. ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
  target_audience ENUM('all', 'employees', 'managers', 'hr', 'admins') DEFAULT 'all',
  status ENUM('draft', 'published', 'archived') DEFAULT 'published',
  user_id INT NOT NULL COMMENT 'Author user ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. CONVERSATIONS TABLE
-- ============================================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. CONVERSATION_PARTICIPANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (conversation_id, user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_conversation_id (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. ADD last_seen COLUMN TO USERS TABLE (IF NOT EXISTS)
-- ============================================================================
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'hrms_go_v5' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'last_seen'
);

SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE users ADD COLUMN last_seen TIMESTAMP NULL DEFAULT NULL AFTER avatar',
  'SELECT "Column last_seen already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 6. INSERT SAMPLE DATA
-- ============================================================================

-- Sample Announcements
INSERT IGNORE INTO announcements (id, title, content, priority, target_audience, user_id, created_at) VALUES
(1, 'Welcome to HRMS GO!', 'Welcome to our new HR Management System. We are excited to have you here!', 'normal', 'all', 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 'System Maintenance', 'Scheduled maintenance on Saturday from 2 AM to 6 AM. Please save your work.', 'high', 'all', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 'New Policy Update', 'Please review the updated company policies in the HR section.', 'normal', 'employees', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 'Team Building Event', 'Join us for a team building event next Friday at 4 PM!', 'low', 'all', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'Performance Reviews', 'Performance reviews will begin next week. Please prepare your self-assessments.', 'urgent', 'employees', 1, NOW());

-- Sample Conversation (between first two users if they exist)
SET @user1_id = (SELECT id FROM users ORDER BY id LIMIT 1);
SET @user2_id = (SELECT id FROM users ORDER BY id LIMIT 1,1);

-- Only insert if we have at least 2 users
INSERT INTO conversations (id, name, type, last_message, last_message_at, updated_at)
SELECT 1, 'Direct Message', 'direct', 'Hello! How are you?', NOW(), NOW()
WHERE (SELECT COUNT(*) FROM users) >= 2
AND NOT EXISTS (SELECT 1 FROM conversations WHERE id = 1);

-- Add participants if conversation was created
INSERT INTO conversation_participants (conversation_id, user_id)
SELECT 1, @user1_id
WHERE (SELECT COUNT(*) FROM conversations WHERE id = 1) > 0
AND NOT EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = 1 AND user_id = @user1_id);

INSERT INTO conversation_participants (conversation_id, user_id)
SELECT 1, @user2_id
WHERE (SELECT COUNT(*) FROM conversations WHERE id = 1) > 0
AND @user2_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = 1 AND user_id = @user2_id);

-- Add sample message
INSERT INTO messages (conversation_id, sender_id, content, type, is_read)
SELECT 1, @user1_id, 'Hello! How are you?', 'text', 0
WHERE (SELECT COUNT(*) FROM conversations WHERE id = 1) > 0
AND NOT EXISTS (SELECT 1 FROM messages WHERE conversation_id = 1);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT '✅ Announcements table created' AS status, COUNT(*) AS rows FROM announcements;
SELECT '✅ Conversations table created' AS status, COUNT(*) AS rows FROM conversations;
SELECT '✅ Conversation_participants table created' AS status, COUNT(*) AS rows FROM conversation_participants;
SELECT '✅ Messages table created' AS status, COUNT(*) AS rows FROM messages;

-- Check if last_seen column exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ last_seen column exists in users table'
    ELSE '❌ last_seen column NOT found'
  END AS status
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hrms_go_v5' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'last_seen';

SELECT '🎉 MESSENGER TABLES SETUP COMPLETE!' AS message;

