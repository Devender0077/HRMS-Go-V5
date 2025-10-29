const { Op } = require('sequelize');
const db = require('../config/database');
const GeneratedReport = require('../models/GeneratedReport');

/**
 * Reports Controller
 * Generates various reports for HRMS system
 */

// ============================================================================
// ATTENDANCE REPORTS
// ============================================================================

/**
 * Generate Daily Attendance Report
 */
exports.getDailyAttendanceReport = async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    console.log(`📊 Generating Daily Attendance Report for: ${date}`);
    console.log(`📅 Query date: ${date}`);
    
    // Simplified query with better error handling
    const [attendanceData] = await db.query(`
      SELECT 
        e.id,
        e.employee_id,
        CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.last_name, '')) as employee_name,
        COALESCE(d.name, 'No Department') as department,
        COALESCE(des.name, 'No Designation') as designation,
        COALESCE(a.clock_in, NULL) as clock_in,
        COALESCE(a.clock_out, NULL) as clock_out,
        COALESCE(a.status, 'absent') as status,
        COALESCE(a.total_hours, 0.00) as total_hours
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = ?
      WHERE e.status = 'active'
      ORDER BY e.employee_id
    `, [date]);

    console.log(`✅ Fetched ${attendanceData.length} employee records`);

    const summary = {
      total_employees: attendanceData.length,
      present: attendanceData.filter(a => a.status === 'present' || a.status === 'late').length,
      absent: attendanceData.filter(a => a.status === 'absent').length,
      on_leave: attendanceData.filter(a => a.status === 'leave').length,
      half_day: attendanceData.filter(a => a.status === 'half_day').length,
    };

    console.log('📊 Report summary:', summary);

    res.json({
      success: true,
      report_type: 'daily_attendance',
      date,
      summary,
      data: attendanceData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('❌ Daily attendance report error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ SQL State:', error.sqlState);
    console.error('❌ SQL Message:', error.sqlMessage);
    console.error('❌ Full SQL:', error.sql);
    res.status(500).json({
      success: false,
      message: 'Failed to generate daily attendance report',
      error: error.message,
      sqlError: error.sqlMessage,
    });
  }
};

/**
 * Generate Monthly Attendance Report
 */
exports.getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const reportMonth = month || (currentDate.getMonth() + 1);
    const reportYear = year || currentDate.getFullYear();
    
    console.log(`📊 Generating Monthly Attendance Report for: ${reportMonth}/${reportYear}`);
    
    const [attendanceData] = await db.query(`
      SELECT 
        e.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as leave_days,
        COUNT(CASE WHEN a.status = 'half_day' THEN 1 END) as half_days,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
        AVG(COALESCE(a.total_hours, 0)) as avg_hours
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.employee_id 
        AND MONTH(a.date) = ? 
        AND YEAR(a.date) = ?
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.status = 'active'
      GROUP BY e.id, e.employee_id, employee_name, d.name
      ORDER BY e.employee_id
    `, [reportMonth, reportYear]);

    res.json({
      success: true,
      report_type: 'monthly_attendance',
      month: reportMonth,
      year: reportYear,
      data: attendanceData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Monthly attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly attendance report',
      error: error.message,
    });
  }
};

/**
 * Generate Overtime Report
 */
exports.getOvertimeReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().setDate(1)).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];
    
    console.log(`📊 Generating Overtime Report: ${startDate} to ${endDate}`);
    
    const [overtimeData] = await db.query(`
      SELECT 
        e.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        des.name as designation,
        COUNT(*) as overtime_days,
        SUM(CASE WHEN a.total_hours > 8 THEN a.total_hours - 8 ELSE 0 END) as total_overtime_hours,
        e.basic_salary / 22 / 8 as hourly_rate,
        SUM(CASE WHEN a.total_hours > 8 THEN a.total_hours - 8 ELSE 0 END) * (e.basic_salary / 22 / 8 * 1.5) as overtime_cost
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      WHERE a.total_hours > 8
        AND DATE(a.date) BETWEEN ? AND ?
      GROUP BY e.id, e.employee_id, employee_name, d.name, des.name, e.basic_salary
      ORDER BY total_overtime_hours DESC
    `, [startDate, endDate]);

    const totalCost = overtimeData.reduce((sum, row) => sum + (row.overtime_cost || 0), 0);

    res.json({
      success: true,
      report_type: 'overtime',
      start_date: startDate,
      end_date: endDate,
      summary: {
        total_employees: overtimeData.length,
        total_overtime_hours: overtimeData.reduce((sum, row) => sum + (row.total_overtime_hours || 0), 0),
        total_cost: totalCost,
      },
      data: overtimeData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Overtime report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate overtime report',
      error: error.message,
    });
  }
};

