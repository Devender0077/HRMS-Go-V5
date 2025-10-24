const express = require('express');
const router = express.Router();
const leaveBalanceController = require('../controllers/leaveBalance.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Root endpoint - get all balances (returns summary or requires employeeId)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Leave balance endpoint. Use /:employeeId/balance to get specific employee balance',
    endpoints: [
      'GET /:employeeId/balance - Get employee leave balance',
      'GET /:employeeId/history - Get leave history',
      'GET /:employeeId/stats - Get leave statistics'
    ]
  });
});

// Employee leave balance
router.get('/:employeeId/balance', leaveBalanceController.getEmployeeLeaveBalance);
router.get('/:employeeId/history', leaveBalanceController.getEmployeeLeaveHistory);
router.get('/:employeeId/stats', leaveBalanceController.getEmployeeLeaveStats);

module.exports = router;

