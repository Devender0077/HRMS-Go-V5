const ContractInstance = require('../models/ContractInstance');
const ContractTemplate = require('../models/ContractTemplate');
const ContractAuditLog = require('../models/ContractAuditLog');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');
const contractEmailService = require('../services/contractEmailService');
const pdfService = require('../services/pdfService');

// Helper function to generate unique contract number
function generateContractNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `CONT-${timestamp}-${random}`;
}

// Helper function to log audit trail
async function logAudit(instanceId, action, performedBy, performedByName, ipAddress, userAgent, details = {}) {
  try {
    await ContractAuditLog.create({
      instanceId,
      action,
      performedBy,
      performedByName,
      ipAddress,
      userAgent,
      details,
    });
  } catch (error) {
    console.error('❌ Audit log error:', error);
  }
}

// Get all contract instances
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      recipientType = 'all',
    } = req.query;

    const offset = (page - 1) * limit;
    const user = req.user; // From auth middleware
    const userType = user?.userType || 'employee';

    console.log('=== Fetching Contract Instances ===');
    console.log('User type:', userType, 'User ID:', user?.id);

    // Build WHERE conditions
    const whereConditions = {};

    // Role-based filtering
    if (userType === 'employee') {
      // Employees can only see their own contracts
      whereConditions.recipientId = user.id;
      whereConditions.recipientType = 'employee';
    } else if (userType === 'manager') {
      // Managers can see team contracts (same department employees)
      // This requires a JOIN with employees table - will implement later
    }
    // HR, HR Manager, and Super Admin can see all contracts

    if (search) {
      whereConditions[Op.or] = [
        { contractNumber: { [Op.like]: `%${search}%` } },
        { title: { [Op.like]: `%${search}%` } },
        { recipientName: { [Op.like]: `%${search}%` } },
        { recipientEmail: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== 'all') {
      whereConditions.status = status;
    }

    if (recipientType && recipientType !== 'all') {
      whereConditions.recipientType = recipientType;
    }

    const { count, rows: instances } = await ContractInstance.findAndCountAll({
      where: whereConditions,
      include: [{
        model: ContractTemplate,
        as: 'template',
        attributes: ['id', 'name', 'category', 'region'],
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    console.log(`📋 Found ${count} contract instances`);

    res.json({
      success: true,
      data: instances,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('❌ Get contract instances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract instances',
      error: error.message,
    });
  }
};

// Get instance by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const instance = await ContractInstance.findByPk(id, {
      include: [
        {
          model: ContractTemplate,
          as: 'template',
        },
        {
          model: ContractAuditLog,
          as: 'auditLogs',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    console.log(`✅ Instance found: ${instance.contractNumber}`);

    res.json({
      success: true,
      data: instance,
    });
  } catch (error) {
    console.error('❌ Get instance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract instance',
      error: error.message,
    });
  }
};

// Create contract instance (send contract)
exports.create = async (req, res) => {
  try {
    console.log('➕ Creating contract instance:', req.body);

    const {
      templateId,
      title,
      recipientType,
      recipientId,
      recipientEmail,
      recipientName,
      expiresInDays = 7,
      metadata = {},
    } = req.body;

    // Validate template exists
    const template = await ContractTemplate.findByPk(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    // Generate unique contract number
    const contractNumber = generateContractNumber();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));

    const instanceData = {
      templateId,
      contractNumber,
      title: title || template.name,
      recipientType,
      recipientId,
      recipientEmail,
      recipientName,
      status: 'draft',
      expiresAt,
      originalFilePath: template.filePath,
      metadata,
      createdBy: req.user?.id,
    };

    const instance = await ContractInstance.create(instanceData);

    // Log audit trail
    await logAudit(
      instance.id,
      'created',
      req.user?.id,
      req.user?.name || 'System',
      req.ip,
      req.get('user-agent'),
      {
        templateName: template.name,
        recipientEmail,
      }
    );

    console.log('✅ Contract instance created:', instance.contractNumber);

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Create instance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contract instance',
      error: error.message,
    });
  }
};

// Send contract (change status to 'sent')
exports.send = async (req, res) => {
  try {
    const { id } = req.params;

    const instance = await ContractInstance.findByPk(id);

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    if (instance.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Contract has already been sent',
      });
    }

    instance.status = 'sent';
    instance.sentDate = new Date();
    await instance.save();

    // Log audit trail
    await logAudit(
      instance.id,
      'sent',
      req.user?.id,
      req.user?.name || 'System',
      req.ip,
      req.get('user-agent'),
      {
        recipientEmail: instance.recipientEmail,
      }
    );

    // Send email notification to recipient
    const emailResult = await contractEmailService.sendContract(instance.toJSON());
    
    if (!emailResult.success) {
      console.warn('⚠️ Email sending failed but contract marked as sent:', emailResult.error);
      // Don't fail the request, email can be resent later
    } else {
      console.log('✅ Email sent to recipient:', instance.recipientEmail);
    }

    console.log('✅ Contract sent:', instance.contractNumber);

    res.json({
      success: true,
      message: 'Contract sent successfully',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Send contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contract',
      error: error.message,
    });
  }
};

