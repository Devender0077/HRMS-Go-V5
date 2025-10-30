const ContractInstance = require('../models/ContractInstance');
const ContractTemplate = require('../models/ContractTemplate');
const EmployeeOnboardingDocument = require('../models/EmployeeOnboardingDocument');
const { Op } = require('sequelize');
const db = require('../config/database');

// Get comprehensive analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get overall stats
    const [overallStats] = await db.query(`
      SELECT 
        COUNT(*) as total_contracts,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_contracts,
        SUM(CASE WHEN status IN ('sent', 'viewed', 'in_progress') THEN 1 ELSE 0 END) as pending_contracts,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined_contracts,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_contracts,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, sent_date, completed_date)), 2) as avg_completion_hours
      FROM contract_instances
      WHERE created_at >= ?
    `, [startDate]);

    // Get completion rate by template
    const [byTemplate] = await db.query(`
      SELECT 
        ct.name as template_name,
        ct.category,
        ct.region,
        COUNT(ci.id) as total_sent,
        SUM(CASE WHEN ci.status = 'completed' THEN 1 ELSE 0 END) as completed,
        ROUND(SUM(CASE WHEN ci.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(ci.id), 2) as completion_rate
      FROM contract_templates ct
      LEFT JOIN contract_instances ci ON ct.id = ci.template_id AND ci.created_at >= ?
      WHERE ct.is_active = TRUE
      GROUP BY ct.id, ct.name, ct.category, ct.region
      ORDER BY total_sent DESC
    `, [startDate]);

    // Get status distribution
    const [statusDistribution] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contract_instances
      WHERE created_at >= ?
      GROUP BY status
      ORDER BY count DESC
    `, [startDate]);

    // Get region distribution
    const [regionDistribution] = await db.query(`
      SELECT 
        ct.region,
        COUNT(ci.id) as count
      FROM contract_templates ct
      LEFT JOIN contract_instances ci ON ct.id = ci.template_id AND ci.created_at >= ?
      GROUP BY ct.region
    `, [startDate]);

    // Get daily trend (last 30 days)
    const [dailyTrend] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as sent,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM contract_instances
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get onboarding completion stats
    const [onboardingStats] = await db.query(`
      SELECT 
        COUNT(DISTINCT employee_id) as total_employees,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_docs,
        SUM(CASE WHEN status = 'pending' OR status = 'sent' THEN 1 ELSE 0 END) as pending_docs,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_docs
      FROM employee_onboarding_documents
      WHERE created_at >= ?
    `, [startDate]);

    res.json({
      success: true,
      data: {
        overview: overallStats[0] || {},
        byTemplate: byTemplate || [],
        statusDistribution: statusDistribution || [],
        regionDistribution: regionDistribution || [],
        dailyTrend: dailyTrend || [],
        onboarding: onboardingStats[0] || {},
      },
    });
  } catch (error) {
    console.error('❌ Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// Get top performing templates
exports.getTopTemplates = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [templates] = await db.query(`
      SELECT 
        ct.id,
        ct.name,
        ct.category,
        ct.region,
        COUNT(ci.id) as usage_count,
        SUM(CASE WHEN ci.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        ROUND(SUM(CASE WHEN ci.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(ci.id), 0), 2) as completion_rate
      FROM contract_templates ct
      LEFT JOIN contract_instances ci ON ct.id = ci.template_id
      WHERE ct.is_active = TRUE
      GROUP BY ct.id
      ORDER BY usage_count DESC, completion_rate DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('❌ Get top templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top templates',
      error: error.message,
    });
  }
};

// Get pending contracts needing attention
exports.getPendingContracts = async (req, res) => {
  try {
    const [pending] = await db.query(`
      SELECT 
        ci.id,
        ci.contract_number,
        ci.title,
        ci.recipient_name,
        ci.recipient_email,
        ci.status,
        ci.sent_date,
        ci.expires_at,
        DATEDIFF(ci.expires_at, NOW()) as days_until_expiry,
        ct.name as template_name
      FROM contract_instances ci
      LEFT JOIN contract_templates ct ON ci.template_id = ct.id
      WHERE ci.status IN ('sent', 'viewed', 'in_progress')
        AND (ci.expires_at IS NULL OR ci.expires_at > NOW())
      ORDER BY 
        CASE 
          WHEN DATEDIFF(ci.expires_at, NOW()) <= 2 THEN 1
          WHEN DATEDIFF(ci.expires_at, NOW()) <= 7 THEN 2
          ELSE 3
        END,
        ci.sent_date ASC
    `);

    res.json({
      success: true,
      data: pending,
      totalCount: pending.length,
    });
  } catch (error) {
    console.error('❌ Get pending contracts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending contracts',
      error: error.message,
    });
  }
};

// Get onboarding completion report
exports.getOnboardingReport = async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT 
        e.id as employee_id,
        e.employee_id as employee_code,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.email,
        e.joining_date,
        COUNT(eod.id) as total_documents,
        SUM(CASE WHEN eod.status = 'completed' THEN 1 ELSE 0 END) as completed_documents,
        ROUND(SUM(CASE WHEN eod.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(eod.id), 0), 2) as completion_percentage,
        SUM(CASE WHEN eod.status = 'overdue' THEN 1 ELSE 0 END) as overdue_documents
      FROM employees e
      LEFT JOIN employee_onboarding_documents eod ON e.id = eod.employee_id AND eod.required = TRUE
      WHERE eod.id IS NOT NULL
      GROUP BY e.id
      ORDER BY completion_percentage ASC, e.joining_date DESC
    `);

    res.json({
      success: true,
      data: report,
      totalCount: report.length,
    });
  } catch (error) {
    console.error('❌ Get onboarding report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch onboarding report',
      error: error.message,
    });
  }
};

