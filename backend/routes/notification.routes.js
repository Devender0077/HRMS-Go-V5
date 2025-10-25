const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Get all notifications for current user
router.get('/', notificationController.getAll);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.delete);

// Create notification (for testing or system use)
router.post('/', notificationController.create);

module.exports = router;

