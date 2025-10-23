const Employee = require('../models/Employee');
const { Op } = require('sequelize');

// Get all employees
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      status = 'all',
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department && department !== 'all') {
      where.departmentId = department;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get employees with pagination
    const { count, rows } = await Employee.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      employees: rows.map(emp => ({
        id: emp.id,
        name: emp.getFullName(),
        employeeId: emp.employeeId,
        email: emp.email,
        phone: emp.phone,
        department: 'Department Name', // Will be joined later
        designation: 'Designation Name', // Will be joined later
        branch: 'Branch Name', // Will be joined later
        status: emp.status,
        avatar: emp.profilePhoto,
      })),
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Map database fields to frontend expectations
    const mappedEmployee = {
      id: employee.id,
      employeeId: employee.employeeId,
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      date_of_birth: employee.dateOfBirth,
      gender: employee.gender,
      marital_status: employee.maritalStatus,
      status: employee.status,
      
      // Address
      address: employee.address,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      postal_code: employee.postalCode,
      
      // Employment
      branch_id: employee.branchId,
      department_id: employee.departmentId,
      designation_id: employee.designationId,
      manager_id: employee.managerId,
      joining_date: employee.joiningDate,
      employment_type: employee.employmentType,
      shift: employee.shift,
      attendance_policy: employee.attendancePolicy,
      
      // Salary & Bank
      basic_salary: employee.basicSalary,
      bank_name: employee.bankName,
      account_number: employee.accountNumber,
      routing_number: employee.routingNumber,
      swift_code: employee.swiftCode,
      bank_address: employee.bankAddress,
      
      // Other
      photo_url: employee.profilePhoto,
      created_at: employee.createdAt,
      updated_at: employee.updatedAt,
    };

    res.json(mappedEmployee);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

// Create employee
exports.create = async (req, res) => {
  try {
    const {
      // Basic Information
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      dateOfBirth,
      gender,
      status,
      
      // Employment Details
      branch,
      department,
      designation,
      shift,
      employmentType,
      attendancePolicy,
      joiningDate,
      reportsTo,
      
      // Address Information
      address,
      city,
      state,
      country,
      zipCode,
      
      // Bank Information
      bankName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress,
      
      // Login Information
      temporaryPassword,
    } = req.body;

    // Check if employee ID or email already exists
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [
          { employeeId },
          { email },
        ],
      },
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID or email already exists',
      });
    }

    // Create employee record
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      status: status || 'Active',
      address,
      city,
      state,
      country,
      postalCode: zipCode,
      branchId: branch ? parseInt(branch) : null,
      departmentId: department ? parseInt(department) : null,
      designationId: designation ? parseInt(designation) : null,
      joiningDate,
      employmentType: employmentType || 'Full Time',
      shift,
      attendancePolicy,
      managerId: reportsTo ? parseInt(reportsTo) : null,
      bankName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress,
    });

    // TODO: Create user account if temporaryPassword is provided
    // TODO: Send welcome email with credentials

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.getFullName(),
        email: employee.email,
        status: employee.status,
      },
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// Update employee
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await employee.update(employeeData);

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

// Delete employee
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await employee.destroy();

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

// Get employee statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({ where: { status: 'active' } });
    const inactiveEmployees = await Employee.count({ where: { status: 'inactive' } });

    res.json({
      success: true,
      statistics: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

