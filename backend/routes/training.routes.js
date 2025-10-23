const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');

// Training Programs
router.get('/programs', trainingController.getAllPrograms);
router.post('/programs', trainingController.createProgram);
router.put('/programs/:id', trainingController.updateProgram);
router.delete('/programs/:id', trainingController.deleteProgram);
router.get('/programs/stats', trainingController.getTrainingStats);

module.exports = router;

