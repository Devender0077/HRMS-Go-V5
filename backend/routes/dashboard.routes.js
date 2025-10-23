const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// Get comprehensive dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get quick actions and notifications
router.get('/quick-actions', dashboardController.getQuickActions);

// Get recent activities
router.get('/recent-activities', dashboardController.getRecentActivities);

module.exports = router;

