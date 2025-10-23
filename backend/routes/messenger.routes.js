const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const Pusher = require('pusher');

// Database configuration
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pusher configuration
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'your-app-id',
  key: process.env.PUSHER_KEY || 'your-key',
  secret: process.env.PUSHER_SECRET || 'your-secret',
  cluster: process.env.PUSHER_CLUSTER || 'us2',
  useTLS: true
});

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Middleware to authenticate user (temporary bypass for development)
const authenticateUser = (req, res, next) => {
  // For development, we'll use a mock user
  // In production, verify JWT token
  req.user = {
    id: 1,
    name: 'Admin User',
    email: 'admin@hrms.com',
    avatar: '/assets/images/avatars/avatar_default.jpg'
  };
  next();
};

// Apply authentication middleware
router.use(authenticateUser);

// GET /api/messenger/conversations - Get all conversations for current user
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;
    
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
      ORDER BY c.updated_at DESC
    `, [userId, userId, userId]);

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
    const conversationId = req.params.id;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify user is participant in conversation
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

    // Get messages
    const [messages] = await pool.execute(`
      SELECT 
        m.id,
        m.content,
        m.type,
        m.created_at,
        m.updated_at,
        m.is_read,
        u.id as sender_id,
        u.name as sender_name,
        u.avatar as sender_avatar,
        CASE WHEN m.sender_id = ? THEN 1 ELSE 0 END as is_me
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, conversationId, limit, offset]);

    // Mark messages as read
    await pool.execute(
      'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?',
      [conversationId, userId]
    );

    res.json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
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
    const conversationId = req.params.id;
    const userId = req.user.id;
    const { content, type = 'text' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify user is participant in conversation
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

    // Insert message
    const [result] = await pool.execute(`
      INSERT INTO messages (conversation_id, sender_id, content, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [conversationId, userId, content.trim(), type]);

    const messageId = result.insertId;

    // Update conversation last message
    await pool.execute(`
      UPDATE conversations 
      SET last_message = ?, last_message_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `, [content.trim(), conversationId]);

    // Get the created message with sender info
    const [newMessage] = await pool.execute(`
      SELECT 
        m.id,
        m.content,
        m.type,
        m.created_at,
        m.updated_at,
        m.is_read,
        u.id as sender_id,
        u.name as sender_name,
        u.avatar as sender_avatar,
        1 as is_me
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [messageId]);

    // Trigger Pusher event for real-time updates
    await pusher.trigger(`conversation-${conversationId}`, 'new-message', {
      message: newMessage[0],
      conversationId: conversationId
    });

    // Trigger event for conversation list update
    await pusher.trigger(`user-${userId}`, 'conversation-updated', {
      conversationId: conversationId,
      lastMessage: content.trim(),
      lastMessageAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
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
    const { participantId, type = 'direct' } = req.body;

    if (type === 'direct' && !participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required for direct conversations'
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
    const [conversationResult] = await pool.execute(`
      INSERT INTO conversations (name, type, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [type === 'direct' ? 'Direct Message' : req.body.name || 'Group Chat', type]);

    const conversationId = conversationResult.insertId;

    // Add participants
    const participants = type === 'direct' ? [userId, participantId] : [userId, ...(req.body.participants || [])];
    
    for (const participantId of participants) {
      await pool.execute(`
        INSERT INTO conversation_participants (conversation_id, user_id, joined_at)
        VALUES (?, ?, NOW())
      `, [conversationId, participantId]);
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

module.exports = router;
