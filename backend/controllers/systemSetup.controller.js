const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Branch = require('../models/Branch');
const Designation = require('../models/Designation');
const Shift = require('../models/Shift');
const AttendancePolicy = require('../models/AttendancePolicy');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const PerformanceGoal = require('../models/PerformanceGoal');
const TrainingProgram = require('../models/TrainingProgram');
const DocumentCategory = require('../models/DocumentCategory');
const SalaryComponent = require('../models/SalaryComponent');
const LeaveType = require('../models/LeaveType');
const db = require('../config/database');

// Get counts for all categories
exports.getCounts = async (req, res) => {
  try {
    const counts = {
      organization: {
        branches: await Branch.count({ where: { status: 'active' } }),
        departments: await Department.count({ where: { status: 'active' } }),
        designations: await Designation.count({ where: { status: 'active' } }),
      },
      attendance: {
        shifts: await Shift.count({ where: { status: 'active' } }),
        policies: await AttendancePolicy.count({ where: { status: 'active' } }),
      },
      employees: {
        total: await Employee.count(),
        active: await Employee.count({ where: { status: 'Active' } }),
      },
      // Real counts from database using raw SQL for tables without models
      leave: {
        leaveTypes: await LeaveType.count({ where: { status: 'active' } }),
        leavePolicies: (await db.query('SELECT COUNT(*) as count FROM leave_policies WHERE status = "active"'))[0][0].count,
      },
      payroll: {
        salaryComponents: await SalaryComponent.count({ where: { status: 'active' } }),
        taxSettings: (await db.query('SELECT COUNT(*) as count FROM tax_settings WHERE status = "active"'))[0][0].count,
        paymentMethods: (await db.query('SELECT COUNT(*) as count FROM payment_methods WHERE status = "active"'))[0][0].count,
      },
      recruitment: {
        jobCategories: (await db.query('SELECT COUNT(*) as count FROM job_categories WHERE status = "active"'))[0][0].count,
        jobTypes: (await db.query('SELECT COUNT(*) as count FROM job_types WHERE status = "active"'))[0][0].count,
        hiringStages: (await db.query('SELECT COUNT(*) as count FROM hiring_stages WHERE status = "active"'))[0][0].count,
        jobPostings: await JobPosting.count(),
        applications: await JobApplication.count(),
      },
      performance: {
        kpiIndicators: (await db.query('SELECT COUNT(*) as count FROM kpi_indicators WHERE status = "active"'))[0][0].count,
        reviewCycles: (await db.query('SELECT COUNT(*) as count FROM review_cycles WHERE status = "active"'))[0][0].count,
        goalCategories: (await db.query('SELECT COUNT(*) as count FROM goal_categories WHERE status = "active"'))[0][0].count,
        performanceGoals: await PerformanceGoal.count(),
      },
      training: {
        trainingTypes: (await db.query('SELECT COUNT(*) as count FROM training_types WHERE status = "active"'))[0][0].count,
        trainingPrograms: await TrainingProgram.count(),
      },
      documents: {
        documentCategories: await DocumentCategory.count({ where: { status: 'active' } }),
        documentTypes: (await db.query('SELECT COUNT(*) as count FROM document_types WHERE status = "active"'))[0][0].count,
        companyPolicies: (await db.query('SELECT COUNT(*) as count FROM company_policies WHERE status = "active"'))[0][0].count,
        documentTemplates: 0,
      },
      awards: {
        awardTypes: (await db.query('SELECT COUNT(*) as count FROM award_types WHERE status = "active"'))[0][0].count,
      },
      termination: {
        terminationTypes: (await db.query('SELECT COUNT(*) as count FROM termination_types WHERE status = "active"'))[0][0].count,
        terminationReasons: (await db.query('SELECT COUNT(*) as count FROM termination_reasons WHERE status = "active"'))[0][0].count,
      },
      expense: {
        expenseCategories: (await db.query('SELECT COUNT(*) as count FROM expense_categories WHERE status = "active"'))[0][0].count,
        expenseLimits: (await db.query('SELECT COUNT(*) as count FROM expense_limits WHERE status = "active"'))[0][0].count,
      },
      income: {
        incomeCategories: (await db.query('SELECT COUNT(*) as count FROM income_categories WHERE status = "active"'))[0][0].count,
        incomeSources: (await db.query('SELECT COUNT(*) as count FROM income_sources WHERE status = "active"'))[0][0].count,
      },
      payment: {
        paymentGateways: 0,
      },
      contract: {
        contractTypes: (await db.query('SELECT COUNT(*) as count FROM contract_types WHERE status = "active"'))[0][0].count,
        contractTemplates: 0,
      },
      messenger: {
        messageTemplates: (await db.query('SELECT COUNT(*) as count FROM message_templates WHERE status = "active"'))[0][0].count,
        notificationSettings: (await db.query('SELECT COUNT(*) as count FROM notification_settings WHERE status = "active"'))[0][0].count,
      },
    };

    // Calculate totals - count only the CONFIG_ITEMS that match frontend (30 cards)
    // These match the exact cards shown on System Setup page
    const configItemKeys = [
      // Organization (3)
      'branches', 'departments', 'designations',
      // Attendance (2)
      'shifts', 'policies',
      // Leave (2)
      'leaveTypes', 'leavePolicies',
      // Payroll (3)
      'salaryComponents', 'taxSettings', 'paymentMethods',
      // Recruitment (3)
      'jobCategories', 'jobTypes', 'hiringStages',
      // Performance (3)
      'kpiIndicators', 'reviewCycles', 'goalCategories',
      // Training (1)
      'trainingTypes',
      // Documents (3)
      'documentCategories', 'documentTypes', 'companyPolicies',
      // Awards (1)
      'awardTypes',
      // Termination (2)
      'terminationTypes', 'terminationReasons',
      // Expense (2)
      'expenseCategories', 'expenseLimits',
      // Income (2)
      'incomeCategories', 'incomeSources',
      // Contract (1)
      'contractTypes',
      // Messenger (2)
      'messageTemplates', 'notificationSettings'
    ];
    
    let totalItems = configItemKeys.length; // Should be 30
    let configuredItems = 0;
    
    Object.values(counts).forEach(category => {
      Object.entries(category).forEach(([key, count]) => {
        if (configItemKeys.includes(key) && count > 0) {
          configuredItems++;
        }
      });
    });

    const pending = totalItems - configuredItems;
    const completion = totalItems > 0 ? Math.round((configuredItems / totalItems) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        counts,
        stats: {
          totalItems,
          configuredItems,
          pending,
          completion,
        },
      },
    });
  } catch (error) {
    console.error('Get counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system setup counts',
      error: error.message,
    });
  }
};

// Get category details with items
exports.getCategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let data = {};

    switch (categoryId) {
      case 'organization':
        data = {
          branches: {
            count: await Branch.count({ where: { status: 'active' } }),
            items: await Branch.findAll({ where: { status: 'active' }, limit: 5 }),
          },
          departments: {
            count: await Department.count({ where: { status: 'active' } }),
            items: await Department.findAll({ where: { status: 'active' }, limit: 5 }),
          },
          designations: {
            count: await Designation.count({ where: { status: 'active' } }),
            items: await Designation.findAll({ where: { status: 'active' }, limit: 5 }),
          },
        };
        break;

      case 'attendance':
        data = {
          shifts: {
            count: await Shift.count({ where: { status: 'active' } }),
            items: await Shift.findAll({ where: { status: 'active' }, limit: 5 }),
          },
          policies: {
            count: await AttendancePolicy.count({ where: { status: 'active' } }),
            items: await AttendancePolicy.findAll({ where: { status: 'active' }, limit: 5 }),
          },
        };
        break;

      default:
        data = {
          message: 'Category not yet implemented',
        };
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get category details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category details',
      error: error.message,
    });
  }
};

