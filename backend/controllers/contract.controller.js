const Contract = require('../models/Contract');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');

// Get all contracts
exports.getAll = async (req, res) => {
  try {
    console.log('📋 Fetching contracts...');
    const { page = 1, limit = 10, status, employeeId, contractType } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status && status !== 'all') where.status = status;
    if (employeeId) where.employeeId = employeeId;
    if (contractType && contractType !== 'all') where.contractType = contractType;

    const contracts = await Contract.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'first_name', 'last_name', 'employee_id'],
        required: false, // LEFT JOIN instead of INNER JOIN
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    console.log(`✅ Found ${contracts.length} contracts`);

    const totalCount = await Contract.count({ where });

    // Transform data with better logging
    const formattedContracts = contracts.map(contract => {
      const contractData = contract.get({ plain: true });
      console.log('📄 Contract:', {
        id: contractData.id,
        employeeId: contractData.employeeId,
        employee: contractData.employee,
      });

      return {
        id: contractData.id,
        employeeId: contractData.employeeId,
        employeeName: contractData.employee 
          ? `${contractData.employee.first_name} ${contractData.employee.last_name}` 
          : 'No Employee Assigned',
        employeeCode: contractData.employee?.employee_id || '-',
        type: contractData.contractType,
        startDate: contractData.startDate,
        endDate: contractData.endDate || null,
        duration: calculateDuration(contractData.startDate, contractData.endDate),
        salary: contractData.salary,
        status: contractData.status,
        terms: contractData.terms,
        createdAt: contractData.createdAt,
        updatedAt: contractData.updatedAt,
      };
    });

    console.log('📤 Sending formatted contracts:', formattedContracts.length);

    res.json({
      success: true,
      data: {
        contracts: formattedContracts,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get contracts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contracts',
      error: error.message,
    });
  }
};

// Get contract by ID
exports.getById = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'first_name', 'last_name', 'employee_id', 'email'],
      }],
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    res.json({
      success: true,
      data: contract,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract',
      error: error.message,
    });
  }
};

// Create contract
exports.create = async (req, res) => {
  try {
    console.log('➕ Creating contract:', req.body);
    console.log('📎 Uploaded file:', req.file);

    const contractData = {
      ...req.body,
      filePath: req.file ? `/uploads/contracts/${req.file.filename}` : null,
    };

    const contract = await Contract.create(contractData);

    console.log('✅ Contract created:', contract.id);

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: contract,
    });
  } catch (error) {
    console.error('❌ Create contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contract',
      error: error.message,
    });
  }
};

// Update contract
exports.update = async (req, res) => {
  try {
    console.log('✏️ Updating contract:', req.params.id);
    console.log('📎 Uploaded file:', req.file);

    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    const updateData = {
      ...req.body,
    };

    // If new file uploaded, update file path
    if (req.file) {
      updateData.filePath = `/uploads/contracts/${req.file.filename}`;
      console.log('✅ New file uploaded:', updateData.filePath);
    }

    await contract.update(updateData);

    console.log('✅ Contract updated:', contract.id);

    res.json({
      success: true,
      message: 'Contract updated successfully',
      data: contract,
    });
  } catch (error) {
    console.error('❌ Update contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contract',
      error: error.message,
    });
  }
};

// Delete contract
exports.delete = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    await contract.destroy();

    res.json({
      success: true,
      message: 'Contract deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contract',
      error: error.message,
    });
  }
};

// Helper function
function calculateDuration(startDate, endDate) {
  if (!endDate) return 'Indefinite';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (months < 1) return `${Math.ceil((end - start) / (1000 * 60 * 60 * 24))} days`;
  if (months < 12) return `${months} months`;
  return `${Math.floor(months / 12)} years ${months % 12} months`;
}

