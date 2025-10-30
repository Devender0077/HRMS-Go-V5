const EmployeeOnboardingDocument = require('../models/EmployeeOnboardingDocument');
const ContractInstance = require('../models/ContractInstance');
const Employee = require('../models/Employee');
const onboardingAutomationService = require('../services/onboardingAutomationService');

// Get my onboarding documents (for logged-in employee)
exports.getMyDocuments = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    console.log(`📋 Fetching onboarding documents for user ${user.id}`);

    // Find employee by user_id
    const employee = await Employee.findOne({
      where: { user_id: user.id },
    });

    if (!employee) {
      return res.json({
        success: true,
        data: [],
        message: 'No employee profile found',
      });
    }

    const documents = await EmployeeOnboardingDocument.findAll({
      where: { employeeId: employee.id },
      include: [{
        model: ContractInstance,
        as: 'contractInstance',
      }],
      order: [['status', 'ASC'], ['dueDate', 'ASC']],
    });

    console.log(`✅ Found ${documents.length} onboarding documents`);

    res.json({
      success: true,
      data: documents,
      totalCount: documents.length,
    });
  } catch (error) {
    console.error('❌ Get my documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch onboarding documents',
      error: error.message,
    });
  }
};

// Get onboarding progress for an employee (HR view)
exports.getEmployeeProgress = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const documents = await EmployeeOnboardingDocument.findAll({
      where: { employeeId },
      include: [{
        model: ContractInstance,
        as: 'contractInstance',
      }],
    });

    const stats = {
      total: documents.length,
      completed: documents.filter(d => d.status === 'completed').length,
      pending: documents.filter(d => d.status === 'pending' || d.status === 'sent').length,
      in_progress: documents.filter(d => d.status === 'in_progress').length,
      overdue: documents.filter(d => d.status === 'overdue').length,
      waived: documents.filter(d => d.status === 'waived').length,
    };

    const completionPercentage = stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        documents,
        stats,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error('❌ Get employee progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee progress',
      error: error.message,
    });
  }
};

// Create onboarding checklist for employee
exports.createChecklist = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const result = await onboardingAutomationService.createOnboardingChecklist(employee);

    if (result.success) {
      res.json({
        success: true,
        message: 'Onboarding checklist created successfully',
        data: result.documents,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create onboarding checklist',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('❌ Create checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create onboarding checklist',
      error: error.message,
    });
  }
};

// Send onboarding documents to employee
exports.sendDocuments = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const result = await onboardingAutomationService.sendOnboardingDocuments(employeeId);

    if (result.success) {
      res.json({
        success: true,
        message: `Sent ${result.sentCount} onboarding documents successfully`,
        sentCount: result.sentCount,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send onboarding documents',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('❌ Send documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send onboarding documents',
      error: error.message,
    });
  }
};

// Waive a document (HR only)
exports.waive = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const document = await EmployeeOnboardingDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    document.status = 'waived';
    document.waivedAt = new Date();
    document.waivedBy = req.user?.id;
    document.waiveReason = reason;
    await document.save();

    console.log(`✅ Document waived: ${id}`);

    res.json({
      success: true,
      message: 'Document waived successfully',
      data: document,
    });
  } catch (error) {
    console.error('❌ Waive document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to waive document',
      error: error.message,
    });
  }
};

