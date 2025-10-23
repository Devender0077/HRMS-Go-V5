const express = require('express');
const router = express.Router();
const assetCategoryController = require('../controllers/assetCategory.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Asset category routes
router.get('/', verifyToken, assetCategoryController.getAll);
router.get('/:id', verifyToken, assetCategoryController.getById);
router.post('/', verifyToken, assetCategoryController.create);
router.put('/:id', verifyToken, assetCategoryController.update);
router.delete('/:id', verifyToken, assetCategoryController.delete);

module.exports = router;

