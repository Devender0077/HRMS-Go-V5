const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');

// Goals
router.get('/goals', performanceController.getAllGoals);
router.post('/goals', performanceController.createGoal);
router.put('/goals/:id', performanceController.updateGoal);
router.delete('/goals/:id', performanceController.deleteGoal);
router.get('/goals/stats', performanceController.getGoalStats);

module.exports = router;

