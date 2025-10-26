const Leave = require('../models/Leave');
const LeaveType = require('../models/LeaveType');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const User = require('../models/User');
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
    
    const user = req.user; // From auth middleware
    
    // If no user (not authenticated), return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const userType = user.userType || 'employee';
    const currentUserId = user.id;
    
    console.log('=== Fetching Leave Requests ===');
    console.log('User type:', userType, 'Current user ID:', currentUserId);

    const offset = (page - 1) * limit;

    // Build where clause based on user role
    const where = {};

    if (userType === 'employee') {
      // Employees can only see their own leave requests
      try {
        const employee = await Employee.findOne({ where: { user_id: currentUserId } });
        if (employee) {
          where.employeeId = employee.id;
        } else {
          // No employee record found, return empty
          return res.json({
            success: true,
            data: {
              leaves: [],
              totalCount: 0,
              currentPage: parseInt(page),
              totalPages: 0,
            },
          });
        }
      } catch (empError) {
        console.error('Error finding employee:', empError);
        return res.json({
          success: true,
          data: {
            leaves: [],
            totalCount: 0,
            currentPage: parseInt(page),
            totalPages: 0,
          },
        });
      }
    } else if (userType === 'manager') {
      // Managers can see their team's leave requests (same department)
      try {
        const managerEmployee = await Employee.findOne({ where: { user_id: currentUserId } });
        if (managerEmployee) {
          const teamEmployees = await Employee.findAll({
            where: { department_id: managerEmployee.department_id },
            attributes: ['id']
          });
          const teamEmployeeIds = teamEmployees.map(emp => emp.id);
          where.employeeId = { [Op.in]: teamEmployeeIds };
        }
      } catch (empError) {
        console.error('Error finding manager team:', empError);
      }
    }
    // HR, HR Manager, and Super Admin can see all leave requests (no additional filtering)

    // Add other filters
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

    console.log('Leave requests found:', count);

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
    const userId = req.user?.id;
    
    // Look up employeeId from userId
    let employeeId = req.body.employeeId;
    if (!employeeId && userId) {
      const employee = await Employee.findOne({ where: { user_id: userId } });
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Employee profile not found for this user',
        });
      }
      employeeId = employee.id;
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required',
      });
    }

    const leave = await Leave.create({
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
    });

    // Create notification for HR/Manager
    try {
      // Get employee details
      const employee = await Employee.findByPk(employeeId);
      const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : 'An employee';
      
      // Get all HR and managers to notify
      const hrUsers = await User.findAll({
        where: {
          userType: { [Op.in]: ['hr', 'hr_manager', 'super_admin'] },
          status: 'active'
        }
      });
      
      // Create notification for each HR user
      for (const hrUser of hrUsers) {
        await Notification.create({
          userId: hrUser.id,
          type: 'leave_request',
          title: 'New Leave Request',
          description: `${employeeName} has applied for leave from ${startDate} to ${endDate} (${days} days)`,
          relatedId: leave.id,
          relatedType: 'leave',
          isRead: false,
        }, {
          fields: ['userId', 'type', 'title', 'description', 'relatedId', 'relatedType', 'isRead', 'createdAt', 'updatedAt']
        });
      }
      
      console.log(`✅ Created leave notifications for ${hrUsers.length} HR users`);
    } catch (notifError) {
      console.error('Error creating leave notification:', notifError);
      // Don't fail the request if notification fails
    }

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

    // Create notification for employee
    try {
      const employee = await Employee.findByPk(leave.employeeId);
      if (employee && employee.user_id) {
        await Notification.create({
          userId: employee.user_id,
          type: 'leave_approved',
          title: 'Leave Request Approved',
          description: `Your leave request from ${leave.startDate} to ${leave.endDate} has been approved`,
          relatedId: leave.id,
          relatedType: 'leave',
          isRead: false,
        });
        console.log('✅ Created leave approval notification for user', employee.user_id);
      }
    } catch (notifError) {
      console.error('Error creating approval notification:', notifError);
    }

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

    // Create notification for employee
    try {
      const employee = await Employee.findByPk(leave.employeeId);
      if (employee && employee.user_id) {
        await Notification.create({
          userId: employee.user_id,
          type: 'leave_rejected',
          title: 'Leave Request Rejected',
          description: `Your leave request from ${leave.startDate} to ${leave.endDate} has been rejected`,
          relatedId: leave.id,
          relatedType: 'leave',
          isRead: false,
        });
        console.log('✅ Created leave rejection notification for user', employee.user_id);
      }
    } catch (notifError) {
      console.error('Error creating rejection notification:', notifError);
    }

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
