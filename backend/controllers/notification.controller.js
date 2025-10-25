const Notification = require('../models/Notification');
const { Op } = require('sequelize');

// Get all notifications for current user
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { limit = 50, unreadOnly = false } = req.query;

    const where = { userId };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
    });

    const unreadCount = await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findOne({
      where: {
        id,
        userId, // Ensure user owns this notification
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    await Notification.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false,
        },
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message,
    });
  }
};

// Delete notification
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findOne({
      where: {
        id,
        userId, // Ensure user owns this notification
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

// Create notification (system use)
exports.create = async (req, res) => {
  try {
    const { userId, type, title, description, relatedId, relatedType, avatar } = req.body;

    const notification = await Notification.create({
      userId,
      type,
      title,
      description,
      relatedId,
      relatedType,
      avatar,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

