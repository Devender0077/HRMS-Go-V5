const Payroll = require('../models/Payroll');
const SalaryComponent = require('../models/SalaryComponent');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

// Get all payroll records
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      month,
      year,
      employeeId,
      status,
    } = req.query;
    
    const user = req.user; // From auth middleware
    const userType = user?.userType || 'employee';
    const currentUserId = user?.id;
    
    console.log('=== Fetching Payroll Records ===');
    console.log('User type:', userType, 'Current user ID:', currentUserId);

    const offset = (page - 1) * limit;

    // Build where clause based on user role
    const where = {};

    if (userType === 'employee') {
      // Employees can only see their own payroll records
      const employee = await Employee.findOne({ where: { user_id: currentUserId } });
      if (employee) {
        where.employeeId = employee.id;
      } else {
        // No employee record found, return empty
        return res.json({
          success: true,
          data: {
            payrolls: [],
            totalCount: 0,
            currentPage: parseInt(page),
            totalPages: 0,
          },
        });
      }
    } else if (userType === 'manager') {
      // Managers can see their team's payroll records (same department)
      const managerEmployee = await Employee.findOne({ where: { user_id: currentUserId } });
      if (managerEmployee) {
        const teamEmployees = await Employee.findAll({
          where: { department_id: managerEmployee.department_id },
          attributes: ['id']
        });
        const teamEmployeeIds = teamEmployees.map(emp => emp.id);
        where.employeeId = { [Op.in]: teamEmployeeIds };
      }
    }
    // HR, HR Manager, and Super Admin can see all payroll records (no additional filtering)

    // Add other filters
    if (month) {
      where.month = month;
    }

    if (year) {
      where.year = year;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get payroll records with pagination
    const { count, rows } = await Payroll.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['year', 'DESC'], ['month', 'DESC']],
    });

    console.log('Payroll records found:', count);

    res.json({
      success: true,
      data: {
        payrolls: rows,
        totalCount: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll records',
      error: error.message,
    });
  }
};

// Get by ID
exports.getById = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    res.json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll record',
      error: error.message,
    });
  }
};

// Create payroll
exports.create = async (req, res) => {
  try {
    const payroll = await Payroll.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Payroll record created successfully',
      data: payroll,
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payroll record',
      error: error.message,
    });
  }
};

// Update payroll
exports.update = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    await payroll.update(req.body);
    
    res.json({
      success: true,
      message: 'Payroll record updated successfully',
      data: payroll,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payroll record',
      error: error.message,
    });
  }
};

// Delete payroll
exports.delete = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    await payroll.destroy();
    
    res.json({
      success: true,
      message: 'Payroll record deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payroll record',
      error: error.message,
    });
  }
};

// Get payroll runs (special endpoint)
exports.getRuns = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      order: [['created_at', 'DESC']],
      limit: 100,
    });

    res.json({
      success: true,
      runs: payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll runs',
      error: error.message,
    });
  }
};

// Create payroll run (special endpoint)
exports.createRun = async (req, res) => {
  try {
    const { title, payPeriodStart, payPeriodEnd, payDate, month, year } = req.body;

    const payroll = await Payroll.create({
      employeeId: req.body.employeeId || 1, // Default or get from context
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      message: 'Payroll run created successfully',
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payroll run',
      error: error.message,
    });
  }
};

// Process payroll (special endpoint)
exports.processPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found',
      });
    }

    await payroll.update({ status: 'approved' });
    
    res.json({
      success: true,
      message: `Payroll ${req.params.id} processed successfully`,
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process payroll',
      error: error.message,
    });
  }
};

// Get payslips (special endpoint)
exports.getPayslips = async (req, res) => {
  try {
    const employeeId = req.query.employeeId || req.user?.id || 1;

    const payslips = await Payroll.findAll({
      where: { employeeId },
      order: [['created_at', 'DESC']],
      limit: 100,
    });

    res.json({
      success: true,
      payslips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payslips',
      error: error.message,
    });
  }
};

// Get salary components (special endpoint)
exports.getComponents = async (req, res) => {
  try {
    const components = await SalaryComponent.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      components,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch salary components',
      error: error.message,
    });
  }
};
