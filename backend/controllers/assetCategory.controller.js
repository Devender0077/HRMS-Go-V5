const AssetCategory = require('../models/AssetCategory');

// Get all asset categories
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) where.status = status;

    const categories = await AssetCategory.findAll({
      where,
      order: [['name', 'ASC']],
    });

    console.log(`✅ Found ${categories.length} asset categories`);

    res.status(200).json({
      success: true,
      data: categories, // Return array directly
    });
  } catch (error) {
    console.error('Get asset categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset categories',
      error: error.message,
    });
  }
};

// Get asset category by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await AssetCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error('Get asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset category',
      error: error.message,
    });
  }
};

// Create asset category
exports.create = async (req, res) => {
  try {
    const { name, code, description, icon, status } = req.body;

    // Check if code already exists
    const existing = await AssetCategory.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category code already exists',
      });
    }

    const category = await AssetCategory.create({
      name,
      code,
      description,
      icon: icon || 'eva:cube-outline',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Asset category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating asset category',
      error: error.message,
    });
  }
};

// Update asset category
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await AssetCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found',
      });
    }

    // Check if new code already exists (excluding current category)
    if (req.body.code && req.body.code !== category.code) {
      const existing = await AssetCategory.findOne({
        where: { code: req.body.code },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category code already exists',
        });
      }
    }

    await category.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Asset category updated successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Update asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating asset category',
      error: error.message,
    });
  }
};

// Delete asset category
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await AssetCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Asset category not found',
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Asset category deleted successfully',
    });
  } catch (error) {
    console.error('Delete asset category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset category',
      error: error.message,
    });
  }
};