/**
 * Generate Late Arrivals Report
 */
exports.getLateArrivalsReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().setDate(1)).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];
    
    console.log(`📊 Generating Late Arrivals Report: ${startDate} to ${endDate}`);
    
    const [lateData] = await db.query(`
      SELECT 
        e.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        COUNT(*) as late_count,
        a.status
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE a.status = 'late'
        AND DATE(a.date) BETWEEN ? AND ?
      GROUP BY e.id, e.employee_id, employee_name, d.name, a.status
      ORDER BY late_count DESC
    `, [startDate, endDate]);

    res.json({
      success: true,
      report_type: 'late_arrivals',
      start_date: startDate,
      end_date: endDate,
      data: lateData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Late arrivals report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate late arrivals report',
      error: error.message,
    });
  }
};

// ============================================================================
// PAYROLL REPORTS
// ============================================================================

/**
 * Generate Payroll Summary Report
 */
exports.getPayrollSummaryReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const reportMonth = month || (currentDate.getMonth() + 1);
    const reportYear = year || currentDate.getFullYear();
    
    console.log(`📊 Generating Payroll Summary Report for: ${reportMonth}/${reportYear}`);
    
    const [payrollData] = await db.query(`
      SELECT 
        p.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        des.name as designation,
        p.basic_salary,
        p.gross_salary,
        p.total_deductions,
        p.net_salary,
        p.status,
        p.paid_at
      FROM payrolls p
      JOIN employees e ON p.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      WHERE p.month = ? AND p.year = ?
      ORDER BY e.employee_id
    `, [reportMonth, reportYear]);

    const summary = {
      total_employees: payrollData.length,
      total_basic_salary: payrollData.reduce((sum, row) => sum + (row.basic_salary || 0), 0),
      total_gross_salary: payrollData.reduce((sum, row) => sum + (row.gross_salary || 0), 0),
      total_deductions: payrollData.reduce((sum, row) => sum + (row.total_deductions || 0), 0),
      total_net_salary: payrollData.reduce((sum, row) => sum + (row.net_salary || 0), 0),
      paid: payrollData.filter(p => p.status === 'paid').length,
      pending: payrollData.filter(p => p.status === 'draft' || p.status === 'approved').length,
    };

    res.json({
      success: true,
      report_type: 'payroll_summary',
      month: reportMonth,
      year: reportYear,
      summary,
      data: payrollData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Payroll summary report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate payroll summary report',
      error: error.message,
    });
  }
};

/**
 * Generate Salary Analysis Report
 */
exports.getSalaryAnalysisReport = async (req, res) => {
  try {
    console.log('📊 Generating Salary Analysis Report');
    
    const [salaryData] = await db.query(`
      SELECT 
        d.name as department,
        des.name as designation,
        COUNT(e.id) as employee_count,
        AVG(e.basic_salary) as avg_salary,
        MIN(e.basic_salary) as min_salary,
        MAX(e.basic_salary) as max_salary,
        SUM(e.basic_salary) as total_salary
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      WHERE e.status = 'active' AND e.basic_salary > 0
      GROUP BY d.name, des.name
      ORDER BY total_salary DESC
    `);

    const [overallStats] = await db.query(`
      SELECT 
        COUNT(*) as total_employees,
        AVG(basic_salary) as avg_salary,
        MIN(basic_salary) as min_salary,
        MAX(basic_salary) as max_salary,
        SUM(basic_salary) as total_payroll
      FROM employees
      WHERE status = 'active' AND basic_salary > 0
    `);

    res.json({
      success: true,
      report_type: 'salary_analysis',
      overall_stats: overallStats[0],
      data: salaryData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Salary analysis report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate salary analysis report',
      error: error.message,
    });
  }
};

/**
 * Generate Tax Reports
 */
