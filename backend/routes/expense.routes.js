const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// Specific routes first
router.put('/:id/approve', expenseController.approve);
router.put('/:id/reject', expenseController.reject);

// CRUD routes
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.post('/', expenseController.create);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);

module.exports = router;

