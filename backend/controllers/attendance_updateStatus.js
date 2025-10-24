// Temporary file - content to be added to attendance.controller.js

// Update attendance status for a specific employee and date
exports.updateStatus = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, date, and status are required',
      });
    }

    // Map status codes to database status values
    const statusMap = {
      P: 'present',
      A: 'absent',
      HD: 'half_day',
      L: 'on_leave',
      LT: 'late',
      WD: 'weekly_off',
      H: 'holiday',
      EO: 'early_out',
      OT: 'overtime',
    };

    const dbStatus = statusMap[status] || 'present';

    // Find existing attendance record for this employee and date
    const [attendance, created] = await Attendance.findOrCreate({
      where: {
        employeeId,
        date,
      },
      defaults: {
        employeeId,
        date,
        status: dbStatus,
        clockIn: null,
        clockOut: null,
        totalHours: '0.00',
      },
    });

    // If record already exists, update it
    if (!created) {
      await attendance.update({ status: dbStatus });
    }

    res.json({
      success: true,
      message: 'Attendance status updated successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance status',
      error: error.message,
    });
  }
};
