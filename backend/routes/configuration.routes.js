const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configuration.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
// router.use(authenticateToken);

// Configuration Summary
router.get('/summary', configurationController.getConfigurationSummary);

// Shifts
router.get('/shifts', configurationController.getShifts);
router.post('/shifts', configurationController.createShift);
router.put('/shifts/:id', configurationController.updateShift);
router.delete('/shifts/:id', configurationController.deleteShift);

// Attendance Policies
router.get('/attendance-policies', configurationController.getAttendancePolicies);
router.post('/attendance-policies', configurationController.createAttendancePolicy);
router.put('/attendance-policies/:id', configurationController.updateAttendancePolicy);
router.delete('/attendance-policies/:id', configurationController.deleteAttendancePolicy);

// Salary Components
router.get('/salary-components', configurationController.getSalaryComponents);
router.post('/salary-components', configurationController.createSalaryComponent);
router.put('/salary-components/:id', configurationController.updateSalaryComponent);
router.delete('/salary-components/:id', configurationController.deleteSalaryComponent);

// Payment Methods
router.get('/payment-methods', configurationController.getPaymentMethods);
router.post('/payment-methods', configurationController.createPaymentMethod);
router.put('/payment-methods/:id', configurationController.updatePaymentMethod);
router.delete('/payment-methods/:id', configurationController.deletePaymentMethod);

// Tax Settings
router.get('/tax-settings', configurationController.getTaxSettings);
router.post('/tax-settings', configurationController.createTaxSetting);
router.put('/tax-settings/:id', configurationController.updateTaxSetting);
router.delete('/tax-settings/:id', configurationController.deleteTaxSetting);

// Leave Policies
router.get('/leave-policies', configurationController.getLeavePolicies);

// Recruitment
router.get('/job-categories', configurationController.getJobCategories);
router.get('/job-types', configurationController.getJobTypes);
router.get('/hiring-stages', configurationController.getHiringStages);

// Performance
router.get('/kpi-indicators', configurationController.getKPIIndicators);
router.get('/review-cycles', configurationController.getReviewCycles);
router.get('/goal-categories', configurationController.getGoalCategories);

// Training
router.get('/training-types', configurationController.getTrainingTypes);

// Documents
router.get('/document-types', configurationController.getDocumentTypes);
router.get('/company-policies', configurationController.getCompanyPolicies);

// Awards
router.get('/award-types', configurationController.getAwardTypes);

// Termination
router.get('/termination-types', configurationController.getTerminationTypes);
router.get('/termination-reasons', configurationController.getTerminationReasons);

// Expense
router.get('/expense-categories', configurationController.getExpenseCategories);
router.get('/expense-limits', configurationController.getExpenseLimits);

// Income
router.get('/income-categories', configurationController.getIncomeCategories);
router.get('/income-sources', configurationController.getIncomeSources);

// Contract
router.get('/contract-types', configurationController.getContractTypes);

// Messenger
router.get('/message-templates', configurationController.getMessageTemplates);
router.get('/notification-settings', configurationController.getNotificationSettings);

module.exports = router;

