const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// CRUD routes
router.get('/', incomeController.getAll);
router.get('/:id', incomeController.getById);
router.post('/', incomeController.create);
router.put('/:id', incomeController.update);
router.delete('/:id', incomeController.delete);

module.exports = router;

