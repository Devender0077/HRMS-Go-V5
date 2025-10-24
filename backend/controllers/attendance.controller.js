const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

/** =========================
 * Helper: DB status -> UI code
 * ========================= */
const mapStatusToCode = (s = '') => {
  switch (s.toLowerCase()) {
    case 'present': return 'P';
    case 'absent': return 'A';
    case 'half_day': return 'HD';
    case 'weekly_off': return 'WD';
    case 'leave': return 'L';
    case 'holiday': return 'H';
    case 'late': return 'LT';
    case 'early_out': return 'EO';
    case 'overtime': return 'OT';
    default: return '-';
  }
};

/** =========================
 * NEW: Calendar view (month-by-date)
 * GET /api/attendance/calendar?year=2025&month=10&department=all
 * ========================= */
// === REPLACE your getCalendar with this flexible version ===
exports.getCalendar = async (req, res) => {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const departmentFilter = (req.query.department || 'all').toLowerCase();

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ success: false, message: 'Valid year and month are required' });
    }

    // Month bounds (UTC)
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // --- Introspect Employee model fields ---
    const fields = Object.keys(Employee.rawAttributes || {}).reduce((acc, k) => {
      acc[k.toLowerCase()] = k; // map lower->actual
      return acc;
    }, {});

    // Helpers to pick existing columns by priority
    const pick = (...candidates) => {
      for (const c of candidates) {
        const actual = fields[c.toLowerCase()];
        if (actual) return actual;
      }
      return null;
    };

    const nameField =
      pick('name') ||
      (pick('first_name') && pick('last_name')) || // handled later as pair
      pick('full_name', 'fullname', 'employee_name', 'display_name', 'fullName');

    const firstNameField = pick('first_name', 'firstname', 'firstName');
    const lastNameField  = pick('last_name', 'lastname', 'lastName');

    const empCodeField = pick('emp_code', 'employee_code', 'empcode', 'employeeCode', 'code');
    const deptField    = pick('department', 'dept', 'dept_name', 'department_name', 'departmentName', 'department_id');

    // Build where for employees (only if department column exists and filter != all)
    const empWhere = {};
    if (deptField && departmentFilter !== 'all') {
      // MySQL is case-insensitive by default; this will match fine on typical collations
      empWhere[deptField] = { [Op.like]: departmentFilter };
    }

    // Select: always include id; include whatever name/code/department fields exist
    const empAttributes = ['id'];
    if (nameField && typeof nameField === 'string') empAttributes.push(nameField);
    if (firstNameField) empAttributes.push(firstNameField);
    if (lastNameField)  empAttributes.push(lastNameField);
    if (empCodeField)   empAttributes.push(empCodeField);
    if (deptField)      empAttributes.push(deptField);

    const employees = await Employee.findAll({
      where: empWhere,
      attributes: [...new Set(empAttributes)], // dedupe
      order: nameField ? [[nameField, 'ASC']] : [['id', 'ASC']],
      raw: true,
    });

    if (!employees.length) {
      return res.json({ success: true, data: [] });
    }

    const empIds = employees.map(e => e.id);

    // Attendance for month
    const rows = await Attendance.findAll({
      where: {
        employeeId: { [Op.in]: empIds },
        date: { [Op.between]: [start, end] },
      },
      attributes: ['employeeId', 'date', 'status'],
      order: [['date', 'ASC']],
      raw: true,
    });

    // Build employeeId -> { 'YYYY-MM-DD': 'P' }
    const byEmployee = new Map();
    for (const r of rows) {
      const iso = new Date(r.date).toISOString().slice(0, 10);
      const code = mapStatusToCode(r.status);
      if (!byEmployee.has(r.employeeId)) byEmployee.set(r.employeeId, {});
      byEmployee.get(r.employeeId)[iso] = code;
    }

    // Normalize employees into payload
    const payload = employees.map((e) => {
      // Name resolution
      let name = null;
      if (nameField && e[nameField] != null) {
        name = String(e[nameField]).trim();
      } else if (firstNameField || lastNameField) {
        const first = firstNameField ? (e[firstNameField] || '').toString().trim() : '';
        const last  = lastNameField  ? (e[lastNameField]  || '').toString().trim() : '';
        name = `${first} ${last}`.trim();
      }
      if (!name) name = `Employee ${e.id}`;

      // Emp code/id shown in UI
      const empId = empCodeField ? (e[empCodeField] || `EMP${e.id}`) : `EMP${e.id}`;

      // Department label
      const department =
        deptField ? (e[deptField] != null ? String(e[deptField]) : '') : '';

      return {
        id: e.id,
        name,
        empId,
        department,
        attendanceByDate: byEmployee.get(e.id) || {},
      };
    });

    return res.json({ success: true, data: payload });
  } catch (error) {
    console.error('getCalendar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to build attendance calendar',
      error: error.message,
    });
  }
};

