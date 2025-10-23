const express = require('express');
const router = express.Router();
const assetMaintenanceController = require('../controllers/assetMaintenance.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Asset maintenance routes
router.get('/', verifyToken, assetMaintenanceController.getAll);
router.get('/upcoming', verifyToken, assetMaintenanceController.getUpcoming);
router.get('/:id', verifyToken, assetMaintenanceController.getById);
router.post('/', verifyToken, assetMaintenanceController.create);
router.put('/:id', verifyToken, assetMaintenanceController.update);
router.delete('/:id', verifyToken, assetMaintenanceController.delete);

module.exports = router;

