import { apiClient } from './authService';

const templateFieldService = {
  // Get all fields for a template
  getByTemplate: async (templateId) => {
    const response = await apiClient.get(`/api/template-fields/template/${templateId}`);
    return response.data.data;
  },

  // Create a single field
  create: async (templateId, fieldData) => {
    const response = await apiClient.post('/api/template-fields', {
      template_id: templateId,
      ...fieldData,
    });
    return response.data.data;
  },

  // Update a field
  update: async (fieldId, fieldData) => {
    const response = await apiClient.put(`/api/template-fields/${fieldId}`, fieldData);
    return response.data.data;
  },

  // Delete a field
  delete: async (fieldId) => {
    const response = await apiClient.delete(`/api/template-fields/${fieldId}`);
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
    const results = await Promise.all(
      fields.map(field => templateFieldService.create(templateId, {
        field_name: field.field_name,
        field_type: field.field_type,
        x_pos: field.x_pos,
        y_pos: field.y_pos,
        width: field.width,
        height: field.height,
        page_number: field.page_number,
        is_required: field.is_required,
      }))
    );

    return results;
  },
};

export default templateFieldService;

