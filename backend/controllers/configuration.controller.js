const db = require('../config/database');

// ============================================================================
// SHIFTS MANAGEMENT
// ============================================================================

exports.getShifts = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const [shifts] = await db.query(
      `SELECT * FROM shifts ${whereClause} ORDER BY name LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM shifts ${whereClause}`,
      params
    );

    res.json({ data: shifts, total });
  } catch (error) {
    console.error('Get shifts error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createShift = async (req, res) => {
  try {
    const { name, code, start_time, end_time, grace_period_minutes, break_duration_minutes, weekly_off, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO shifts (name, code, start_time, end_time, grace_period_minutes, break_duration_minutes, weekly_off, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, code, start_time, end_time, grace_period_minutes || 15, break_duration_minutes || 60, weekly_off || 'Sunday', status || 'active']
    );

    const [shift] = await db.execute('SELECT * FROM shifts WHERE id = ?', [result.insertId]);
    res.status(201).json(shift[0]);
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, start_time, end_time, grace_period_minutes, break_duration_minutes, weekly_off, status } = req.body;

    await db.execute(
      `UPDATE shifts SET name = ?, code = ?, start_time = ?, end_time = ?, grace_period_minutes = ?, 
       break_duration_minutes = ?, weekly_off = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, code, start_time, end_time, grace_period_minutes, break_duration_minutes, weekly_off, status, id]
    );

    const [shift] = await db.execute('SELECT * FROM shifts WHERE id = ?', [id]);
    res.json(shift[0]);
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM shifts WHERE id = ?', [id]);
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Delete shift error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// ATTENDANCE POLICIES MANAGEMENT
// ============================================================================

exports.getAttendancePolicies = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const [policies] = await db.query(
      `SELECT * FROM attendance_policies ${whereClause} ORDER BY name LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM attendance_policies ${whereClause}`,
      params
    );

    res.json({ data: policies, total });
  } catch (error) {
    console.error('Get attendance policies error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAttendancePolicy = async (req, res) => {
  try {
    const { name, late_grace_minutes, early_leave_grace_minutes, overtime_threshold, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO attendance_policies (name, late_grace_minutes, early_leave_grace_minutes, overtime_threshold, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, late_grace_minutes || 15, early_leave_grace_minutes || 15, overtime_threshold || 8.00, status || 'active']
    );

    const [policy] = await db.execute('SELECT * FROM attendance_policies WHERE id = ?', [result.insertId]);
    res.status(201).json(policy[0]);
  } catch (error) {
    console.error('Create attendance policy error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAttendancePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, late_grace_minutes, early_leave_grace_minutes, overtime_threshold, status } = req.body;

    await db.execute(
      `UPDATE attendance_policies SET name = ?, late_grace_minutes = ?, early_leave_grace_minutes = ?, 
       overtime_threshold = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, late_grace_minutes, early_leave_grace_minutes, overtime_threshold, status, id]
    );

    const [policy] = await db.execute('SELECT * FROM attendance_policies WHERE id = ?', [id]);
    res.json(policy[0]);
  } catch (error) {
    console.error('Update attendance policy error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAttendancePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM attendance_policies WHERE id = ?', [id]);
    res.json({ message: 'Attendance policy deleted successfully' });
  } catch (error) {
    console.error('Delete attendance policy error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// SALARY COMPONENTS MANAGEMENT
// ============================================================================

exports.getSalaryComponents = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    const params = [];

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (type) {
      whereConditions.push('type = ?');
      params.push(type);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const [components] = await db.query(
      `SELECT * FROM salary_components ${whereClause} ORDER BY type, name LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM salary_components ${whereClause}`,
      params
    );

    res.json({ data: components, total });
  } catch (error) {
    console.error('Get salary components error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createSalaryComponent = async (req, res) => {
  try {
    const { name, type, is_taxable, is_percentage, percentage_of, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO salary_components (name, type, is_taxable, is_percentage, percentage_of, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, type, is_taxable || 1, is_percentage || 0, percentage_of || 0, status || 'active']
    );

    const [component] = await db.execute('SELECT * FROM salary_components WHERE id = ?', [result.insertId]);
    res.status(201).json(component[0]);
  } catch (error) {
    console.error('Create salary component error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, is_taxable, is_percentage, percentage_of, status } = req.body;

    await db.execute(
      `UPDATE salary_components SET name = ?, type = ?, is_taxable = ?, is_percentage = ?, 
       percentage_of = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, type, is_taxable, is_percentage, percentage_of, status, id]
    );

    const [component] = await db.execute('SELECT * FROM salary_components WHERE id = ?', [id]);
    res.json(component[0]);
  } catch (error) {
    console.error('Update salary component error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM salary_components WHERE id = ?', [id]);
    res.json({ message: 'Salary component deleted successfully' });
  } catch (error) {
    console.error('Delete salary component error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// PAYMENT METHODS MANAGEMENT
// ============================================================================

exports.getPaymentMethods = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const [methods] = await db.query(
      `SELECT * FROM payment_methods ${whereClause} ORDER BY name LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM payment_methods ${whereClause}`,
      params
    );

    res.json({ data: methods, total });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const { name, code, type, requires_bank_details, description, is_default, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO payment_methods (name, code, type, requires_bank_details, description, is_default, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, code, type || 'bank_transfer', requires_bank_details || 0, description || '', is_default || 0, status || 'active']
    );

    const [method] = await db.execute('SELECT * FROM payment_methods WHERE id = ?', [result.insertId]);
    res.status(201).json(method[0]);
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, type, requires_bank_details, description, is_default, status } = req.body;

    await db.execute(
      `UPDATE payment_methods SET name = ?, code = ?, type = ?, requires_bank_details = ?, 
       description = ?, is_default = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, code, type, requires_bank_details, description, is_default, status, id]
    );

    const [method] = await db.execute('SELECT * FROM payment_methods WHERE id = ?', [id]);
    res.json(method[0]);
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM payment_methods WHERE id = ?', [id]);
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// TAX SETTINGS MANAGEMENT
// ============================================================================

exports.getTaxSettings = async (req, res) => {
  try {
    const { status, tax_type, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    const params = [];

    if (status) {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (tax_type) {
      whereConditions.push('tax_type = ?');
      params.push(tax_type);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const [settings] = await db.query(
      `SELECT * FROM tax_settings ${whereClause} ORDER BY threshold_amount LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM tax_settings ${whereClause}`,
      params
    );

    res.json({ data: settings, total });
  } catch (error) {
    console.error('Get tax settings error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createTaxSetting = async (req, res) => {
  try {
    const { name, code, tax_type, calculation_method, percentage, threshold_amount, description, is_mandatory, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO tax_settings (name, code, tax_type, calculation_method, percentage, threshold_amount, description, is_mandatory, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, code, tax_type || 'income_tax', calculation_method || 'percentage', percentage || 0, threshold_amount || 0, description || '', is_mandatory || 1, status || 'active']
    );

    const [setting] = await db.execute('SELECT * FROM tax_settings WHERE id = ?', [result.insertId]);
    res.status(201).json(setting[0]);
  } catch (error) {
    console.error('Create tax setting error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaxSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, tax_type, calculation_method, percentage, threshold_amount, description, is_mandatory, status } = req.body;

    await db.execute(
      `UPDATE tax_settings SET name = ?, code = ?, tax_type = ?, calculation_method = ?, percentage = ?, 
       threshold_amount = ?, description = ?, is_mandatory = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, code, tax_type, calculation_method, percentage, threshold_amount, description, is_mandatory, status, id]
    );

    const [setting] = await db.execute('SELECT * FROM tax_settings WHERE id = ?', [id]);
    res.json(setting[0]);
  } catch (error) {
    console.error('Update tax setting error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaxSetting = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM tax_settings WHERE id = ?', [id]);
    res.json({ message: 'Tax setting deleted successfully' });
  } catch (error) {
    console.error('Delete tax setting error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// CONFIGURATION SUMMARY
// ============================================================================

exports.getConfigurationSummary = async (req, res) => {
  try {
    const [[shifts]] = await db.execute('SELECT COUNT(*) as total FROM shifts WHERE status = "active"');
    const [[policies]] = await db.execute('SELECT COUNT(*) as total FROM attendance_policies WHERE status = "active"');
    const [[components]] = await db.execute('SELECT COUNT(*) as total FROM salary_components WHERE status = "active"');
    const [[methods]] = await db.execute('SELECT COUNT(*) as total FROM payment_methods WHERE status = "active"');
    const [[taxes]] = await db.execute('SELECT COUNT(*) as total FROM tax_settings WHERE status = "active"');
    const [[departments]] = await db.execute('SELECT COUNT(*) as total FROM departments WHERE status = "active"');
    const [[branches]] = await db.execute('SELECT COUNT(*) as total FROM branches WHERE status = "active"');
    const [[designations]] = await db.execute('SELECT COUNT(*) as total FROM designations WHERE status = "active"');
    const [[leaveTypes]] = await db.execute('SELECT COUNT(*) as total FROM leave_types WHERE status = "active"');

    res.json({
      summary: {
        shifts: shifts.total,
        attendance_policies: policies.total,
        salary_components: components.total,
        payment_methods: methods.total,
        tax_settings: taxes.total,
        departments: departments.total,
        branches: branches.total,
        designations: designations.total,
        leave_types: leaveTypes.total,
      }
    });
  } catch (error) {
    console.error('Get configuration summary error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// NEW CONFIGURATION TYPES - Generic GET methods
// ============================================================================

// Generic getter for all new configuration tables
// Generic getter helper (NOT async itself, but returns async function)
const getGeneric = (tableName) => {
  return async (req, res) => {
    try {
      const { status, page = 1, limit = 100 } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = '';
      const params = [];

      if (status) {
        whereClause = 'WHERE status = ?';
        params.push(status);
      }

      const [items] = await db.query(
        `SELECT * FROM ${tableName} ${whereClause} ORDER BY name LIMIT ${parseInt(limit)} OFFSET ${offset}`,
        params
      );

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`,
        params
      );

      res.json({ data: items, total });
    } catch (error) {
      console.error(`Get ${tableName} error:`, error);
      res.status(500).json({ error: error.message });
    }
  };
};

// Export all new configuration type getters
exports.getLeavePolicies = getGeneric('leave_policies');
exports.getJobCategories = getGeneric('job_categories');
exports.getJobTypes = getGeneric('job_types');
exports.getHiringStages = getGeneric('hiring_stages');
exports.getKPIIndicators = getGeneric('kpi_indicators');
exports.getReviewCycles = getGeneric('review_cycles');
exports.getGoalCategories = getGeneric('goal_categories');
exports.getTrainingTypes = getGeneric('training_types');
exports.getDocumentTypes = getGeneric('document_types');
exports.getCompanyPolicies = getGeneric('company_policies');
exports.getAwardTypes = getGeneric('award_types');
exports.getTerminationTypes = getGeneric('termination_types');
exports.getTerminationReasons = getGeneric('termination_reasons');
exports.getExpenseCategories = getGeneric('expense_categories');
exports.getExpenseLimits = getGeneric('expense_limits');
exports.getIncomeCategories = getGeneric('income_categories');
exports.getIncomeSources = getGeneric('income_sources');
exports.getContractTypes = getGeneric('contract_types');
exports.getMessageTemplates = getGeneric('message_templates');
exports.getNotificationSettings = getGeneric('notification_settings');

module.exports = exports;

