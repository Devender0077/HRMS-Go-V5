const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const WorkflowSetting = sequelize.define('WorkflowSetting', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  // Leave Approval
  leaveAutoApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'leave_auto_approval',
  },
  leaveApprovalChain: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'leave_approval_chain',
    comment: 'Array of approval levels: ["reporting_manager", "hr_manager", "admin"]',
  },
  leaveRequiresManagerApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'leave_requires_manager_approval',
  },
  leaveRequiresHrApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'leave_requires_hr_approval',
  },
  
  // Attendance Approval
  attendanceAutoApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'attendance_auto_approval',
  },
  attendanceRequiresManagerApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'attendance_requires_manager_approval',
  },
  
  // Expense Approval
  expenseAutoApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'expense_auto_approval',
  },
  expenseApprovalLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'expense_approval_limit',
    comment: 'Auto-approve expenses below this amount',
  },
  expenseRequiresManagerApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'expense_requires_manager_approval',
  },
  expenseRequiresFinanceApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'expense_requires_finance_approval',
  },
  
  // Document Approval
  documentAutoApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'document_auto_approval',
  },
  documentRequiresHrApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'document_requires_hr_approval',
  },
  
  // Notification Settings
  notifyApproversEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_approvers_email',
  },
  notifyApproversPush: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_approvers_push',
  },
  notifyRequesterOnApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_requester_on_approval',
  },
  notifyRequesterOnRejection: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notify_requester_on_rejection',
  },
  
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'workflow_settings',
  timestamps: true,
  underscored: true,
});

module.exports = WorkflowSetting;

