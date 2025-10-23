const express = require('express');
const router = express.Router();
const systemSetupController = require('../controllers/systemSetup.controller');
// const { verifyToken } = require('../middleware/auth.middleware');

// Get all system setup counts
router.get('/counts', systemSetupController.getCounts);

// Get category details
router.get('/category/:categoryId', systemSetupController.getCategoryDetails);

module.exports = router;

