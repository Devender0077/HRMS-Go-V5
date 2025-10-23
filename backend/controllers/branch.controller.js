const Branch = require('../models/Branch');

exports.getAll = async (req, res) => {
  try {
    const branches = await Branch.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: { branches } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching branches', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    res.status(200).json({ success: true, data: { branch } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching branch', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, message: 'Branch created successfully', data: { branch } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating branch', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    await branch.update(req.body);
    res.status(200).json({ success: true, message: 'Branch updated successfully', data: { branch } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating branch', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
    await branch.destroy();
    res.status(200).json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting branch', error: error.message });
  }
};

