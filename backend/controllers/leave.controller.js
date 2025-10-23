const Leave = require('../models/Leave');
const LeaveType = require('../models/LeaveType');
const { Op } = require('sequelize');

// Get all leave requests
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      employeeId,
      leaveTypeId,
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (leaveTypeId) {
      where.leaveTypeId = leaveTypeId;
    }

    // Get leave requests with pagination
    const { count, rows } = await Leave.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        leaves: rows,
        totalCount: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message,
    });
  }
};

// Get leave applications (alias for getAll with additional filters)
exports.getApplications = async (req, res) => {
  try {
    const { status, type, employeeId } = req.query;

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (type) {
      where.leaveTypeId = type;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const leaves = await Leave.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 100,
    });

    res.json({
      success: true,
      applications: leaves,
      pendingCount: leaves.filter(app => app.status === 'pending').length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

// Get by ID
exports.getById = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    res.json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave request',
      error: error.message,
    });
  }
};

// Create leave request (Apply for leave)
exports.create = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Leave request created successfully',
      data: leave,
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create leave request',
      error: error.message,
    });
  }
};

// Apply for leave (alias for create)
exports.applyLeave = async (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, days, reason } = req.body;
    const employeeId = req.user?.id || req.body.employeeId;

    const leave = await Leave.create({
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to apply leave',
      error: error.message,
    });
  }
};

// Update leave request
exports.update = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    await leave.update(req.body);
    
    res.json({
      success: true,
      message: 'Leave request updated successfully',
      data: leave,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave request',
      error: error.message,
    });
  }
};

// Delete leave request
exports.delete = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    await leave.destroy();
    
    res.json({
      success: true,
      message: 'Leave request deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete leave request',
      error: error.message,
    });
  }
};

// Approve leave
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const approverId = req.user?.id || req.body.approvedBy;

    const leave = await Leave.findByPk(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    await leave.update({
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Leave approved successfully',
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve leave',
      error: error.message,
    });
  }
};

// Reject leave
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const approverId = req.user?.id || req.body.approvedBy;

    const leave = await Leave.findByPk(id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    await leave.update({
      status: 'rejected',
      approvedBy: approverId,
      approvedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Leave rejected successfully',
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject leave',
      error: error.message,
    });
  }
};

// Get leave balances
exports.getBalances = async (req, res) => {
  try {
    const employeeId = req.query.employeeId || req.user?.id;
    const year = req.query.year || new Date().getFullYear();

    // For now, return empty array since leave_balances table might not exist
    // This should be implemented based on actual table structure
    res.json({
      success: true,
      balances: [],
      year,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balances',
      error: error.message,
    });
  }
};

// Get leave types
exports.getTypes = async (req, res) => {
  try {
    const types = await LeaveType.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      types,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave types',
      error: error.message,
    });
  }
};
