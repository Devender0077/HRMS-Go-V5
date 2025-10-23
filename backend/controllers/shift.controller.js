const Shift = require('../models/Shift');

exports.getAll = async (req, res) => {
  try {
    const shifts = await Shift.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: { shifts } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shifts', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });
    res.status(200).json({ success: true, data: { shift } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shift', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json({ success: true, message: 'Shift created successfully', data: { shift } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating shift', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });
    await shift.update(req.body);
    res.status(200).json({ success: true, message: 'Shift updated successfully', data: { shift } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating shift', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });
    await shift.destroy();
    res.status(200).json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting shift', error: error.message });
  }
};

