const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { authenticateToken } = require('../middleware/auth.middleware');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Apply authentication middleware
router.use(authenticateToken);

// GET /api/messenger/conversations - Get all conversations for current user
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [conversations] = await pool.execute(`
      SELECT 
        c.id,
        CASE 
          WHEN c.type = 'group' THEN c.name
          ELSE (
            SELECT u2.name 
            FROM conversation_participants cp2
            JOIN users u2 ON cp2.user_id = u2.id
            WHERE cp2.conversation_id = c.id AND cp2.user_id != ?
            LIMIT 1
          )
        END as name,
        c.type,
        c.last_message,
        c.last_message_at,
        c.unread_count,
        c.updated_at,
        CASE 
          WHEN c.type = 'group' THEN c.avatar
          ELSE (
            SELECT u2.avatar 
            FROM conversation_participants cp2
            JOIN users u2 ON cp2.user_id = u2.id
            WHERE cp2.conversation_id = c.id AND cp2.user_id != ?
            LIMIT 1
          )
        END as avatar,
        CASE 
          WHEN c.type = 'group' THEN 'group'
          ELSE (
            SELECT CASE WHEN u2.last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online' ELSE 'offline' END
            FROM conversation_participants cp2
            JOIN users u2 ON cp2.user_id = u2.id
            WHERE cp2.conversation_id = c.id AND cp2.user_id != ?
            LIMIT 1
          )
        END as status
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = ?
      ORDER BY c.updated_at DESC
    `, [userId, userId, userId, userId]);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
});

// GET /api/messenger/conversations/:id/messages - Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user.id;

    console.log('📨 Fetching messages - Conversation:', conversationId, 'User:', userId);

    // Simple query - just get all messages for this conversation
    const [messages] = await pool.query(`
      SELECT 
        m.id,
        m.content,
        m.type,
        m.created_at,
        m.updated_at,
        m.is_read,
        m.sender_id,
        u.name as sender_name,
        u.avatar as sender_avatar,
        CASE WHEN m.sender_id = ? THEN 1 ELSE 0 END as is_me
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `, [userId, conversationId]);

    console.log('✅ Found', messages.length, 'messages for conversation', conversationId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('❌ ERROR FETCHING MESSAGES:');
    console.error('  Conversation ID:', req.params.id);
    console.error('  User ID:', req.user?.id);
    console.error('  Error:', error.message);
    console.error('  Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// POST /api/messenger/conversations/:id/messages - Send a message
router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content, type = 'text' } = req.body;

    console.log('📤 Sending message - Conversation:', conversationId, 'User:', userId, 'Content:', content);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Insert message
    const [result] = await pool.query(`
      INSERT INTO messages (conversation_id, sender_id, content, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [conversationId, userId, content.trim(), type]);

    const messageId = result.insertId;
    console.log('✅ Message inserted with ID:', messageId);

    // Update conversation last message
    await pool.query(`
      UPDATE conversations 
      SET last_message = ?, last_message_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `, [content.trim(), conversationId]);

    // Get the created message with sender info
    const [newMessages] = await pool.query(`
      SELECT 
        m.id,
        m.content,
        m.type,
        m.created_at,
        m.updated_at,
        m.is_read,
        m.sender_id,
        u.name as sender_name,
        u.avatar as sender_avatar,
        1 as is_me
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [messageId]);

    console.log('✅ Message sent successfully:', newMessages[0]);

    res.json({
      success: true,
      data: newMessages[0]
    });
  } catch (error) {
    console.error('❌ ERROR SENDING MESSAGE:');
    console.error('  Error:', error.message);
    console.error('  Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// POST /api/messenger/conversations - Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantId, type = 'direct', name, participants } = req.body;

    if (type === 'direct' && !participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required for direct conversations'
      });
    }

    if (type === 'group' && (!name || !participants || participants.length < 2)) {
      return res.status(400).json({
        success: false,
        message: 'Group name and at least 2 participants are required for group conversations'
      });
    }

    // Check if direct conversation already exists
    if (type === 'direct') {
      const [existing] = await pool.execute(`
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
        JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
        WHERE c.type = 'direct' 
        AND cp1.user_id = ? AND cp2.user_id = ?
        AND cp1.user_id != cp2.user_id
      `, [userId, participantId]);

      if (existing.length > 0) {
        return res.json({
          success: true,
          data: { id: existing[0].id, isExisting: true }
        });
      }
    }

    // Create conversation
    const conversationName = type === 'direct' ? 'Direct Message' : (name || 'Group Chat');
    const [conversationResult] = await pool.execute(`
      INSERT INTO conversations (name, type, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [conversationName, type]);

    const conversationId = conversationResult.insertId;

    // Add participants
    const allParticipants = type === 'direct' 
      ? [userId, participantId] 
      : [userId, ...participants];
    
    // Remove duplicates
    const uniqueParticipants = [...new Set(allParticipants)];
    
    for (const pId of uniqueParticipants) {
      await pool.execute(`
        INSERT INTO conversation_participants (conversation_id, user_id, joined_at)
        VALUES (?, ?, NOW())
      `, [conversationId, pId]);
    }

    res.json({
      success: true,
      data: { id: conversationId, isExisting: false }
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation',
      error: error.message
    });
  }
});

// PUT /api/messenger/conversations/:id/read - Mark messages as read
router.put('/conversations/:id/read', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    // Mark messages as read
    await pool.execute(
      'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?',
      [conversationId, userId]
    );

    // Update unread count
    await pool.execute(`
      UPDATE conversations 
      SET unread_count = 0, updated_at = NOW()
      WHERE id = ?
    `, [conversationId]);

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
});

// GET /api/messenger/users/online - Get online users
router.get('/users/online', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT 
        id,
        name,
        email,
        avatar,
        last_seen,
        CASE WHEN last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online' ELSE 'offline' END as status
      FROM users 
      WHERE status = 'active'
      ORDER BY last_seen DESC
    `);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch online users',
      error: error.message
    });
  }
});

