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

// Regularization routes
router.get('/regularizations', attendanceController.getRegularizations);
router.post('/regularizations', attendanceController.createRegularization);
router.put('/regularizations/:id', attendanceController.updateRegularization);
router.put('/regularizations/:id/approve', attendanceController.approveRegularization);
router.put('/regularizations/:id/reject', attendanceController.rejectRegularization);
router.delete('/regularizations/:id', attendanceController.deleteRegularization);

// CRUD routes
router.get('/', attendanceController.getAll);
router.get('/calendar', attendanceController.getCalendar);
router.get('/:id', attendanceController.getById);
router.post('/', attendanceController.create);
router.put('/:id', attendanceController.update);
router.delete('/:id', attendanceController.delete);

module.exports = router;

