const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Branch = require('../models/Branch');
const Leave = require('../models/Leave');
const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const TrainingProgram = require('../models/TrainingProgram');
const PerformanceGoal = require('../models/PerformanceGoal');
const db = require('../config/database');
const { Op } = require('sequelize');

/**
 * Get comprehensive dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().substring(0, 7);
    
    // Employee stats
    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({ where: { status: 'Active' } });
    const newThisMonth = await Employee.count({
      where: {
        joining_date: {
          [Op.gte]: `${thisMonth}-01`
        }
      }
    });

    // Attendance stats for today
    const [[attendanceToday]] = await db.query(
      `SELECT COUNT(DISTINCT employee_id) as present 
       FROM attendance 
       WHERE DATE(clock_in) = ?`,
      [today]
    );

    // Leave stats - using raw SQL for reliability
    const [[{onLeaveToday}]] = await db.query(
      `SELECT COUNT(*) as onLeaveToday
       FROM leave_requests
       WHERE status = 'approved'
       AND start_date <= ? AND end_date >= ?`,
      [today, today]
    );

    const [[{pendingLeaves}]] = await db.query(
      `SELECT COUNT(*) as pendingLeaves
       FROM leave_requests
       WHERE status = 'pending'`
    );

    // Department breakdown
    const [deptBreakdown] = await db.query(
      `SELECT d.name, COUNT(e.id) as count
       FROM departments d
       LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'Active'
       WHERE d.status = 'active'
       GROUP BY d.id, d.name
       ORDER BY count DESC
       LIMIT 10`
    );

    // Branch breakdown
    const [branchBreakdown] = await db.query(
      `SELECT b.name, COUNT(e.id) as count
       FROM branches b
       LEFT JOIN employees e ON b.id = e.branch_id AND e.status = 'Active'
       WHERE b.status = 'active'
       GROUP BY b.id, b.name
       ORDER BY count DESC
       LIMIT 10`
    );

    // Recruitment stats
    const totalJobPostings = await JobPosting.count();
    const activeJobPostings = await JobPosting.count({ where: { status: 'open' } });
    const totalApplications = await JobApplication.count();
    const pendingApplications = await JobApplication.count({ where: { status: 'pending' } });

    // Training stats
    const totalTrainings = await TrainingProgram.count();
    const upcomingTrainings = await TrainingProgram.count({ 
      where: {
        start_date: { [Op.gte]: today }
      }
    });

    // Performance stats
    const totalGoals = await PerformanceGoal.count();
    const activeGoals = await PerformanceGoal.count({ where: { status: 'active' } });

    // Attendance trend (last 7 days)
    const [attendanceTrend] = await db.query(
      `SELECT DATE(clock_in) as date, COUNT(DISTINCT employee_id) as count
       FROM attendance
       WHERE clock_in >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(clock_in)
       ORDER BY date ASC`
    );

    // Leave trend (last 30 days)
    const [leaveTrend] = await db.query(
      `SELECT DATE(start_date) as date, COUNT(*) as count
       FROM leave_requests
       WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       AND status = 'approved'
       GROUP BY DATE(start_date)
       ORDER BY date ASC`
    );

    // Recent hires (last 5)
    const recentHires = await Employee.findAll({
      order: [['joining_date', 'DESC']],
      limit: 5,
      attributes: ['id', 'employee_id', 'first_name', 'last_name', 'designation_id', 'joining_date', 'department_id']
    });

    // Birthdays this month
    const [[birthdaysCount]] = await db.query(
      `SELECT COUNT(*) as count FROM employees 
       WHERE MONTH(date_of_birth) = MONTH(CURDATE())
       AND status = 'Active'`
    );

    // Work anniversaries this month
    const [[anniversariesCount]] = await db.query(
      `SELECT COUNT(*) as count FROM employees 
       WHERE MONTH(joining_date) = MONTH(CURDATE())
       AND status = 'Active'
       AND YEAR(joining_date) < YEAR(CURDATE())`
    );

    res.json({
      success: true,
      data: {
        employees: {
          total: totalEmployees,
          active: activeEmployees,
          newThisMonth,
          presentToday: attendanceToday.present || 0,
          onLeave: onLeaveToday,
        },
        attendance: {
          presentToday: attendanceToday.present || 0,
          attendanceRate: totalEmployees > 0 ? ((attendanceToday.present / totalEmployees) * 100).toFixed(1) : 0,
          trend: attendanceTrend,
        },
        leaves: {
          onLeaveToday: onLeaveToday,
          pending: pendingLeaves,
          trend: leaveTrend,
        },
        recruitment: {
          totalJobPostings,
          activeJobPostings,
          totalApplications,
          pendingApplications,
        },
        training: {
          total: totalTrainings,
          upcoming: upcomingTrainings,
        },
        performance: {
          totalGoals,
          activeGoals,
        },
        departmentBreakdown: deptBreakdown,
        branchBreakdown: branchBreakdown,
        recentHires,
        celebrations: {
          birthdays: birthdaysCount.count || 0,
          anniversaries: anniversariesCount.count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get quick actions/notifications for dashboard
 */
