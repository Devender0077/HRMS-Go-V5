const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leaveBalance.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Employee leave balance
router.get('/:employeeId/balance', leaveBalanceController.getEmployeeLeaveBalance);
router.get('/:employeeId/history', leaveBalanceController.getEmployeeLeaveHistory);
router.get('/:employeeId/stats', leaveBalanceController.getEmployeeLeaveStats);

module.exports = router;

