const express = require('express');
const router = express.Router();
const contractAnalyticsController = require('../controllers/contractAnalytics.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Analytics routes
router.get('/analytics', contractAnalyticsController.getAnalytics);
router.get('/top-templates', contractAnalyticsController.getTopTemplates);
router.get('/pending', contractAnalyticsController.getPendingContracts);
router.get('/onboarding-report', contractAnalyticsController.getOnboardingReport);

module.exports = router;

