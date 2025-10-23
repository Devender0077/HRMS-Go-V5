const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication (bypassed in development mode)
router.use(authenticateToken);

// Special routes (specific actions)
router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/records', attendanceController.getRecords);
router.get('/today', attendanceController.getTodayRecord);
router.post('/regularization', attendanceController.requestRegularization);

// CRUD routes
router.get('/', attendanceController.getAll);
router.get('/:id', attendanceController.getById);
router.post('/', attendanceController.create);
router.put('/:id', attendanceController.update);
router.delete('/:id', attendanceController.delete);

module.exports = router;

