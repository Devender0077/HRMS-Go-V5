const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Asset routes
router.get('/', verifyToken, assetController.getAll);
router.get('/statistics', verifyToken, assetController.getStatistics);
router.get('/:id', verifyToken, assetController.getById);
router.post('/', verifyToken, assetController.create);
router.put('/:id', verifyToken, assetController.update);
router.delete('/:id', verifyToken, assetController.delete);

module.exports = router;

