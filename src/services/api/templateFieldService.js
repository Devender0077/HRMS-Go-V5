import { apiClient } from './authService';

const templateFieldService = {
  // Get all fields for a template
  getByTemplate: async (templateId) => {
    const response = await apiClient.get(`/template-fields/template/${templateId}`);
    // Transform camelCase from backend to snake_case for frontend
    const fields = response.data.data || [];
    return fields.map(field => ({
      id: field.id,
      template_id: field.templateId,
      field_name: field.fieldName,
      field_type: field.fieldType,
      x_pos: field.xPosition,
      y_pos: field.yPosition,
      width: field.width,
      height: field.height,
      page_number: field.pageNumber,
      is_required: field.required,
    }));
  },

  // Create a single field
  create: async (templateId, fieldData) => {
    const response = await apiClient.post('/template-fields', {
      templateId, // camelCase for Sequelize
      ...fieldData,
    });
    // Transform response back to snake_case
    const field = response.data.data;
    return {
      id: field.id,
      template_id: field.templateId,
      field_name: field.fieldName,
      field_type: field.fieldType,
      x_pos: field.xPosition,
      y_pos: field.yPosition,
      width: field.width,
      height: field.height,
      page_number: field.pageNumber,
      is_required: field.required,
    };
  },

  // Update a field
  update: async (fieldId, fieldData) => {
    const response = await apiClient.put(`/template-fields/${fieldId}`, fieldData);
    return response.data.data;
  },

  // Delete a field
  delete: async (fieldId) => {
    const response = await apiClient.delete(`/template-fields/${fieldId}`);
    return response.data;
  },

  // Bulk create/update fields
  bulkUpdate: async (templateId, fields) => {
    // First, delete all existing fields for this template
    try {
      const existingFields = await templateFieldService.getByTemplate(templateId);
      await Promise.all(
        existingFields.map(field => templateFieldService.delete(field.id))
      );
    } catch (error) {
      // No existing fields, that's okay
      console.log('No existing fields to delete');
    }

    // Then create new fields
    // Transform snake_case to camelCase for Sequelize model
    const results = await Promise.all(
      fields.map(field => templateFieldService.create(templateId, {
        fieldName: field.field_name,
        fieldType: field.field_type,
        xPosition: field.x_pos, // camelCase for Sequelize
        yPosition: field.y_pos, // camelCase for Sequelize
        width: field.width,
        height: field.height,
        pageNumber: field.page_number,
        required: field.is_required || false,
      }))
    );

    return results;
  },
};

export default templateFieldService;

