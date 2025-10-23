const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication (bypassed in development mode)
router.use(authenticateToken);

// Routes
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);
router.get('/stats/summary', employeeController.getStatistics);

module.exports = router;

