const express = require('express');
const router = express.Router();
const assetAssignmentController = require('../controllers/assetAssignment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Asset assignment routes
router.get('/', verifyToken, assetAssignmentController.getAll);
router.get('/:id', verifyToken, assetAssignmentController.getById);
router.post('/', verifyToken, assetAssignmentController.create);
router.put('/:id/return', verifyToken, assetAssignmentController.returnAsset);
router.put('/:id/transfer', verifyToken, assetAssignmentController.transfer);
router.delete('/:id', verifyToken, assetAssignmentController.delete);

module.exports = router;

