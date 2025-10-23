const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Organization chart endpoints
router.get('/chart', organizationController.getOrganizationChart);
router.get('/stats', organizationController.getOrganizationStats);

module.exports = router;

