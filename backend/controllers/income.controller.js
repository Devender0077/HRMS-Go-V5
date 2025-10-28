const Income = require('../models/Income');
const { Op } = require('sequelize');

// Get all income
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, source } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category && category !== 'all') where.category = category;
    if (source) where.source = { [Op.like]: `%${source}%` };

    const incomeRecords = await Income.findAll({
      where,
      order: [['income_date', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    const totalCount = await Income.count({ where });

    res.json({
      success: true,
      data: {
        income: incomeRecords,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch income',
      error: error.message,
    });
  }
};

// Get income by ID
exports.getById = async (req, res) => {
  try {
    const income = await Income.findByPk(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch income',
      error: error.message,
    });
  }
};

// Create income
exports.create = async (req, res) => {
  try {
    const income = await Income.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Income record created successfully',
      data: income,
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create income record',
      error: error.message,
    });
  }
};

// Update income
exports.update = async (req, res) => {
  try {
    const income = await Income.findByPk(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    await income.update(req.body);

    res.json({
      success: true,
      message: 'Income record updated successfully',
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update income record',
      error: error.message,
    });
  }
};

// Delete income
exports.delete = async (req, res) => {
  try {
    const income = await Income.findByPk(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    await income.destroy();

    res.json({
      success: true,
      message: 'Income record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete income record',
      error: error.message,
    });
  }
};

