const AttendancePolicy = require('../models/AttendancePolicy');

exports.getAll = async (req, res) => {
  try {
    const policies = await AttendancePolicy.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: { policies } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching policies', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const policy = await AttendancePolicy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
    res.status(200).json({ success: true, data: { policy } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching policy', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const policy = await AttendancePolicy.create(req.body);
    res.status(201).json({ success: true, message: 'Policy created successfully', data: { policy } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating policy', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const policy = await AttendancePolicy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
    await policy.update(req.body);
    res.status(200).json({ success: true, message: 'Policy updated successfully', data: { policy } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating policy', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const policy = await AttendancePolicy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
    await policy.destroy();
    res.status(200).json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting policy', error: error.message });
  }
};

