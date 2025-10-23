const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication (bypassed in development mode)
router.use(authenticateToken);

// Special routes (specific actions)
router.get('/runs', payrollController.getRuns);
router.post('/runs', payrollController.createRun);
router.post('/runs/:id/process', payrollController.processPayroll);
router.get('/payslips', payrollController.getPayslips);
router.get('/components', payrollController.getComponents);

// CRUD routes
router.get('/', payrollController.getAll);
router.get('/:id', payrollController.getById);
router.post('/', payrollController.create);
router.put('/:id', payrollController.update);
router.delete('/:id', payrollController.delete);

module.exports = router;

