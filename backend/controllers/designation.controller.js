const Designation = require('../models/Designation');

exports.getAll = async (req, res) => {
  try {
    const designations = await Designation.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: { designations } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching designations', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const designation = await Designation.findByPk(req.params.id);
    if (!designation) return res.status(404).json({ success: false, message: 'Designation not found' });
    res.status(200).json({ success: true, data: { designation } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching designation', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const designation = await Designation.create(req.body);
    res.status(201).json({ success: true, message: 'Designation created successfully', data: { designation } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating designation', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const designation = await Designation.findByPk(req.params.id);
    if (!designation) return res.status(404).json({ success: false, message: 'Designation not found' });
    await designation.update(req.body);
    res.status(200).json({ success: true, message: 'Designation updated successfully', data: { designation } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating designation', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const designation = await Designation.findByPk(req.params.id);
    if (!designation) return res.status(404).json({ success: false, message: 'Designation not found' });
    await designation.destroy();
    res.status(200).json({ success: true, message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting designation', error: error.message });
  }
};