// Mark as viewed
exports.markViewed = async (req, res) => {
  try {
    const { id } = req.params;

    const instance = await ContractInstance.findByPk(id);

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    if (instance.status === 'sent' && !instance.viewedDate) {
      instance.status = 'viewed';
      instance.viewedDate = new Date();
      await instance.save();

      // Log audit trail
      await logAudit(
        instance.id,
        'viewed',
        req.user?.id,
        req.user?.name || instance.recipientName,
        req.ip,
        req.get('user-agent')
      );

      console.log('✅ Contract viewed:', instance.contractNumber);
    }

    res.json({
      success: true,
      message: 'Contract marked as viewed',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Mark viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark contract as viewed',
      error: error.message,
    });
  }
};

// Complete contract (after signing)
exports.complete = async (req, res) => {
  try {
    const { id } = req.params;
    const { signedFilePath } = req.body;

    const instance = await ContractInstance.findByPk(id);

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    instance.status = 'completed';
    instance.completedDate = new Date();
    instance.signedFilePath = signedFilePath;
    await instance.save();

    // Log audit trail
    await logAudit(
      instance.id,
      'completed',
      req.user?.id,
      req.user?.name || instance.recipientName,
      req.ip,
      req.get('user-agent'),
      {
        signedFilePath,
      }
    );

    console.log('✅ Contract completed:', instance.contractNumber);

    // Send completion notification email
    const emailResult = await contractEmailService.sendCompletionNotification(instance.toJSON());
    
    if (!emailResult.success) {
      console.warn('⚠️ Completion email failed:', emailResult.error);
    } else {
      console.log('✅ Completion email sent to:', instance.recipientEmail);
    }

    res.json({
      success: true,
      message: 'Contract completed successfully',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Complete contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete contract',
      error: error.message,
    });
  }
};

// Decline contract
exports.decline = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const instance = await ContractInstance.findByPk(id);

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    instance.status = 'declined';
    instance.declinedDate = new Date();
    instance.declineReason = reason;
    await instance.save();

    // Log audit trail
    await logAudit(
      instance.id,
      'declined',
      req.user?.id,
      req.user?.name || instance.recipientName,
      req.ip,
      req.get('user-agent'),
      {
        reason,
      }
    );

    console.log('✅ Contract declined:', instance.contractNumber);

    // TODO: Send declined notification email

    res.json({
      success: true,
      message: 'Contract declined',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Decline contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to decline contract',
      error: error.message,
    });
  }
};

// Cancel contract
exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;

    const instance = await ContractInstance.findByPk(id);

    if (!instance) {
      return res.status(404).json({
        success: false,
        message: 'Contract instance not found',
      });
    }

    if (instance.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed contract',
      });
    }

    instance.status = 'cancelled';
    await instance.save();

    // Log audit trail
    await logAudit(
      instance.id,
      'cancelled',
      req.user?.id,
      req.user?.name || 'System',
      req.ip,
      req.get('user-agent')
    );

    console.log('✅ Contract cancelled:', instance.contractNumber);

    res.json({
      success: true,
      message: 'Contract cancelled successfully',
      data: instance,
    });
  } catch (error) {
    console.error('❌ Cancel contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel contract',
      error: error.message,
    });
  }
};

// Get audit trail
exports.getAuditTrail = async (req, res) => {
  try {
    const { id } = req.params;

    const auditLogs = await ContractAuditLog.findAll({
      where: { instanceId: id },
      order: [['createdAt', 'DESC']],
    });

    console.log(`📋 Found ${auditLogs.length} audit log entries`);

    res.json({
      success: true,
      data: auditLogs,
      totalCount: auditLogs.length,
    });
  } catch (error) {
    console.error('❌ Get audit trail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit trail',
      error: error.message,
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const userType = user?.userType || 'employee';

    let whereConditions = {};

    // Filter based on user role
    if (userType === 'employee') {
      whereConditions.recipientId = user.id;
      whereConditions.recipientType = 'employee';
    }

    const [
      total,
      pending,
      completed,
      declined,
      expired,
    ] = await Promise.all([
      ContractInstance.count({ where: whereConditions }),
      ContractInstance.count({ where: { ...whereConditions, status: { [Op.in]: ['sent', 'viewed', 'in_progress'] } } }),
      ContractInstance.count({ where: { ...whereConditions, status: 'completed' } }),
      ContractInstance.count({ where: { ...whereConditions, status: 'declined' } }),
      ContractInstance.count({ where: { ...whereConditions, status: 'expired' } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        completed,
        declined,
        expired,
      },
    });
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

