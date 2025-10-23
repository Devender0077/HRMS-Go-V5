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
    const db = require('../config/database');

    // Fetch employee with related data using SQL JOIN
    const [[employee]] = await db.query(
      `SELECT 
        e.*,
        d.name as department_name,
        des.name as designation_name,
        b.name as branch_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN designations des ON e.designation_id = des.id
       LEFT JOIN branches b ON e.branch_id = b.id
       LEFT JOIN employees m ON e.manager_id = m.id
       WHERE e.id = ?`,
      [id]
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Map database fields to frontend expectations (snake_case for consistency)
    const mappedEmployee = {
      id: employee.id,
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      date_of_birth: employee.date_of_birth,
      gender: employee.gender,
      marital_status: employee.marital_status,
      status: employee.status,
      
      // Address
      address: employee.address,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      postal_code: employee.postal_code,
      
      // Employment (with names from JOINs)
      branch_id: employee.branch_id,
      branch_name: employee.branch_name,
      department_id: employee.department_id,
      department_name: employee.department_name,
      designation_id: employee.designation_id,
      designation_name: employee.designation_name,
      manager_id: employee.manager_id,
      manager_name: employee.manager_name,
      joining_date: employee.joining_date,
      employment_type: employee.employment_type,
      shift: employee.shift,
      attendance_policy: employee.attendance_policy,
      payment_method: employee.payment_method || 'N/A',
      
      // Salary & Bank
      basic_salary: employee.basic_salary,
      bank_name: employee.bank_name,
      account_number: employee.account_number,
      routing_number: employee.routing_number,
      swift_code: employee.swift_code,
      bank_address: employee.bank_address,
      
      // Other
      photo_url: employee.profile_photo,
      created_at: employee.created_at,
      updated_at: employee.updated_at,
    };

    res.json(mappedEmployee);
  } catch (error) {
    console.error('Get employee by ID error:', error);
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

