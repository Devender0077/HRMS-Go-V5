const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Document categories
router.get('/categories', documentsController.getCategories);

// Employee documents
router.get('/employee/:employeeId', documentsController.getEmployeeDocuments);
router.get('/employee/:employeeId/stats', documentsController.getEmployeeDocumentStats);
router.get('/all', documentsController.getAllEmployeeDocuments);
router.post('/upload', documentsController.uploadDocument);
router.put('/:id/verify', documentsController.verifyDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