// GET /api/messenger/conversations/search - Search conversations
router.get('/conversations/search', async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q || '';

    if (query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const [conversations] = await pool.execute(`
      SELECT 
        c.id,
        c.name,
        c.type,
        c.last_message,
        c.last_message_at,
        c.unread_count,
        c.updated_at,
        CASE 
          WHEN c.type = 'group' THEN c.avatar
          ELSE u.avatar
        END as avatar,
        CASE 
          WHEN c.type = 'group' THEN 'group'
          ELSE CASE WHEN u.last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'online' ELSE 'offline' END
        END as status
      FROM conversations c
      LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN users u ON (c.type = 'direct' AND u.id != ? AND u.id IN (
        SELECT user_id FROM conversation_participants WHERE conversation_id = c.id AND user_id != ?
      ))
      WHERE cp.user_id = ? 
      AND (c.name LIKE ? OR c.last_message LIKE ?)
      ORDER BY c.updated_at DESC
    `, [userId, userId, userId, `%${query}%`, `%${query}%`]);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search conversations',
      error: error.message
    });
  }
});

// DELETE /api/messenger/conversations/:id - Delete a conversation
router.delete('/conversations/:id', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    // Verify user is participant
    const [participants] = await pool.execute(
      'SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id = ?',
      [conversationId, userId]
    );

    if (participants.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    // Delete conversation (CASCADE will delete participants and messages)
    await pool.execute('DELETE FROM conversations WHERE id = ?', [conversationId]);

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
});

// DELETE /api/messenger/conversations/:id/messages - Clear all messages in a conversation
router.delete('/conversations/:id/messages', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    // Verify user is participant
    const [participants] = await pool.execute(
      'SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id = ?',
      [conversationId, userId]
    );

    if (participants.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    // Delete all messages
    await pool.execute('DELETE FROM messages WHERE conversation_id = ?', [conversationId]);

    // Update conversation
    await pool.execute(`
      UPDATE conversations 
      SET last_message = NULL, last_message_at = NULL, unread_count = 0, updated_at = NOW()
      WHERE id = ?
    `, [conversationId]);

    res.json({
      success: true,
      message: 'Chat cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat',
      error: error.message
    });
  }
});

module.exports = router;
