const express = require('express');
const router = express.Router();
const templateFieldController = require('../controllers/templateField.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/template/:templateId', templateFieldController.getByTemplate);
router.get('/template/:templateId/detect', templateFieldController.detectFields);
router.post('/', templateFieldController.create);
router.post('/bulk-save', templateFieldController.bulkSave);
router.put('/:id', templateFieldController.update);
router.delete('/:id', templateFieldController.delete);

module.exports = router;

