const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holiday.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Holiday routes
router.get('/upcoming', holidayController.getUpcoming);
router.post('/bulk-import', holidayController.bulkImport);
router.get('/', holidayController.getAll);
router.get('/:id', holidayController.getById);
router.post('/', holidayController.create);
router.put('/:id', holidayController.update);
router.delete('/:id', holidayController.delete);

module.exports = router;

