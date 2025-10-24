const express = require('express');
const router = express.Router();
const generalSettingsController = require('../controllers/generalSettings.controller');
const specializedSettingsController = require('../controllers/specializedSettings.controller');
const settingsCRUDController = require('../controllers/settingsCRUD.controller');

// ============================================================================
// MAIN ENDPOINTS (Specialized Tables)
// ============================================================================

// Get all settings with counts (returns all 22 categories)
router.get('/', specializedSettingsController.getAllSpecialized);

// Get settings by category
router.get('/category/:category', specializedSettingsController.getByCategorySpecialized);

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

// Update settings for a category
router.put('/category/:category', settingsCRUDController.updateSettings);
router.patch('/category/:category', settingsCRUDController.updateSettings);

// Reset settings for a category
router.delete('/category/:category/reset', settingsCRUDController.resetSettings);

// Batch update multiple categories
router.post('/batch', settingsCRUDController.batchUpdate);

// ============================================================================
// LEGACY ROUTES (Backward Compatibility)
// ============================================================================

router.get('/legacy', generalSettingsController.getAll);
router.get('/legacy/category/:category', generalSettingsController.getByCategory);

// Get public settings
router.get('/public', generalSettingsController.getPublic);

// Get setting by key
router.get('/key/:key', generalSettingsController.getByKey);

// Create or update a single setting (legacy)
router.post('/', generalSettingsController.upsert);

// Update multiple settings (legacy)
router.post('/bulk', generalSettingsController.updateMultiple);

// Delete a setting (legacy)
router.delete('/key/:key', generalSettingsController.delete);

module.exports = router;
