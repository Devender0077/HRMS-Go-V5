const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication (bypassed in development mode)
router.use(authenticateToken);

// Special routes (specific actions)
router.get('/applications', leaveController.getApplications);
router.post('/applications', leaveController.applyLeave);
router.put('/applications/:id/approve', leaveController.approveLeave);
router.put('/applications/:id/reject', leaveController.rejectLeave);
router.get('/balances', leaveController.getBalances);
router.get('/types', leaveController.getTypes);

// CRUD routes
router.get('/', leaveController.getAll);
router.get('/:id', leaveController.getById);
router.post('/', leaveController.create);
router.put('/:id', leaveController.update);
router.delete('/:id', leaveController.delete);

module.exports = router;

