const express = require('express');
const router = express.Router();
const employeeOnboardingController = require('../controllers/employeeOnboarding.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/my-documents', employeeOnboardingController.getMyDocuments);
router.get('/employee/:employeeId/progress', employeeOnboardingController.getEmployeeProgress);
router.post('/create-checklist', employeeOnboardingController.createChecklist);
router.post('/send-documents', employeeOnboardingController.sendDocuments);
router.post('/:id/waive', employeeOnboardingController.waive);

module.exports = router;

