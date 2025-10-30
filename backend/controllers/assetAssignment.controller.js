const AssetAssignment = require('../models/AssetAssignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

// Get all asset assignments
exports.getAll = async (req, res) => {
  try {
    const { status, employee_id, asset_id } = req.query;
    const where = {};

    if (status) where.status = status;
    if (employee_id) where.employee_id = employee_id;
    if (asset_id) where.asset_id = asset_id;

    const assignments = await AssetAssignment.findAll({
      where,
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: ['id', 'asset_code', 'asset_name'],
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
      ],
      order: [['assigned_date', 'DESC']],
    });

    console.log(`✅ Found ${assignments.length} asset assignments`);

    res.status(200).json({
      success: true,
      data: assignments, // Return array directly
    });
  } catch (error) {
    console.error('Get asset assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset assignments',
      error: error.message,
    });
  }
};

// Get assignment by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await AssetAssignment.findByPk(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Asset assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { assignment },
    });
  } catch (error) {
    console.error('Get asset assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset assignment',
      error: error.message,
    });
  }
};

// Create asset assignment
exports.create = async (req, res) => {
  try {
    console.log('➕ Creating asset assignment:', req.body);

    const {
      asset_id,
      employee_id,
      assigned_date,
      expected_return_date,
      condition_at_assignment,
      assignment_notes,
      status,
    } = req.body;

    // Validate required fields
    if (!asset_id) {
      return res.status(400).json({
        success: false,
        message: 'Asset is required',
      });
    }

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: 'Employee is required',
      });
    }

    if (!assigned_date) {
      return res.status(400).json({
        success: false,
        message: 'Assigned date is required',
      });
    }

    // Check if asset exists
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    // Check if employee exists
    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if asset is already assigned (only for active status)
    if (status === 'active' || !status) {
      const existingAssignment = await AssetAssignment.findOne({
        where: {
          asset_id,
          status: 'active',
        },
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Asset is already assigned',
        });
      }
    }

    const assignment = await AssetAssignment.create({
      asset_id,
      employee_id,
      assigned_by: req.user?.id || 1,
      assigned_date,
      expected_return_date,
      condition_at_assignment: condition_at_assignment || 'good',
      assignment_notes,
      status: status || 'active',
    });

    // Update asset status to assigned (only if status is active)
    if (status === 'active' || !status) {
      await asset.update({ current_status: 'assigned' });
    }

    console.log('✅ Asset assignment created:', assignment.id);

    res.status(201).json({
      success: true,
      message: 'Asset assigned successfully',
      data: { assignment },
    });
  } catch (error) {
    console.error('❌ Create asset assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning asset',
      error: error.message,
    });
  }
};

// Return asset (update assignment)
exports.returnAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_return_date, condition_at_return, return_notes } = req.body;

    const assignment = await AssetAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Asset assignment not found',
      });
    }

    if (assignment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Asset is not currently assigned',
      });
    }

    await assignment.update({
      actual_return_date,
      condition_at_return,
      return_notes,
      status: 'returned',
    });

    // Update asset status to available
    const asset = await Asset.findByPk(assignment.asset_id);
    if (asset) {
      await asset.update({
        current_status: 'available',
        condition: condition_at_return || asset.condition,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset returned successfully',
      data: { assignment },
    });
  } catch (error) {
    console.error('Return asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error returning asset',
      error: error.message,
    });
  }
};

// Transfer asset to another employee
exports.transfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_employee_id, transfer_date, transfer_notes } = req.body;

    const currentAssignment = await AssetAssignment.findByPk(id);
    if (!currentAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Asset assignment not found',
      });
    }

    if (currentAssignment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Asset is not currently assigned',
      });
    }

    // Mark current assignment as returned
    await currentAssignment.update({
      actual_return_date: transfer_date,
      return_notes: transfer_notes || 'Transferred to another employee',
      status: 'returned',
    });

    // Create new assignment
    const newAssignment = await AssetAssignment.create({
      asset_id: currentAssignment.asset_id,
      employee_id: new_employee_id,
      assigned_by: req.user?.id || 1,
      assigned_date: transfer_date,
      condition_at_assignment: currentAssignment.condition_at_assignment,
      assignment_notes: `Transferred from previous employee. ${transfer_notes || ''}`,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      message: 'Asset transferred successfully',
      data: { assignment: newAssignment },
    });
  } catch (error) {
    console.error('Transfer asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error transferring asset',
      error: error.message,
    });
  }
};

// Delete assignment
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await AssetAssignment.findByPk(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Asset assignment not found',
      });
    }

    // If assignment is active, update asset status to available
    if (assignment.status === 'active') {
      const asset = await Asset.findByPk(assignment.asset_id);
      if (asset) {
        await asset.update({ current_status: 'available' });
      }
    }

    await assignment.destroy();

    res.status(200).json({
      success: true,
      message: 'Asset assignment deleted successfully',
    });
  } catch (error) {
    console.error('Delete asset assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset assignment',
      error: error.message,
    });
  }
};

