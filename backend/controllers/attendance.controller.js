const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

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

// Get attendance records
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

    const offset = (page - 1) * limit;

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
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['clockIn', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        attendance: rows,
        totalCount: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
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
    const offset = (page - 1) * limit;

    const { count, rows } = await Attendance.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['clockIn', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        attendance: rows,
        totalCount: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
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
