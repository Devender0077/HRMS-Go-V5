const Expense = require('../models/Expense');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all expenses
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, employeeId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') where.category = category;
    if (employeeId) where.employeeId = employeeId;

    const expenses = await Expense.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'first_name', 'last_name', 'employee_id'],
      }],
      order: [['expense_date', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    const totalCount = await Expense.count({ where });

    const formattedExpenses = expenses.map(expense => ({
      id: expense.id,
      employeeId: expense.employeeId,
      employeeName: expense.employee ? `${expense.employee.first_name} ${expense.employee.last_name}` : 'Unknown',
      employeeCode: expense.employee?.employee_id || '',
      category: expense.category,
      description: expense.description,
      amount: parseFloat(expense.amount),
      expenseDate: expense.expenseDate,
      date: expense.expenseDate, // Alias
      status: expense.status,
      approvedBy: expense.approvedBy,
      approvedAt: expense.approvedAt,
      rejectionReason: expense.rejectionReason,
      receiptPath: expense.receiptPath,
      notes: expense.notes,
    }));

    res.json({
      success: true,
      data: {
        expenses: formattedExpenses,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
};

// Get expense by ID
exports.getById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'first_name', 'last_name', 'employee_id', 'email'],
      }],
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense',
      error: error.message,
    });
  }
};

// Create expense
exports.create = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
};

// Update expense
exports.update = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    await expense.update(req.body);

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
};

// Delete expense
exports.delete = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    await expense.destroy();

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
};

// Approve expense
exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const approverId = req.user?.id;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    await expense.update({
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date(),
    });

    // Notify employee
    try {
      const employee = await Employee.findByPk(expense.employeeId);
      if (employee && employee.user_id) {
        await Notification.create({
          userId: employee.user_id,
          type: 'expense_approved',
          title: 'Expense Approved',
          description: `Your expense claim of ₹${expense.amount} has been approved`,
          relatedId: expense.id,
          relatedType: 'expense',
          isRead: false,
        }, {
          fields: ['userId', 'type', 'title', 'description', 'relatedId', 'relatedType', 'isRead', 'createdAt', 'updatedAt']
        });
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Expense approved successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Approve expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve expense',
      error: error.message,
    });
  }
};

// Reject expense
exports.reject = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const approverId = req.user?.id;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    await expense.update({
      status: 'rejected',
      approvedBy: approverId,
      approvedAt: new Date(),
      rejectionReason: rejectionReason || 'No reason provided',
    });

    // Notify employee
    try {
      const employee = await Employee.findByPk(expense.employeeId);
      if (employee && employee.user_id) {
        await Notification.create({
          userId: employee.user_id,
          type: 'expense_rejected',
          title: 'Expense Rejected',
          description: `Your expense claim of ₹${expense.amount} has been rejected${rejectionReason ? `: ${rejectionReason}` : ''}`,
          relatedId: expense.id,
          relatedType: 'expense',
          isRead: false,
        }, {
          fields: ['userId', 'type', 'title', 'description', 'relatedId', 'relatedType', 'isRead', 'createdAt', 'updatedAt']
        });
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Expense rejected successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Reject expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject expense',
      error: error.message,
    });
  }
};

