const express = require('express');
const router = express.Router();
const contractInstanceController = require('../controllers/contractInstance.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// CRUD routes
router.get('/', contractInstanceController.getAll);
router.get('/stats/dashboard', contractInstanceController.getDashboardStats);
router.get('/:id', contractInstanceController.getById);
router.get('/:id/audit-trail', contractInstanceController.getAuditTrail);
router.post('/', contractInstanceController.create);

// Actions
router.post('/:id/send', contractInstanceController.send);
router.post('/:id/viewed', contractInstanceController.markViewed);
router.post('/:id/complete', contractInstanceController.complete);
router.post('/:id/decline', contractInstanceController.decline);
router.post('/:id/cancel', contractInstanceController.cancel);
router.get('/:id/download', contractInstanceController.downloadSigned);

module.exports = router;

