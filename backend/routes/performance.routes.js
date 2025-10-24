const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');

// Goals
router.get('/goals', performanceController.getAllGoals);
router.post('/goals', performanceController.createGoal);
router.put('/goals/:id', performanceController.updateGoal);
router.delete('/goals/:id', performanceController.deleteGoal);
router.get('/goals/stats', performanceController.getGoalStats);

// Reviews (placeholder - returns success for now)
router.get('/reviews', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Performance reviews endpoint ready'
  });
});

router.post('/reviews', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Review creation endpoint ready'
  });
});

module.exports = router;