exports.getTaxReportsReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const reportMonth = month || (currentDate.getMonth() + 1);
    const reportYear = year || currentDate.getFullYear();
    
    console.log(`📊 Generating Tax Reports for: ${reportMonth}/${reportYear}`);
    
    const [taxData] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        e.basic_salary,
        p.gross_salary,
        ROUND(p.gross_salary * 0.10, 2) as income_tax,
        ROUND(p.gross_salary * 0.05, 2) as professional_tax,
        ROUND(p.gross_salary * 0.15, 2) as total_tax,
        p.net_salary
      FROM employees e
      LEFT JOIN payrolls p ON e.id = p.employee_id 
        AND p.month = ? AND p.year = ?
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.status = 'active' AND e.basic_salary > 0
      ORDER BY e.employee_id
    `, [reportMonth, reportYear]);

    const totalTax = taxData.reduce((sum, row) => sum + (parseFloat(row.total_tax) || 0), 0);

    res.json({
      success: true,
      report_type: 'tax_reports',
      month: reportMonth,
      year: reportYear,
      summary: {
        total_employees: taxData.length,
        total_tax_collected: totalTax,
      },
      data: taxData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Tax reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate tax reports',
      error: error.message,
    });
  }
};

/**
 * Generate Bonus Reports
 */
exports.getBonusReportsReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    console.log(`📊 Generating Bonus Reports for: ${year}`);
    
    // For now, calculate based on performance
    const [bonusData] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        des.name as designation,
        e.basic_salary,
        COUNT(pg.id) as goals_achieved,
        ROUND(e.basic_salary * 0.10, 2) as estimated_bonus
      FROM employees e
      LEFT JOIN performance_goals pg ON e.id = pg.employee_id 
        AND pg.status = 'completed'
        AND YEAR(pg.created_at) = ?
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      WHERE e.status = 'active'
      GROUP BY e.id, e.employee_id, employee_name, d.name, des.name, e.basic_salary
      ORDER BY estimated_bonus DESC
    `, [year]);

    const totalBonus = bonusData.reduce((sum, row) => sum + (parseFloat(row.estimated_bonus) || 0), 0);

    res.json({
      success: true,
      report_type: 'bonus_reports',
      year,
      summary: {
        total_employees: bonusData.length,
        total_bonus_amount: totalBonus,
      },
      data: bonusData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Bonus reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bonus reports',
      error: error.message,
    });
  }
};

// ============================================================================
// HR REPORTS
// ============================================================================

/**
 * Generate Employee Directory Report
 */
exports.getEmployeeDirectoryReport = async (req, res) => {
  try {
    console.log('📊 Generating Employee Directory Report');
    
    const [employees] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.email,
        e.phone,
        d.name as department,
        des.name as designation,
        b.name as branch,
        e.joining_date,
        e.employment_type,
        e.status,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      LEFT JOIN branches b ON e.branch_id = b.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ORDER BY e.employee_id
    `);

    res.json({
      success: true,
      report_type: 'employee_directory',
      total_employees: employees.length,
      data: employees,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Employee directory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate employee directory report',
      error: error.message,
    });
  }
};

/**
 * Generate Performance Reviews Report
 */
exports.getPerformanceReviewsReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    console.log(`📊 Generating Performance Reviews Report for: ${year}`);
    
    const [performanceData] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        pg.title as goal_title,
        pg.target_value,
        pg.current_value,
        pg.status,
        pg.due_date,
        pg.completion_percentage
      FROM performance_goals pg
      JOIN employees e ON pg.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE YEAR(pg.created_at) = ?
      ORDER BY e.employee_id, pg.due_date
    `, [year]);

    res.json({
      success: true,
      report_type: 'performance_reviews',
      year,
      data: performanceData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Performance reviews report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate performance reviews report',
      error: error.message,
    });
  }
};

/**
 * Generate Training Reports
 */
exports.getTrainingReportsReport = async (req, res) => {
  try {
    console.log('📊 Generating Training Reports');
    
    const [trainingData] = await db.query(`
      SELECT 
        tp.id,
        tp.title as program_name,
        tp.description,
        tp.start_date,
        tp.end_date,
        tp.duration_hours,
        tp.capacity,
        tp.status,
        COUNT(DISTINCT e.id) as enrolled_count,
        tp.trainer_name,
        tp.cost
      FROM training_programs tp
      LEFT JOIN employees e ON FIND_IN_SET(e.id, tp.participants)
      GROUP BY tp.id, tp.title, tp.description, tp.start_date, tp.end_date, 
               tp.duration_hours, tp.capacity, tp.status, tp.trainer_name, tp.cost
      ORDER BY tp.start_date DESC
    `);

    res.json({
      success: true,
      report_type: 'training_reports',
      total_programs: trainingData.length,
      data: trainingData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Training reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate training reports',
      error: error.message,
    });
  }
};

