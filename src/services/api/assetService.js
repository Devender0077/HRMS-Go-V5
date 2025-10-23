import axios from '../../utils/axios';

// Asset endpoints
export const assetService = {
  // Get all assets
  getAssets: async (params = {}) => {
    try {
      const response = await axios.get('/api/assets', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  // Get asset by ID
  getAssetById: async (id) => {
    try {
      const response = await axios.get(`/api/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  // Create asset
  createAsset: async (data) => {
    try {
      const response = await axios.post('/api/assets', data);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  // Update asset
  updateAsset: async (id, data) => {
    try {
      const response = await axios.put(`/api/assets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  // Delete asset
  deleteAsset: async (id) => {
    try {
      const response = await axios.delete(`/api/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  // Get asset statistics
  getStatistics: async () => {
    try {
      const response = await axios.get('/api/assets/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },
};

// Asset Category endpoints
export const assetCategoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      const response = await axios.get('/api/asset-categories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/api/asset-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Create category
  createCategory: async (data) => {
    try {
      const response = await axios.post('/api/asset-categories', data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, data) => {
    try {
      const response = await axios.put(`/api/asset-categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`/api/asset-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// Asset Assignment endpoints
export const assetAssignmentService = {
  // Get all assignments
  getAssignments: async (params = {}) => {
    try {
      const response = await axios.get('/api/asset-assignments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Get assignment by ID
  getAssignmentById: async (id) => {
    try {
      const response = await axios.get(`/api/asset-assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  // Create assignment (assign asset)
  assignAsset: async (data) => {
    try {
      const response = await axios.post('/api/asset-assignments', data);
      return response.data;
    } catch (error) {
      console.error('Error assigning asset:', error);
      throw error;
    }
  },

  // Return asset
  returnAsset: async (id, data) => {
    try {
      const response = await axios.put(`/api/asset-assignments/${id}/return`, data);
      return response.data;
    } catch (error) {
      console.error('Error returning asset:', error);
      throw error;
    }
  },

  // Transfer asset
  transferAsset: async (id, data) => {
    try {
      const response = await axios.put(`/api/asset-assignments/${id}/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring asset:', error);
      throw error;
    }
  },

  // Delete assignment
  deleteAssignment: async (id) => {
    try {
      const response = await axios.delete(`/api/asset-assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
};

// Asset Maintenance endpoints
export const assetMaintenanceService = {
  // Get all maintenance records
  getMaintenance: async (params = {}) => {
    try {
      const response = await axios.get('/api/asset-maintenance', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      throw error;
    }
  },

  // Get upcoming maintenance
  getUpcomingMaintenance: async () => {
    try {
      const response = await axios.get('/api/asset-maintenance/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming maintenance:', error);
      throw error;
    }
  },

  // Get maintenance by ID
  getMaintenanceById: async (id) => {
    try {
      const response = await axios.get(`/api/asset-maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance record:', error);
      throw error;
    }
  },

  // Create maintenance
  createMaintenance: async (data) => {
    try {
      const response = await axios.post('/api/asset-maintenance', data);
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      throw error;
    }
  },

  // Update maintenance
  updateMaintenance: async (id, data) => {
    try {
      const response = await axios.put(`/api/asset-maintenance/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      throw error;
    }
  },

  // Delete maintenance
  deleteMaintenance: async (id) => {
    try {
      const response = await axios.delete(`/api/asset-maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      throw error;
    }
  },
};

export default {
  assetService,
  assetCategoryService,
  assetAssignmentService,
  assetMaintenanceService,
};

