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
    const db = require('../config/database');

    // Build WHERE conditions
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(e.first_name LIKE ? OR e.last_name LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department && department !== 'all') {
      whereConditions.push('e.department_id = ?');
      params.push(department);
    }

    if (status && status !== 'all') {
      whereConditions.push('e.status = ?');
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get employees with JOINs for related names
    const [employees] = await db.query(
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
       ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    // Get total count
    const [[{total}]] = await db.query(
      `SELECT COUNT(*) as total FROM employees e ${whereClause}`,
      params
    );

    res.json({
      success: true,
      employees: employees.map(emp => ({
        id: emp.id,
        employeeId: emp.employee_id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        name: `${emp.first_name} ${emp.last_name}`,
        email: emp.email,
        phone: emp.phone,
        department: emp.department_name,
        department_name: emp.department_name,
        designation: emp.designation_name,
        designation_name: emp.designation_name,
        designationName: emp.designation_name,
        branch: emp.branch_name,
        branch_name: emp.branch_name,
        status: emp.status,
        avatar: emp.profile_photo,
      })),
      totalCount: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
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
      payment_method: employee.payment_method || 'Bank Transfer',
      
      // Personal Details
      blood_group: employee.blood_group,
      nationality: employee.nationality,
      
      // Emergency Contact
      emergency_contact_name: employee.emergency_contact_name,
      emergency_contact_phone: employee.emergency_contact_phone,
      emergency_contact_relation: employee.emergency_contact_relation,
      
      // Salary & Bank
      basic_salary: employee.basic_salary,
      bank_name: employee.bank_name,
      account_number: employee.account_number,
      routing_number: employee.routing_number,
      swift_code: employee.swift_code,
      bank_address: employee.bank_address,
      
      // Other
      photo_url: employee.profile_photo,
      user_id: employee.user_id,
      termination_date: employee.termination_date,
      termination_reason: employee.termination_reason,
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
      maritalStatus,
      bloodGroup,
      nationality,
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
      
      // Emergency Contact
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      
      // Bank Information
      bankName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress,
      
      // Salary Information
      basicSalary,
      paymentMethod,
      
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
      maritalStatus,
      bloodGroup,
      nationality,
      status: status || 'active',
      address,
      city,
      state,
      country,
      postalCode: zipCode,
      branchId: branch ? parseInt(branch) : null,
      departmentId: department ? parseInt(department) : null,
      designationId: designation ? parseInt(designation) : null,
      joiningDate,
      employmentType: employmentType || 'full_time',
      shift,
      attendancePolicy,
      managerId: reportsTo ? parseInt(reportsTo) : null,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bankName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress,
      basicSalary: basicSalary ? parseFloat(basicSalary) : 0,
      paymentMethod: paymentMethod || 'Bank Transfer',
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
    const {
      // Basic Information
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      nationality,
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
      
      // Emergency Contact
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      
      // Bank Information
      bankName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress,
      
      // Salary Information
      basicSalary,
      paymentMethod,
    } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Update employee with mapped fields
    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      email: email || employee.email,
      phone: phone || employee.phone,
      employeeId: employeeId || employee.employeeId,
      dateOfBirth: dateOfBirth || employee.dateOfBirth,
      gender: gender || employee.gender,
      maritalStatus: maritalStatus || employee.maritalStatus,
      bloodGroup: bloodGroup || employee.bloodGroup,
      nationality: nationality || employee.nationality,
      status: status || employee.status,
      address: address || employee.address,
      city: city || employee.city,
      state: state || employee.state,
      country: country || employee.country,
      postalCode: zipCode || employee.postalCode,
      branchId: branch ? parseInt(branch) : employee.branchId,
      departmentId: department ? parseInt(department) : employee.departmentId,
      designationId: designation ? parseInt(designation) : employee.designationId,
      joiningDate: joiningDate || employee.joiningDate,
      employmentType: employmentType || employee.employmentType,
      shift: shift || employee.shift,
      attendancePolicy: attendancePolicy || employee.attendancePolicy,
      managerId: reportsTo ? parseInt(reportsTo) : employee.managerId,
      emergencyContactName: emergencyContactName || employee.emergencyContactName,
      emergencyContactPhone: emergencyContactPhone || employee.emergencyContactPhone,
      emergencyContactRelation: emergencyContactRelation || employee.emergencyContactRelation,
      bankName: bankName || employee.bankName,
      accountNumber: accountNumber || employee.accountNumber,
      routingNumber: routingNumber || employee.routingNumber,
      swiftCode: swiftCode || employee.swiftCode,
      bankAddress: bankAddress || employee.bankAddress,
      basicSalary: basicSalary ? parseFloat(basicSalary) : employee.basicSalary,
      paymentMethod: paymentMethod || employee.paymentMethod,
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.getFullName(),
        email: employee.email,
        status: employee.status,
      },
    });
  } catch (error) {
    console.error('Update employee error:', error);
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

