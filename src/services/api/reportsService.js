import { apiClient } from './authService';

/**
 * Reports Service
 * Handles all report generation and fetching
 */

class ReportsService {
  /**
   * Get list of available reports
   */
  async getAvailableReports() {
    try {
      console.log('📊 [Reports Service] Fetching available reports');
      const response = await apiClient.get('/reports/available');
      console.log('✅ [Reports Service] Available reports loaded');
      return {
        success: true,
        data: response.data.reports,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error fetching available reports:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available reports',
        error,
      };
    }
  }

  /**
   * Get recent reports
   */
  async getRecentReports() {
    try {
      console.log('📊 [Reports Service] Fetching recent reports');
      const response = await apiClient.get('/reports/recent');
      console.log('✅ [Reports Service] Recent reports loaded:', response.data);
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error fetching recent reports:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent reports',
        error,
      };
    }
  }

  // ============================================================================
  // ATTENDANCE REPORTS
  // ============================================================================

  async getDailyAttendanceReport(date) {
    try {
      console.log('📊 [Reports Service] Generating daily attendance report:', date);
      const response = await apiClient.get('/reports/attendance/daily', {
        params: { date },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getMonthlyAttendanceReport(month, year) {
    try {
      console.log(`📊 [Reports Service] Generating monthly attendance report: ${month}/${year}`);
      const response = await apiClient.get('/reports/attendance/monthly', {
        params: { month, year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getOvertimeReport(startDate, endDate) {
    try {
      console.log('📊 [Reports Service] Generating overtime report');
      const response = await apiClient.get('/reports/attendance/overtime', {
        params: { start_date: startDate, end_date: endDate },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getLateArrivalsReport(startDate, endDate) {
    try {
      console.log('📊 [Reports Service] Generating late arrivals report');
      const response = await apiClient.get('/reports/attendance/late-arrivals', {
        params: { start_date: startDate, end_date: endDate },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  // ============================================================================
  // PAYROLL REPORTS
  // ============================================================================

  async getPayrollSummaryReport(month, year) {
    try {
      console.log(`📊 [Reports Service] Generating payroll summary: ${month}/${year}`);
      const response = await apiClient.get('/reports/payroll/summary', {
        params: { month, year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getSalaryAnalysisReport() {
    try {
      console.log('📊 [Reports Service] Generating salary analysis report');
      const response = await apiClient.get('/reports/payroll/salary-analysis');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getTaxReportsReport(month, year) {
    try {
      console.log(`📊 [Reports Service] Generating tax reports: ${month}/${year}`);
      const response = await apiClient.get('/reports/payroll/tax-reports', {
        params: { month, year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getBonusReportsReport(year) {
    try {
      console.log('📊 [Reports Service] Generating bonus reports');
      const response = await apiClient.get('/reports/payroll/bonus-reports', {
        params: { year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  // ============================================================================
  // HR REPORTS
  // ============================================================================

  async getEmployeeDirectoryReport() {
    try {
      console.log('📊 [Reports Service] Generating employee directory report');
      const response = await apiClient.get('/reports/hr/employee-directory');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getPerformanceReviewsReport(year) {
    try {
      console.log('📊 [Reports Service] Generating performance reviews report');
      const response = await apiClient.get('/reports/hr/performance-reviews', {
        params: { year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getTrainingReportsReport() {
    try {
      console.log('📊 [Reports Service] Generating training reports');
      const response = await apiClient.get('/reports/hr/training-reports');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getTurnoverAnalysisReport(year) {
    try {
      console.log('📊 [Reports Service] Generating turnover analysis report');
      const response = await apiClient.get('/reports/hr/turnover-analysis', {
        params: { year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  // ============================================================================
  // LEAVE REPORTS
  // ============================================================================

  async getLeaveBalanceReport() {
    try {
      console.log('📊 [Reports Service] Generating leave balance report');
      const response = await apiClient.get('/reports/leaves/balance');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getLeaveUsageReport(startDate, endDate) {
    try {
      console.log('📊 [Reports Service] Generating leave usage report');
      const response = await apiClient.get('/reports/leaves/usage', {
        params: { start_date: startDate, end_date: endDate },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getLeaveApprovalsReport(status = 'all') {
    try {
      console.log('📊 [Reports Service] Generating leave approvals report');
      const response = await apiClient.get('/reports/leaves/approvals', {
        params: { status },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getHolidayCalendarReport(year) {
    try {
      console.log('📊 [Reports Service] Generating holiday calendar report');
      const response = await apiClient.get('/reports/leaves/holiday-calendar', {
        params: { year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  // ============================================================================
  // RECRUITMENT REPORTS
  // ============================================================================

  async getJobPostingReport() {
    try {
      console.log('📊 [Reports Service] Generating job posting report');
      const response = await apiClient.get('/reports/recruitment/job-posting');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getApplicationSummaryReport() {
    try {
      console.log('📊 [Reports Service] Generating application summary report');
      const response = await apiClient.get('/reports/recruitment/application-summary');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getHiringPipelineReport() {
    try {
      console.log('📊 [Reports Service] Generating hiring pipeline report');
      const response = await apiClient.get('/reports/recruitment/hiring-pipeline');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  async getCostPerHireReport(year) {
    try {
      console.log('📊 [Reports Service] Generating cost per hire report');
      const response = await apiClient.get('/reports/recruitment/cost-per-hire', {
        params: { year },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ [Reports Service] Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report',
        error,
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generic report generation method
   */
  async generateReport(reportType, params = {}) {
    const reportMapping = {
      // Attendance
      'daily_attendance': () => this.getDailyAttendanceReport(params.date),
      'monthly_attendance': () => this.getMonthlyAttendanceReport(params.month, params.year),
      'overtime': () => this.getOvertimeReport(params.start_date, params.end_date),
      'late_arrivals': () => this.getLateArrivalsReport(params.start_date, params.end_date),
      
      // Payroll
      'payroll_summary': () => this.getPayrollSummaryReport(params.month, params.year),
      'salary_analysis': () => this.getSalaryAnalysisReport(),
      'tax_reports': () => this.getTaxReportsReport(params.month, params.year),
      'bonus_reports': () => this.getBonusReportsReport(params.year),
      
      // HR
      'employee_directory': () => this.getEmployeeDirectoryReport(),
      'performance_reviews': () => this.getPerformanceReviewsReport(params.year),
      'training_reports': () => this.getTrainingReportsReport(),
      'turnover_analysis': () => this.getTurnoverAnalysisReport(params.year),
      
      // Leaves
      'leave_balance': () => this.getLeaveBalanceReport(),
      'leave_usage': () => this.getLeaveUsageReport(params.start_date, params.end_date),
      'leave_approvals': () => this.getLeaveApprovalsReport(params.status),
      'holiday_calendar': () => this.getHolidayCalendarReport(params.year),
      
      // Recruitment
      'job_posting': () => this.getJobPostingReport(),
      'application_summary': () => this.getApplicationSummaryReport(),
      'hiring_pipeline': () => this.getHiringPipelineReport(),
      'cost_per_hire': () => this.getCostPerHireReport(params.year),
    };

    const reportFunction = reportMapping[reportType];
    if (!reportFunction) {
      console.error(`❌ Unknown report type: ${reportType}`);
      return {
        success: false,
        message: `Unknown report type: ${reportType}`,
      };
    }

    return reportFunction();
  }
}

export default new ReportsService();