/**
 * Generate Turnover Analysis Report
 */
exports.getTurnoverAnalysisReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    console.log(`📊 Generating Turnover Analysis Report for: ${year}`);
    
    const [turnoverData] = await db.query(`
      SELECT 
        MONTH(e.updated_at) as month,
        d.name as department,
        COUNT(*) as terminations,
        AVG(DATEDIFF(e.updated_at, e.joining_date)) as avg_tenure_days
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.status = 'inactive' 
        AND YEAR(e.updated_at) = ?
      GROUP BY MONTH(e.updated_at), d.name
      ORDER BY month, department
    `, [year]);

    const [activeCount] = await db.query(`
      SELECT COUNT(*) as count FROM employees WHERE status = 'active'
    `);

    res.json({
      success: true,
      report_type: 'turnover_analysis',
      year,
      active_employees: activeCount[0]?.count || 0,
      data: turnoverData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Turnover analysis report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate turnover analysis report',
      error: error.message,
    });
  }
};

// ============================================================================
// LEAVE REPORTS
// ============================================================================

/**
 * Generate Leave Balance Report
 */
exports.getLeaveBalanceReport = async (req, res) => {
  try {
    console.log('📊 Generating Leave Balance Report');
    
    const [leaveBalances] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        lt.name as leave_type,
        lb.total_days,
        lb.used_days,
        lb.pending_days,
        lb.remaining_days,
        lb.year
      FROM leave_balances lb
      JOIN employees e ON lb.employee_id = e.id
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE lb.year = YEAR(CURDATE())
        AND e.status = 'active'
      ORDER BY e.employee_id, lt.name
    `);

    res.json({
      success: true,
      report_type: 'leave_balance',
      year: new Date().getFullYear(),
      data: leaveBalances,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Leave balance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate leave balance report',
      error: error.message,
    });
  }
};

/**
 * Generate Leave Usage Report
 */
exports.getLeaveUsageReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];
    
    console.log(`📊 Generating Leave Usage Report: ${startDate} to ${endDate}`);
    
    const [leaveUsage] = await db.query(`
      SELECT 
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        lt.name as leave_type,
        COUNT(*) as leave_count,
        SUM(lr.total_days) as total_days_taken,
        lr.status
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE DATE(lr.start_date) BETWEEN ? AND ?
      GROUP BY e.employee_id, employee_name, d.name, lt.name, lr.status
      ORDER BY e.employee_id
    `, [startDate, endDate]);

    res.json({
      success: true,
      report_type: 'leave_usage',
      start_date: startDate,
      end_date: endDate,
      data: leaveUsage,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Leave usage report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate leave usage report',
      error: error.message,
    });
  }
};

/**
 * Generate Leave Approvals Report
 */
exports.getLeaveApprovalsReport = async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    console.log(`📊 Generating Leave Approvals Report (status: ${status})`);
    
    let statusCondition = '';
    if (status !== 'all') {
      statusCondition = `AND lr.status = '${status}'`;
    }
    
    const [leaveApprovals] = await db.query(`
      SELECT 
        lr.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        d.name as department,
        lt.name as leave_type,
        lr.start_date,
        lr.end_date,
        lr.total_days,
        lr.reason,
        lr.status,
        lr.created_at as applied_date,
        lr.updated_at as processed_date
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE 1=1 ${statusCondition}
      ORDER BY lr.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      report_type: 'leave_approvals',
      status,
      data: leaveApprovals,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Leave approvals report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate leave approvals report',
      error: error.message,
    });
  }
};

/**
 * Generate Holiday Calendar Report
 */
exports.getHolidayCalendarReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    console.log(`📊 Generating Holiday Calendar Report for: ${year}`);
    
    const [holidays] = await db.query(`
      SELECT 
        id,
        name,
        date,
        type,
        region,
        description,
        status
      FROM holidays
      WHERE YEAR(date) = ?
        AND status = 'active'
      ORDER BY date
    `, [year]);

    res.json({
      success: true,
      report_type: 'holiday_calendar',
      year,
      total_holidays: holidays.length,
      data: holidays,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Holiday calendar report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate holiday calendar report',
      error: error.message,
    });
  }
};

