const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Get available reports list
router.get('/available', reportsController.getAvailableReports);

// Get recent reports
router.get('/recent', reportsController.getRecentReports);

// Attendance Reports
router.get('/attendance/daily', reportsController.getDailyAttendanceReport);
router.get('/attendance/monthly', reportsController.getMonthlyAttendanceReport);
router.get('/attendance/overtime', reportsController.getOvertimeReport);
router.get('/attendance/late-arrivals', reportsController.getLateArrivalsReport);

// Payroll Reports
router.get('/payroll/summary', reportsController.getPayrollSummaryReport);
router.get('/payroll/salary-analysis', reportsController.getSalaryAnalysisReport);
router.get('/payroll/tax-reports', reportsController.getTaxReportsReport);
router.get('/payroll/bonus-reports', reportsController.getBonusReportsReport);

// HR Reports
router.get('/hr/employee-directory', reportsController.getEmployeeDirectoryReport);
router.get('/hr/performance-reviews', reportsController.getPerformanceReviewsReport);
router.get('/hr/training-reports', reportsController.getTrainingReportsReport);
router.get('/hr/turnover-analysis', reportsController.getTurnoverAnalysisReport);

// Leave Reports
router.get('/leaves/balance', reportsController.getLeaveBalanceReport);
router.get('/leaves/usage', reportsController.getLeaveUsageReport);
router.get('/leaves/approvals', reportsController.getLeaveApprovalsReport);
router.get('/leaves/holiday-calendar', reportsController.getHolidayCalendarReport);

// Recruitment Reports
router.get('/recruitment/job-posting', reportsController.getJobPostingReport);
router.get('/recruitment/application-summary', reportsController.getApplicationSummaryReport);
router.get('/recruitment/hiring-pipeline', reportsController.getHiringPipelineReport);
router.get('/recruitment/cost-per-hire', reportsController.getCostPerHireReport);

module.exports = router;

