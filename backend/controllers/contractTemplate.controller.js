const ContractTemplate = require('../models/ContractTemplate');
const TemplateField = require('../models/TemplateField');
const { Op } = require('sequelize');

// Get all templates
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      region = '',
      status = 'all',
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category && category !== 'all') {
      whereConditions.category = category;
    }

    if (region && region !== 'all') {
      whereConditions.region = region;
    }

    if (status === 'active') {
      whereConditions.isActive = true;
    } else if (status === 'inactive') {
      whereConditions.isActive = false;
    }

    const { count, rows: templates } = await ContractTemplate.findAndCountAll({
      where: whereConditions,
      include: [{
        model: TemplateField,
        as: 'fields',
        attributes: ['id', 'fieldName', 'fieldType', 'required'],
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    console.log(`📋 Found ${count} contract templates`);

    res.json({
      success: true,
      data: templates,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('❌ Get contract templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract templates',
      error: error.message,
    });
  }
};

// Get template by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ContractTemplate.findByPk(id, {
      include: [{
        model: TemplateField,
        as: 'fields',
        order: [['pageNumber', 'ASC'], ['yPosition', 'ASC']],
      }],
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    console.log(`✅ Template found: ${template.name}`);

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('❌ Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message,
    });
  }
};

// Create template
exports.create = async (req, res) => {
  try {
    console.log('➕ Creating contract template:', req.body);
    console.log('📎 Uploaded file:', req.file);

    const templateData = {
      ...req.body,
      filePath: req.file ? `/uploads/contract-templates/${req.file.filename}` : null,
      fileType: req.file ? req.file.mimetype : null,
      fileSize: req.file ? req.file.size : null,
      createdBy: req.user?.id,
    };

    const template = await ContractTemplate.create(templateData);

    console.log('✅ Contract template created:', template.id);

    res.status(201).json({
      success: true,
      message: 'Contract template created successfully',
      data: template,
    });
  } catch (error) {
    console.error('❌ Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contract template',
      error: error.message,
    });
  }
};

// Update template
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Updating contract template:', id);
    console.log('📎 Uploaded file:', req.file);

    const template = await ContractTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    const updateData = { ...req.body };

    // If new file uploaded, update file info
    if (req.file) {
      updateData.filePath = `/uploads/contract-templates/${req.file.filename}`;
      updateData.fileType = req.file.mimetype;
      updateData.fileSize = req.file.size;
      console.log('✅ New file uploaded:', updateData.filePath);
    }

    await template.update(updateData);

    console.log('✅ Contract template updated:', template.id);

    res.json({
      success: true,
      message: 'Contract template updated successfully',
      data: template,
    });
  } catch (error) {
    console.error('❌ Update template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contract template',
      error: error.message,
    });
  }
};

// Delete template
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ContractTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    await template.destroy();

    console.log('✅ Contract template deleted:', id);

    res.json({
      success: true,
      message: 'Contract template deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contract template',
      error: error.message,
    });
  }
};

// Toggle template active status
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ContractTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    template.isActive = !template.isActive;
    await template.save();

    console.log(`✅ Template ${template.isActive ? 'activated' : 'deactivated'}:`, id);

    res.json({
      success: true,
      message: `Template ${template.isActive ? 'activated' : 'deactivated'} successfully`,
      data: template,
    });
  } catch (error) {
    console.error('❌ Toggle active error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle template status',
      error: error.message,
    });
  }
};

// Duplicate template
exports.duplicate = async (req, res) => {
  try {
    const { id } = req.params;

    const original = await ContractTemplate.findByPk(id, {
      include: [{
        model: TemplateField,
        as: 'fields',
      }],
    });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Contract template not found',
      });
    }

    // Create duplicate template
    const duplicateData = {
      name: `${original.name} (Copy)`,
      description: original.description,
      category: original.category,
      region: original.region,
      filePath: original.filePath,
      fileType: original.fileType,
      fileSize: original.fileSize,
      isActive: false, // Start as inactive
      createdBy: req.user?.id,
    };

    const duplicate = await ContractTemplate.create(duplicateData);

    // Duplicate fields if any
    if (original.fields && original.fields.length > 0) {
      const fieldsToCreate = original.fields.map(field => ({
        templateId: duplicate.id,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        fieldLabel: field.fieldLabel,
        required: field.required,
        pageNumber: field.pageNumber,
        xPosition: field.xPosition,
        yPosition: field.yPosition,
        width: field.width,
        height: field.height,
        defaultValue: field.defaultValue,
        validationRules: field.validationRules,
        placeholder: field.placeholder,
      }));

      await TemplateField.bulkCreate(fieldsToCreate);
    }

    console.log('✅ Template duplicated:', duplicate.id);

    res.status(201).json({
      success: true,
      message: 'Template duplicated successfully',
      data: duplicate,
    });
  } catch (error) {
    console.error('❌ Duplicate template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate template',
      error: error.message,
    });
  }
};

// Get templates by category
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const templates = await ContractTemplate.findAll({
      where: {
        category,
        isActive: true,
      },
      order: [['name', 'ASC']],
    });

    console.log(`📋 Found ${templates.length} templates in category: ${category}`);

    res.json({
      success: true,
      data: templates,
      totalCount: templates.length,
    });
  } catch (error) {
    console.error('❌ Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates by category',
      error: error.message,
    });
  }
};

// Get templates by region
exports.getByRegion = async (req, res) => {
  try {
    const { region } = req.params;

    const templates = await ContractTemplate.findAll({
      where: {
        [Op.or]: [
          { region },
          { region: 'global' }, // Include global templates
        ],
        isActive: true,
      },
      order: [['category', 'ASC'], ['name', 'ASC']],
    });

    console.log(`📋 Found ${templates.length} templates for region: ${region}`);

    res.json({
      success: true,
      data: templates,
      totalCount: templates.length,
    });
  } catch (error) {
    console.error('❌ Get by region error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates by region',
      error: error.message,
    });
  }
};

