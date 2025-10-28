const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// IMPORTANT: Most specific routes FIRST to avoid conflicts!

// Leave Types Management (specific routes)
router.get('/types', leaveController.getTypes);
router.post('/types', leaveController.createLeaveType);
router.put('/types/:id', leaveController.updateLeaveType);
router.delete('/types/:id', leaveController.deleteLeaveType);

// Leave Applications (specific routes)
router.get('/applications', leaveController.getApplications);
router.post('/applications', leaveController.applyLeave);
router.put('/applications/:id/approve', leaveController.approveLeave);
router.put('/applications/:id/reject', leaveController.rejectLeave);

// Leave Balances (specific route)
router.get('/balances', leaveController.getBalances);

// Generic CRUD routes (MUST be last to avoid catching specific routes!)
router.get('/', leaveController.getAll);
router.post('/', leaveController.applyLeave); // Alias to applyLeave
router.get('/:id', leaveController.getById);
router.put('/:id', leaveController.update);
router.delete('/:id', leaveController.delete);

module.exports = router;

