const Asset = require('../models/Asset');
const AssetCategory = require('../models/AssetCategory');
const { Op } = require('sequelize');

// Get all assets
exports.getAll = async (req, res) => {
  try {
    const { status, category, department, search } = req.query;
    const where = {};

    if (status) where.current_status = status;
    if (category) where.category_id = category;
    if (department) where.department_id = department;
    if (search) {
      where[Op.or] = [
        { asset_name: { [Op.like]: `%${search}%` } },
        { asset_code: { [Op.like]: `%${search}%` } },
        { serial_number: { [Op.like]: `%${search}%` } },
      ];
    }

    const assets = await Asset.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { assets },
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assets',
      error: error.message,
    });
  }
};

// Get asset by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { asset },
    });
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset',
      error: error.message,
    });
  }
};

// Create asset
exports.create = async (req, res) => {
  try {
    const {
      asset_code,
      asset_name,
      category_id,
      serial_number,
      brand,
      model,
      specifications,
      purchase_date,
      purchase_cost,
      current_value,
      warranty_period,
      warranty_expiry,
      current_status,
      condition,
      location,
      department_id,
      notes,
    } = req.body;

    // Check if asset code already exists
    const existing = await Asset.findOne({ where: { asset_code } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Asset code already exists',
      });
    }

    const asset = await Asset.create({
      asset_code,
      asset_name,
      category_id,
      serial_number,
      brand,
      model,
      specifications,
      purchase_date,
      purchase_cost,
      current_value: current_value || purchase_cost,
      warranty_period,
      warranty_expiry,
      current_status: current_status || 'available',
      condition: condition || 'good',
      location,
      department_id,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: { asset },
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating asset',
      error: error.message,
    });
  }
};

// Update asset
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    // Check if new asset code already exists (excluding current asset)
    if (req.body.asset_code && req.body.asset_code !== asset.asset_code) {
      const existing = await Asset.findOne({
        where: { asset_code: req.body.asset_code },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Asset code already exists',
        });
      }
    }

    await asset.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: { asset },
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating asset',
      error: error.message,
    });
  }
};

// Delete asset
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    await asset.destroy();

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset',
      error: error.message,
    });
  }
};

// Get assets statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const availableAssets = await Asset.count({ where: { current_status: 'available' } });
    const assignedAssets = await Asset.count({ where: { current_status: 'assigned' } });
    const maintenanceAssets = await Asset.count({ where: { current_status: 'under_maintenance' } });
    const retiredAssets = await Asset.count({ where: { current_status: 'retired' } });

    res.status(200).json({
      success: true,
      data: {
        totalAssets,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        retiredAssets,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

