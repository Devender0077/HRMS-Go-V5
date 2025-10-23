const Permission = require('../models/Permission');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all permissions
exports.getAll = async (req, res) => {
  try {
    const { module, search } = req.query;
    const where = {};

    if (module) where.module = module;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const permissions = await Permission.findAll({
      where,
      order: [['module', 'ASC'], ['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: { permissions },
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message,
    });
  }
};

// Get permissions grouped by module
exports.getByModule = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['module', 'ASC'], ['name', 'ASC']],
    });

    // Group by module
    const grouped = permissions.reduce((acc, perm) => {
      const module = perm.module;
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(perm);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: { permissions: grouped },
    });
  } catch (error) {
    console.error('Get permissions by module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message,
    });
  }
};

// Get permission by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { permission },
    });
  } catch (error) {
    console.error('Get permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permission',
      error: error.message,
    });
  }
};

// Get modules list
exports.getModules = async (req, res) => {
  try {
    const [modules] = await sequelize.query(`
      SELECT DISTINCT module FROM permissions ORDER BY module ASC
    `);

    res.status(200).json({
      success: true,
      data: { modules: modules.map(m => m.module) },
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules',
      error: error.message,
    });
  }
};

