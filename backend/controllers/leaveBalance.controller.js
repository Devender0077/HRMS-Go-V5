const db = require('../config/database');

// Get leave balance for an employee
exports.getEmployeeLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const [balances] = await db.execute(
      `SELECT 
        lt.id as leave_type_id,
        lt.name as leave_type,
        lt.days_per_year as allocated,
        lt.carry_forward,
        lt.max_carry_forward,
        COALESCE(SUM(CASE 
          WHEN lr.status = 'approved' 
          AND YEAR(lr.start_date) = ? 
          THEN lr.days 
          ELSE 0 
        END), 0) as used,
        COALESCE(SUM(CASE 
          WHEN lr.status = 'pending'
          AND YEAR(lr.start_date) = ? 
          THEN lr.days 
          ELSE 0 
        END), 0) as pending,
        lt.days_per_year - COALESCE(SUM(CASE 
          WHEN lr.status = 'approved' 
          AND YEAR(lr.start_date) = ? 
          THEN lr.days 
          ELSE 0 
        END), 0) as remaining
      FROM leave_types lt
      CROSS JOIN employees e
      LEFT JOIN leave_requests lr ON e.id = lr.employee_id 
        AND lr.leave_type_id = lt.id
      WHERE e.id = ?
        AND lt.status = 'active'
      GROUP BY lt.id
      ORDER BY lt.name`,
      [currentYear, currentYear, currentYear, employeeId]
    );

    res.json(balances);
  } catch (error) {
    console.error('Get leave balance error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get leave history for an employee
exports.getEmployeeLeaveHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10, status, year } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ['lr.employee_id = ?'];
    let params = [employeeId];

    if (status) {
      whereConditions.push('lr.status = ?');
      params.push(status);
    }

    if (year) {
      whereConditions.push('YEAR(lr.start_date) = ?');
      params.push(year);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    const [history] = await db.execute(
      `SELECT 
        lr.*,
        lt.name as leave_type_name,
        lt.color,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        CONCAT(approver.first_name, ' ', approver.last_name) as approved_by_name
      FROM leave_requests lr
      LEFT JOIN leave_types lt ON lr.leave_type_id = lt.id
      LEFT JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN users approver ON lr.approved_by = approver.id
      ${whereClause}
      ORDER BY lr.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM leave_requests lr
       ${whereClause}`,
      params
    );

    res.json({
      history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leave history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get leave statistics for employee
exports.getEmployeeLeaveStats = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();

    const [[stats]] = await db.execute(
      `SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'approved' THEN days ELSE 0 END) as total_days_taken
      FROM leave_requests
      WHERE employee_id = ?
        AND YEAR(start_date) = ?`,
      [employeeId, currentYear]
    );

    res.json(stats);
  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;

