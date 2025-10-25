const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// POST /api/pusher/auth - Authenticate Pusher private channels
router.post('/auth', authenticateToken, async (req, res) => {
  try {
    const { socket_id, channel_name } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!socket_id || !channel_name) {
      return res.status(400).json({
        success: false,
        message: 'socket_id and channel_name are required'
      });
    }

    // For now, allow all authenticated users to subscribe to their own channels
    // In production, add proper authorization logic here
    const isAuthorized = channel_name.includes(`user-${userId}`) || 
                         channel_name.startsWith('presence-') ||
                         channel_name.startsWith('private-');

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized channel access'
      });
    }

    // Since we don't have Pusher configured yet, return a mock auth response
    // When Pusher is properly configured, use pusher.authorizeChannel()
    
    // Mock response for development
    res.json({
      auth: `mock:${socket_id}:${channel_name}`,
      channel_data: JSON.stringify({
        user_id: userId,
        user_info: {
          name: req.user.name,
          email: req.user.email
        }
      })
    });

  } catch (error) {
    console.error('Pusher auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate Pusher channel',
      error: error.message
    });
  }
});

module.exports = router;

