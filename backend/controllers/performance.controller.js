const PerformanceGoal = require('../models/PerformanceGoal');

// Get all goals
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await PerformanceGoal.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Create goal
exports.createGoal = async (req, res) => {
  try {
    const goal = await PerformanceGoal.create(req.body);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error: error.message });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await PerformanceGoal.update(req.body, { where: { id } });
    const updated = await PerformanceGoal.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await PerformanceGoal.destroy({ where: { id } });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

// Get goal stats
exports.getGoalStats = async (req, res) => {
  try {
    const total = await PerformanceGoal.count();
    const onTrack = await PerformanceGoal.count({ where: { status: 'on_track' } });
    const behind = await PerformanceGoal.count({ where: { status: 'behind' } });
    const completed = await PerformanceGoal.count({ where: { status: 'completed' } });
    
    res.json({ total, onTrack, behind, completed });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

