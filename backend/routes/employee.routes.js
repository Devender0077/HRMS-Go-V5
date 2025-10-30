const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication (bypassed in development mode)
router.use(authenticateToken);

// Routes
router.get('/dropdown', employeeController.getForDropdown); // No RBAC restrictions for dropdowns
router.get('/stats/summary', employeeController.getStatistics); // Move before /:id to avoid conflicts
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

// System access management
router.post('/:id/grant-access', employeeController.grantSystemAccess);
router.post('/:id/revoke-access', employeeController.revokeSystemAccess);

module.exports = router;

