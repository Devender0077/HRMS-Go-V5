const express = require('express');
const router = express.Router();
const generalSettingsController = require('../controllers/generalSettings.controller');

// Get all settings
router.get('/', generalSettingsController.getAll);

// Get public settings
router.get('/public', generalSettingsController.getPublic);

// Get settings by category
router.get('/category/:category', generalSettingsController.getByCategory);

// Get setting by key
router.get('/key/:key', generalSettingsController.getByKey);

// Create or update a single setting
router.post('/', generalSettingsController.upsert);

// Update multiple settings
router.post('/bulk', generalSettingsController.updateMultiple);

// Delete a setting
router.delete('/key/:key', generalSettingsController.delete);

module.exports = router;
