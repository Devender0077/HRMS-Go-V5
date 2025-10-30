import { apiClient } from './authService';

/**
 * Contract Template Service
 * Manages reusable contract templates
 */
class ContractTemplateService {
  /**
   * Get all templates
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/contract-templates', { params });
      return {
        success: true,
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
        currentPage: response.data?.currentPage || 1,
        totalPages: response.data?.totalPages || 1,
      };
    } catch (error) {
      console.error('❌ Get templates error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates',
        error,
      };
    }
  }

  /**
   * Get template by ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/contract-templates/${id}`);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('❌ Get template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch template',
        error,
      };
    }
  }

  /**
   * Get templates by category
   */
  async getByCategory(category) {
    try {
      const response = await apiClient.get(`/contract-templates/category/${category}`);
      return {
        success: true,
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
      };
    } catch (error) {
      console.error('❌ Get by category error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates',
        error,
      };
    }
  }

  /**
   * Get templates by region
   */
  async getByRegion(region) {
    try {
      const response = await apiClient.get(`/contract-templates/region/${region}`);
      return {
        success: true,
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
      };
    } catch (error) {
      console.error('❌ Get by region error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch templates',
        error,
      };
    }
  }

  /**
   * Create template
   */
  async create(formData) {
    try {
      const response = await apiClient.post('/contract-templates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Template created successfully',
      };
    } catch (error) {
      console.error('❌ Create template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create template',
        error,
      };
    }
  }

  /**
   * Update template
   */
  async update(id, formData) {
    try {
      const response = await apiClient.put(`/contract-templates/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Template updated successfully',
      };
    } catch (error) {
      console.error('❌ Update template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update template',
        error,
      };
    }
  }

  /**
   * Delete template
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/contract-templates/${id}`);
      return {
        success: true,
        message: response.data?.message || 'Template deleted successfully',
      };
    } catch (error) {
      console.error('❌ Delete template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete template',
        error,
      };
    }
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    try {
      const response = await apiClient.post(`/contract-templates/${id}/toggle-active`);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Template status updated',
      };
    } catch (error) {
      console.error('❌ Toggle active error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle status',
        error,
      };
    }
  }

  /**
   * Duplicate template
   */
  async duplicate(id) {
    try {
      const response = await apiClient.post(`/contract-templates/${id}/duplicate`);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Template duplicated successfully',
      };
    } catch (error) {
      console.error('❌ Duplicate template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to duplicate template',
        error,
      };
    }
  }
}

export default new ContractTemplateService();

