const TemplateField = require('../models/TemplateField');
const ContractTemplate = require('../models/ContractTemplate');
const pdfService = require('../services/pdfService');

// Get all fields for a template
exports.getByTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const fields = await TemplateField.findAll({
      where: { templateId },
      order: [['pageNumber', 'ASC'], ['yPosition', 'ASC']],
    });

    console.log(`📋 Found ${fields.length} fields for template ${templateId}`);

    res.json({
      success: true,
      data: fields,
      totalCount: fields.length,
    });
  } catch (error) {
    console.error('❌ Get template fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template fields',
      error: error.message,
    });
  }
};

// Create field
exports.create = async (req, res) => {
  try {
    console.log('➕ Creating template field:', req.body);

    const field = await TemplateField.create(req.body);

    console.log('✅ Field created:', field.id);

    res.status(201).json({
      success: true,
      message: 'Field created successfully',
      data: field,
    });
  } catch (error) {
    console.error('❌ Create field error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create field',
      error: error.message,
    });
  }
};

// Update field
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await TemplateField.findByPk(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found',
      });
    }

    await field.update(req.body);

    console.log('✅ Field updated:', id);

    res.json({
      success: true,
      message: 'Field updated successfully',
      data: field,
    });
  } catch (error) {
    console.error('❌ Update field error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update field',
      error: error.message,
    });
  }
};

// Delete field
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await TemplateField.findByPk(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found',
      });
    }

    await field.destroy();

    console.log('✅ Field deleted:', id);

    res.json({
      success: true,
      message: 'Field deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete field error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete field',
      error: error.message,
    });
  }
};

// Bulk create/update fields
exports.bulkSave = async (req, res) => {
  try {
    const { templateId, fields } = req.body;

    console.log(`💾 Bulk saving ${fields.length} fields for template ${templateId}`);

    // Delete existing fields and create new ones
    await TemplateField.destroy({ where: { templateId } });

    const createdFields = await TemplateField.bulkCreate(
      fields.map(field => ({ ...field, templateId }))
    );

    console.log(`✅ ${createdFields.length} fields saved`);

    res.json({
      success: true,
      message: `${createdFields.length} fields saved successfully`,
      data: createdFields,
    });
  } catch (error) {
    console.error('❌ Bulk save fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save fields',
      error: error.message,
    });
  }
};

// Auto-detect fields in PDF (basic implementation)
exports.detectFields = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await ContractTemplate.findByPk(templateId);

    if (!template || !template.filePath) {
      return res.status(404).json({
        success: false,
        message: 'Template or file not found',
      });
    }

    // Get PDF metadata
    const metadata = await pdfService.getPDFMetadata(template.filePath);

    // Basic field detection (looking for common patterns)
    const detectedFields = [];

    // Example: Detect signature fields (in reality, this would use OCR or ML)
    // For now, return suggested field positions based on page size
    metadata.pages.forEach(page => {
      // Suggest employee name field at top
      detectedFields.push({
        fieldName: `employee_name_page_${page.number}`,
        fieldLabel: 'Employee Name',
        fieldType: 'text',
        pageNumber: page.number,
        xPosition: 50,
        yPosition: 100,
        width: 200,
        height: 30,
        required: true,
      });

      // Suggest date field
      detectedFields.push({
        fieldName: `date_page_${page.number}`,
        fieldLabel: 'Date',
        fieldType: 'date',
        pageNumber: page.number,
        xPosition: page.width - 250,
        yPosition: 100,
        width: 150,
        height: 30,
        required: true,
      });

      // Suggest signature field at bottom
      detectedFields.push({
        fieldName: `signature_page_${page.number}`,
        fieldLabel: 'Signature',
        fieldType: 'signature',
        pageNumber: page.number,
        xPosition: 50,
        yPosition: page.height - 150,
        width: 200,
        height: 60,
        required: true,
      });
    });

    console.log(`🔍 Detected ${detectedFields.length} suggested fields`);

    res.json({
      success: true,
      data: detectedFields,
      metadata,
      message: 'Field detection completed. Review and adjust as needed.',
    });
  } catch (error) {
    console.error('❌ Detect fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect fields',
      error: error.message,
    });
  }
};

