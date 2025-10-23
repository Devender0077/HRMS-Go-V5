const TrainingProgram = require('../models/TrainingProgram');

// Get all training programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await TrainingProgram.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching training programs', error: error.message });
  }
};

// Create training program
exports.createProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error creating training program', error: error.message });
  }
};

// Update training program
exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await TrainingProgram.update(req.body, { where: { id } });
    const updated = await TrainingProgram.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating training program', error: error.message });
  }
};

// Delete training program
exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await TrainingProgram.destroy({ where: { id } });
    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting training program', error: error.message });
  }
};

// Get training stats
exports.getTrainingStats = async (req, res) => {
  try {
    const total = await TrainingProgram.count();
    const active = await TrainingProgram.count({ where: { status: 'active' } });
    const upcoming = await TrainingProgram.count({ where: { status: 'upcoming' } });
    const completed = await TrainingProgram.count({ where: { status: 'completed' } });
    
    res.json({ total, active, upcoming, completed });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