exports.getQuickActions = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Pending approvals - using raw SQL
    const [pendingLeavesData] = await db.query(
      `SELECT lr.id, lr.employee_id as employeeId, lr.leave_type_id as leaveTypeId, 
              lr.start_date as startDate, lr.end_date as endDate, lr.created_at as createdAt,
              CONCAT(e.first_name, ' ', e.last_name) as employee_name, e.email as employee_email
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       WHERE lr.status = 'pending'
       ORDER BY lr.created_at DESC
       LIMIT 5`
    );
    const pendingLeaves = pendingLeavesData;

    // Upcoming birthdays (next 7 days)
    const [upcomingBirthdays] = await db.query(
      `SELECT id, employee_id, first_name, last_name, date_of_birth
       FROM employees
       WHERE status = 'Active'
       AND (
         (MONTH(date_of_birth) = MONTH(CURDATE()) AND DAY(date_of_birth) >= DAY(CURDATE()))
         OR (MONTH(date_of_birth) = MONTH(DATE_ADD(CURDATE(), INTERVAL 7 DAY)) AND DAY(date_of_birth) <= DAY(DATE_ADD(CURDATE(), INTERVAL 7 DAY)))
       )
       ORDER BY MONTH(date_of_birth), DAY(date_of_birth)
       LIMIT 5`
    );

    // Documents expiring soon (30 days)
    const [expiringDocs] = await db.query(
      `SELECT id, employee_id, document_name, expiry_date
       FROM employee_documents
       WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       AND status = 'active'
       ORDER BY expiry_date ASC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        pendingLeaves,
        upcomingBirthdays,
        expiringDocuments: expiringDocs,
      },
    });
  } catch (error) {
    console.error('Quick actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quick actions',
      error: error.message,
    });
  }
};

/**
 * Get recent activities for dashboard
 */
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent activities from various modules
    const [recentLeaves] = await db.query(
      `SELECT 'leave' as type, lr.id, lr.employee_id, CONCAT(e.first_name, ' ', e.last_name) as employee_name,
              lr.status, lr.created_at, 'applied for leave' as action
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       ORDER BY lr.created_at DESC
       LIMIT 3`
    );

    const [recentAttendance] = await db.query(
      `SELECT 'attendance' as type, a.id, a.employee_id, CONCAT(e.first_name, ' ', e.last_name) as employee_name,
              a.status, a.created_at, 'marked attendance' as action
       FROM attendance a
       JOIN employees e ON a.employee_id = e.id
       WHERE DATE(a.date) >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
       ORDER BY a.created_at DESC
       LIMIT 3`
    );

    const [recentEmployees] = await db.query(
      `SELECT 'employee' as type, id, employee_id, CONCAT(first_name, ' ', last_name) as employee_name,
              status, created_at, 'joined the company' as action
       FROM employees
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       ORDER BY created_at DESC
       LIMIT 3`
    );

    // Combine and sort all activities
    const allActivities = [...recentLeaves, ...recentAttendance, ...recentEmployees]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    res.json({
      success: true,
      data: allActivities,
      total: allActivities.length,
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message,
    });
  }
};

module.exports = exports;