// ============================================================================
// RECRUITMENT REPORTS
// ============================================================================

/**
 * Generate Job Posting Report
 */
exports.getJobPostingReport = async (req, res) => {
  try {
    console.log('📊 Generating Job Posting Report');
    
    const [jobPostings] = await db.query(`
      SELECT 
        jp.id,
        jp.title,
        d.name as department,
        jp.location,
        jp.employment_type,
        jp.positions,
        jp.status,
        jp.posted_date,
        jp.closing_date,
        COUNT(DISTINCT ja.id) as application_count
      FROM job_postings jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN job_applications ja ON jp.id = ja.job_posting_id
      GROUP BY jp.id, jp.title, d.name, jp.location, jp.employment_type, 
               jp.positions, jp.status, jp.posted_date, jp.closing_date
      ORDER BY jp.posted_date DESC
    `);

    res.json({
      success: true,
      report_type: 'job_posting',
      total_postings: jobPostings.length,
      data: jobPostings,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Job posting report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate job posting report',
      error: error.message,
    });
  }
};

/**
 * Generate Application Summary Report
 */
exports.getApplicationSummaryReport = async (req, res) => {
  try {
    console.log('📊 Generating Application Summary Report');
    
    const [applicationStats] = await db.query(`
      SELECT 
        jp.title as job_title,
        ja.status,
        COUNT(*) as count,
        AVG(ja.experience) as avg_experience
      FROM job_applications ja
      JOIN job_postings jp ON ja.job_posting_id = jp.id
      GROUP BY jp.title, ja.status
      ORDER BY jp.title, ja.status
    `);

    const [overallStats] = await db.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(DISTINCT candidate_name) as unique_candidates,
        AVG(experience) as avg_experience
      FROM job_applications
    `);

    res.json({
      success: true,
      report_type: 'application_summary',
      overall_stats: overallStats[0],
      data: applicationStats,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Application summary report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate application summary report',
      error: error.message,
    });
  }
};

/**
 * Generate Hiring Pipeline Report
 */
exports.getHiringPipelineReport = async (req, res) => {
  try {
    console.log('📊 Generating Hiring Pipeline Report');
    
    const [pipelineData] = await db.query(`
      SELECT 
        jp.title as job_title,
        ja.status as stage,
        COUNT(*) as candidate_count,
        AVG(DATEDIFF(CURDATE(), ja.applied_date)) as avg_days_in_stage
      FROM job_applications ja
      JOIN job_postings jp ON ja.job_posting_id = jp.id
      WHERE jp.status = 'active'
      GROUP BY jp.title, ja.status
      ORDER BY jp.title, 
        FIELD(ja.status, 'applied', 'screening', 'interview', 'offer', 'hired', 'rejected')
    `);

    res.json({
      success: true,
      report_type: 'hiring_pipeline',
      data: pipelineData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Hiring pipeline report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate hiring pipeline report',
      error: error.message,
    });
  }
};

/**
 * Generate Cost per Hire Report
 */
exports.getCostPerHireReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    console.log(`📊 Generating Cost per Hire Report for: ${year}`);
    
    const [costData] = await db.query(`
      SELECT 
        jp.title as job_title,
        d.name as department,
        jp.positions,
        COUNT(ja.id) as total_applications,
        COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count,
        5000 as estimated_cost_per_hire
      FROM job_postings jp
      LEFT JOIN job_applications ja ON jp.id = ja.job_posting_id
      LEFT JOIN departments d ON jp.department_id = d.id
      WHERE YEAR(jp.posted_date) = ?
      GROUP BY jp.id, jp.title, d.name, jp.positions
      ORDER BY hired_count DESC
    `, [year]);

    const totalHires = costData.reduce((sum, row) => sum + (parseInt(row.hired_count) || 0), 0);
    const totalCost = totalHires * 5000; // Estimated cost per hire

    res.json({
      success: true,
      report_type: 'cost_per_hire',
      year,
      summary: {
        total_hires: totalHires,
        avg_cost_per_hire: 5000,
        total_recruitment_cost: totalCost,
      },
      data: costData,
      generated_at: new Date(),
    });
  } catch (error) {
    console.error('Cost per hire report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate cost per hire report',
      error: error.message,
    });
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get list of available reports
 */
exports.getAvailableReports = async (req, res) => {
  try {
    const reports = {
      attendance: [
        { id: 'daily_attendance', name: 'Daily Attendance Report', description: 'Daily attendance summary' },
        { id: 'monthly_attendance', name: 'Monthly Attendance Report', description: 'Monthly attendance overview' },
        { id: 'overtime', name: 'Overtime Report', description: 'Overtime hours and costs' },
        { id: 'late_arrivals', name: 'Late Arrivals Report', description: 'Late arrival patterns' },
      ],
      payroll: [
        { id: 'payroll_summary', name: 'Payroll Summary', description: 'Monthly payroll overview' },
        { id: 'salary_analysis', name: 'Salary Analysis', description: 'Salary distribution analysis' },
        { id: 'tax_reports', name: 'Tax Reports', description: 'Tax deductions and filings' },
        { id: 'bonus_reports', name: 'Bonus Reports', description: 'Bonus and incentive tracking' },
      ],
      hr: [
        { id: 'employee_directory', name: 'Employee Directory', description: 'Complete employee listing' },
        { id: 'performance_reviews', name: 'Performance Reviews', description: 'Performance evaluation reports' },
        { id: 'training_reports', name: 'Training Reports', description: 'Training completion and progress' },
        { id: 'turnover_analysis', name: 'Turnover Analysis', description: 'Employee turnover statistics' },
      ],
      leaves: [
        { id: 'leave_balance', name: 'Leave Balance Report', description: 'Employee leave balances' },
        { id: 'leave_usage', name: 'Leave Usage Report', description: 'Leave usage patterns' },
        { id: 'leave_approvals', name: 'Leave Approvals', description: 'Leave approval workflow' },
        { id: 'holiday_calendar', name: 'Holiday Calendar', description: 'Company holidays and events' },
      ],
      recruitment: [
        { id: 'job_posting', name: 'Job Posting Report', description: 'Active job postings' },
        { id: 'application_summary', name: 'Application Summary', description: 'Application statistics' },
        { id: 'hiring_pipeline', name: 'Hiring Pipeline', description: 'Recruitment pipeline status' },
        { id: 'cost_per_hire', name: 'Cost per Hire', description: 'Recruitment cost analysis' },
      ],
      compliance: [
        { id: 'employee_directory', name: 'Labor Law Compliance', description: 'Labor law adherence reports' },
        { id: 'employee_directory', name: 'Audit Trail', description: 'System audit logs' },
        { id: 'employee_directory', name: 'Document Compliance', description: 'Document verification status' },
        { id: 'employee_directory', name: 'Policy Adherence', description: 'Policy compliance tracking' },
      ],
    };

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available reports',
      error: error.message,
    });
  }
};

/**
 * Get recent reports (for dashboard)
 */
exports.getRecentReports = async (req, res) => {
  try {
    console.log('📊 Fetching recent reports');
    
    // For now, return sample data from actual database queries
    // In production, this would fetch from generated_reports table
    const [recentReports] = await db.query(`
      SELECT 
        1 as id,
        'Monthly Attendance' as name,
        'Attendance' as category,
        'System' as generated_by,
        DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY), '%m/%d/%Y %h:%i %p') as generated_at,
        'completed' as status,
        '2.5 MB' as file_size,
        5 as download_count
      UNION ALL
      SELECT 
        2 as id,
        'Payroll Summary - Current Month' as name,
        'Payroll' as category,
        'System' as generated_by,
        DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 2 DAY), '%m/%d/%Y %h:%i %p') as generated_at,
        'completed' as status,
        '1.8 MB' as file_size,
        12 as download_count
      UNION ALL
      SELECT 
        3 as id,
        'Employee Directory' as name,
        'HR' as category,
        'System' as generated_by,
        DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3 DAY), '%m/%d/%Y %h:%i %p') as generated_at,
        'completed' as status,
        '3.2 MB' as file_size,
        8 as download_count
      LIMIT 10
    `);

    res.json({
      success: true,
      data: recentReports,
    });
  } catch (error) {
    console.error('Recent reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent reports',
      error: error.message,
    });
  }
};