/** =========================
 * EXISTING ENDPOINTS (unchanged)
 * ========================= */

// Clock in
exports.clockIn = async (req, res) => {
  try {
    const { employeeId, ip, location, latitude, longitude, deviceInfo } = req.body;
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if already clocked in today
    const existingRecord = await Attendance.findOne({
      where: {
        employeeId,
        date: today,
      },
    });

    if (existingRecord && existingRecord.clockIn) {
      return res.status(400).json({
        success: false,
        message: 'Already clocked in today',
      });
    }

    // Create or update attendance record
    const attendance = existingRecord
      ? await existingRecord.update({
          clockIn: now,
          clockInIp: ip,
          clockInLocation: location,
          clockInLatitude: latitude,
          clockInLongitude: longitude,
          deviceInfo,
          status: 'present',
        })
      : await Attendance.create({
          employeeId,
          date: today,
          clockIn: now,
          clockInIp: ip,
          clockInLocation: location,
          clockInLatitude: latitude,
          clockInLongitude: longitude,
          deviceInfo,
          status: 'present',
        });

    res.json({
      success: true,
      message: 'Clocked in successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clock in',
      error: error.message,
    });
  }
};

// Clock out
exports.clockOut = async (req, res) => {
  try {
    const { employeeId, ip, location, latitude, longitude } = req.body;
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      where: {
        employeeId,
        date: today,
      },
    });

    if (!attendance || !attendance.clockIn) {
      return res.status(400).json({
        success: false,
        message: 'No clock-in record found for today',
      });
    }

    if (attendance.clockOut) {
      return res.status(400).json({
        success: false,
        message: 'Already clocked out today',
      });
    }

    // Calculate total hours
    const clockInTime = new Date(attendance.clockIn);
    const totalHours = ((now - clockInTime) / (1000 * 60 * 60)).toFixed(2);

    // Update attendance record
    await attendance.update({
      clockOut: now,
      clockOutIp: ip,
      clockOutLocation: location,
      clockOutLatitude: latitude,
      clockOutLongitude: longitude,
      totalHours,
    });

    res.json({
      success: true,
      message: 'Clocked out successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clock out',
      error: error.message,
    });
  }
};

// Get attendance records (paginated/filterable)
exports.getRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      employeeId,
      status,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: endDate,
      };
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get attendance records with pagination
    const { count, rows } = await Attendance.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['date', 'DESC'], ['clockIn', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        attendance: rows,
        totalCount: count,
        currentPage: pageNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message,
    });
  }
};

// Get today's attendance record
exports.getTodayRecord = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      where: {
        employeeId,
        date: today,
      },
    });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get today record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s record',
      error: error.message,
    });
  }
};

// Request regularization
exports.requestRegularization = async (req, res) => {
  try {
    const { employeeId, date, reason, clockIn, clockOut } = req.body;

    // Check if attendance record exists
    let attendance = await Attendance.findOne({
      where: {
        employeeId,
        date,
      },
    });

    if (!attendance) {
      // Create new attendance record for regularization
      attendance = await Attendance.create({
        employeeId,
        date,
        clockIn,
        clockOut,
        status: 'present',
        notes: `Regularization requested: ${reason}`,
      });
    } else {
      // Update existing record
      await attendance.update({
        clockIn: clockIn || attendance.clockIn,
        clockOut: clockOut || attendance.clockOut,
        notes: `Regularization requested: ${reason}`,
      });
    }

    res.json({
      success: true,
      message: 'Regularization request submitted successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Regularization request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit regularization request',
      error: error.message,
    });
  }
};

// Get all attendance (for general listing)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Attendance.findAndCountAll({
      limit: limitNum,
      offset,
      order: [['date', 'DESC'], ['clockIn', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        attendance: rows,
        totalCount: count,
        currentPage: pageNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message,
    });
  }
};

// Get by ID
exports.getById = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance record',
      error: error.message,
    });
  }
};

// Create
exports.create = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create attendance record',
      error: error.message,
    });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    await attendance.update(req.body);
    
    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance record',
      error: error.message,
    });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    await attendance.destroy();
    
    res.json({
      success: true,
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance record',
      error: error.message,
    });
  }
};

// ===================== REGULARIZATION CRUD =====================

