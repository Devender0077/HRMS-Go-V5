const Department = require('../models/Department');

// Get all departments
exports.getAll = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
};

// Get department by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { department },
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message,
    });
  }
};

// Create department
exports.create = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    // Check if code already exists
    if (code) {
      const existing = await Department.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Department code already exists',
        });
      }
    }

    const department = await Department.create({
      name,
      code,
      description,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message,
    });
  }
};

// Update department
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, status } = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Check if code already exists (excluding current department)
    if (code && code !== department.code) {
      const existing = await Department.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Department code already exists',
        });
      }
    }

    await department.update({
      name,
      code,
      description,
      status,
    });

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: { department },
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message,
    });
  }
};

// Delete department
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    await department.destroy();

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message,
    });
  }
};

