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
    const userId = req.user?.id;
    const year = req.query.year || new Date().getFullYear();

    console.log('🔄 [Leave Balances] Fetching for userId:', userId, 'year:', year);

    // Get employee from userId
    const employee = await Employee.findOne({ where: { user_id: userId } });
    
    if (!employee) {
      console.log('❌ [Leave Balances] No employee profile found for user:', userId);
      return res.json({
        success: true,
        balances: [],
        year,
      });
    }

    const employeeId = employee.id;
    console.log('✅ [Leave Balances] Found employee ID:', employeeId);

    // Get all active leave types
    const leaveTypes = await LeaveType.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']],
    });

    console.log(`📊 [Leave Balances] Found ${leaveTypes.length} active leave types`);

    // Calculate balances for each leave type
    const balances = await Promise.all(leaveTypes.map(async (leaveType) => {
      // Get approved leaves for this employee and leave type in current year
      const approvedLeaves = await Leave.findAll({
        where: {
          employeeId,
          leaveTypeId: leaveType.id,
          status: 'approved',
          [Op.and]: [
            { startDate: { [Op.gte]: `${year}-01-01` } },
            { startDate: { [Op.lte]: `${year}-12-31` } },
          ],
        },
      });

      const used = approvedLeaves.reduce((sum, leave) => sum + parseFloat(leave.days || 0), 0);

      // Get pending leaves
      const pendingLeaves = await Leave.findAll({
        where: {
          employeeId,
          leaveTypeId: leaveType.id,
          status: 'pending',
          [Op.and]: [
            { startDate: { [Op.gte]: `${year}-01-01` } },
            { startDate: { [Op.lte]: `${year}-12-31` } },
          ],
        },
      });

      const pending = pendingLeaves.reduce((sum, leave) => sum + parseFloat(leave.days || 0), 0);

      const allocated = parseFloat(leaveType.days_per_year || leaveType.daysPerYear || 0);
      const remaining = allocated - used;

      return {
        id: leaveType.id,
        leaveType: leaveType.name,
        leave_type_name: leaveType.name,
        allocated,
        used,
        pending,
        remaining,
        icon: getLeaveTypeIcon(leaveType.name),
        color: getLeaveTypeColor(leaveType.name),
      };
    }));

    console.log('✅ [Leave Balances] Calculated balances:', balances);

    res.json({
      success: true,
      balances,
      year,
    });
  } catch (error) {
    console.error('❌ [Leave Balances] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balances',
      error: error.message,
    });
  }
};

// Helper function to get icon for leave type
function getLeaveTypeIcon(name) {
  const nameLC = name.toLowerCase();
  if (nameLC.includes('annual')) return 'eva:calendar-fill';
  if (nameLC.includes('sick')) return 'eva:heart-fill';
  if (nameLC.includes('casual')) return 'eva:umbrella-fill';
  if (nameLC.includes('maternity')) return 'eva:person-add-fill';
  if (nameLC.includes('paternity')) return 'eva:people-fill';
  return 'eva:file-text-fill';
}

// Helper function to get color for leave type
function getLeaveTypeColor(name) {
  const nameLC = name.toLowerCase();
  if (nameLC.includes('annual')) return 'primary';
  if (nameLC.includes('sick')) return 'error';
  if (nameLC.includes('casual')) return 'info';
  if (nameLC.includes('maternity')) return 'success';
  if (nameLC.includes('paternity')) return 'warning';
  return 'default';
}

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

// Create new leave type (organization-wide)
exports.createLeaveType = async (req, res) => {
  try {
    const { name, description, days_per_year, carry_forward, max_carry_forward, type, status } = req.body;
    
    console.log('➕ [Leave Types] Creating new leave type:', name);
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Leave type name is required',
      });
    }
    
    // Check if leave type with same name already exists
    const existing = await LeaveType.findOne({
      where: { name: name.trim() },
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Leave type "${name}" already exists`,
      });
    }
    
    // Create the leave type (this will be available to ALL employees)
    const leaveType = await LeaveType.create({
      name: name.trim(),
      description: description || '',
      days_per_year: days_per_year || 0,
      carry_forward: carry_forward || false,
      max_carry_forward: max_carry_forward || 0,
      type: type || 'paid',
      status: status || 'active',
    });
    
    console.log(`✅ [Leave Types] Created "${leaveType.name}" - ${days_per_year} days/year (available to ALL employees)`);
    
    res.json({
      success: true,
      message: `Leave type "${name}" created successfully - All employees will now have ${days_per_year} days per year`,
      leaveType,
    });
  } catch (error) {
    console.error('❌ [Leave Types] Create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create leave type',
      error: error.message,
    });
  }
};

// Update leave type (organization-wide default)
exports.updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const { days_per_year, carry_forward, max_carry_forward } = req.body;
    
    console.log('📝 [Leave Types] Updating leave type:', id, req.body);
    
    // Find the leave type
    const leaveType = await LeaveType.findByPk(id);
    
    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found',
      });
    }
    
    // Update the leave type (this affects ALL employees organization-wide)
    await leaveType.update({
      days_per_year: days_per_year || leaveType.days_per_year,
      carry_forward: carry_forward !== undefined ? carry_forward : leaveType.carry_forward,
      max_carry_forward: max_carry_forward !== undefined ? max_carry_forward : leaveType.max_carry_forward,
    });
    
    console.log(`✅ [Leave Types] Updated "${leaveType.name}" - ${days_per_year} days/year (applies to ALL employees)`);
    
    res.json({
      success: true,
      message: `Leave type updated successfully - All employees will now have ${days_per_year} ${leaveType.name} days per year`,
      leaveType,
    });
  } catch (error) {
    console.error('❌ [Leave Types] Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave type',
      error: error.message,
    });
  }
};

// Delete leave type (removes from all employees)
exports.deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ [Leave Types] Deleting leave type:', id);
    
    // Find the leave type
    const leaveType = await LeaveType.findByPk(id);
    
    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: 'Leave type not found',
      });
    }
    
    const leaveTypeName = leaveType.name;
    
    // Delete the leave type (cascade will handle leave_balances)
    await leaveType.destroy();
    
    console.log(`✅ [Leave Types] Deleted "${leaveTypeName}" - Removed from all employees`);
    
    res.json({
      success: true,
      message: `Leave type "${leaveTypeName}" deleted successfully - Removed from all employees`,
    });
  } catch (error) {
    console.error('❌ [Leave Types] Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete leave type',
      error: error.message,
    });
  }
};
