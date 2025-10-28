const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// CRUD routes
router.get('/', contractController.getAll);
router.get('/:id', contractController.getById);
router.post('/', contractController.create);
router.put('/:id', contractController.update);
router.delete('/:id', contractController.delete);

module.exports = router;