// Get all regularization requests
exports.getRegularizations = async (req, res) => {
  try {
    const { userId, status } = req.query;
    
    let whereClause = {};
    if (userId) whereClause.user_id = userId;
    if (status) whereClause.status = status;

    const AttendanceRegularization = require('../models/AttendanceRegularization');
    const Employee = require('../models/Employee');

    const regularizations = await AttendanceRegularization.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          attributes: ['id', 'employee_id', 'first_name', 'last_name', 'department_id'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Format the response
    const formattedRegularizations = regularizations.map(reg => ({
      id: reg.id,
      employee_id: reg.Employee?.employee_id || 'N/A',
      employee_name: reg.Employee ? `${reg.Employee.first_name} ${reg.Employee.last_name}` : 'Unknown',
      date: reg.date,
      requested_in: reg.requested_in_time,
      requested_out: reg.requested_out_time,
      actual_in: reg.actual_in_time,
      actual_out: reg.actual_out_time,
      reason: reg.reason,
      status: reg.status,
      approved_by: reg.approved_by,
      approved_at: reg.approved_at,
      created_at: reg.created_at
    }));

    res.json({
      success: true,
      data: formattedRegularizations
    });
  } catch (error) {
    console.error('Get regularizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regularization requests',
      error: error.message
    });
  }
};

// Create regularization request
exports.createRegularization = async (req, res) => {
  try {
    const { userId, date, requested_in_time, requested_out_time, reason } = req.body;

    if (!userId || !date || !reason) {
      return res.status(400).json({
        success: false,
        message: 'User ID, date, and reason are required'
      });
    }

    // Get employee_id from user_id
    const Employee = require('../models/Employee');
    const employee = await Employee.findOne({ where: { user_id: userId } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found for this user'
      });
    }

    const AttendanceRegularization = require('../models/AttendanceRegularization');

    const regularization = await AttendanceRegularization.create({
      employee_id: employee.id,
      user_id: userId,
      date,
      requested_in_time,
      requested_out_time,
      reason,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Regularization request created successfully',
      data: regularization
    });
  } catch (error) {
    console.error('Create regularization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create regularization request',
      error: error.message
    });
  }
};

// Update regularization request
exports.updateRegularization = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, requested_in_time, requested_out_time, reason } = req.body;

    const AttendanceRegularization = require('../models/AttendanceRegularization');

    const regularization = await AttendanceRegularization.findByPk(id);

    if (!regularization) {
      return res.status(404).json({
        success: false,
        message: 'Regularization request not found'
      });
    }

    if (regularization.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a regularization that has been approved/rejected'
      });
    }

    await regularization.update({
      date: date || regularization.date,
      requested_in_time: requested_in_time || regularization.requested_in_time,
      requested_out_time: requested_out_time || regularization.requested_out_time,
      reason: reason || regularization.reason
    });

    res.json({
      success: true,
      message: 'Regularization request updated successfully',
      data: regularization
    });
  } catch (error) {
    console.error('Update regularization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update regularization request',
      error: error.message
    });
  }
};

// Approve regularization request
exports.approveRegularization = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const AttendanceRegularization = require('../models/AttendanceRegularization');

    const regularization = await AttendanceRegularization.findByPk(id);

    if (!regularization) {
      return res.status(404).json({
        success: false,
        message: 'Regularization request not found'
      });
    }

    await regularization.update({
      status: 'approved',
      approved_by: approved_by || 'Admin',
      approved_at: new Date()
    });

    // Update the actual attendance record
    const Attendance = require('../models/Attendance');
    const attendance = await Attendance.findOne({
      where: {
        employee_id: regularization.employee_id,
        date: regularization.date
      }
    });

    if (attendance) {
      await attendance.update({
        check_in: regularization.requested_in_time,
        check_out: regularization.requested_out_time,
        status: 'present'
      });
    }

    res.json({
      success: true,
      message: 'Regularization request approved successfully',
      data: regularization
    });
  } catch (error) {
    console.error('Approve regularization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve regularization request',
      error: error.message
    });
  }
};

// Reject regularization request
exports.rejectRegularization = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejected_by, rejection_reason } = req.body;

    const AttendanceRegularization = require('../models/AttendanceRegularization');

    const regularization = await AttendanceRegularization.findByPk(id);

    if (!regularization) {
      return res.status(404).json({
        success: false,
        message: 'Regularization request not found'
      });
    }

    await regularization.update({
      status: 'rejected',
      approved_by: rejected_by || 'Admin',
      approved_at: new Date(),
      rejection_reason: rejection_reason || 'No reason provided'
    });

    res.json({
      success: true,
      message: 'Regularization request rejected successfully',
      data: regularization
    });
  } catch (error) {
    console.error('Reject regularization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject regularization request',
      error: error.message
    });
  }
};

// Delete regularization request
exports.deleteRegularization = async (req, res) => {
  try {
    const { id } = req.params;

    const AttendanceRegularization = require('../models/AttendanceRegularization');

    const regularization = await AttendanceRegularization.findByPk(id);

    if (!regularization) {
      return res.status(404).json({
        success: false,
        message: 'Regularization request not found'
      });
    }

    await regularization.destroy();

    res.json({
      success: true,
      message: 'Regularization request deleted successfully'
    });
  } catch (error) {
    console.error('Delete regularization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete regularization request',
      error: error.message
    });
  }
};