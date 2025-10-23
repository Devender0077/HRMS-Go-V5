import axios from 'axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/assets`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Assets Service
class AssetsService {
  /**
   * Get all assets
   * @returns {Promise} Assets list
   */
  async getAssets() {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching assets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assets',
        error,
      };
    }
  }

  /**
   * Get asset by ID
   * @param {string} id - Asset ID
   * @returns {Promise} Asset details
   */
  async getAsset(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset',
        error,
      };
    }
  }

  /**
   * Create asset
   * @param {Object} asset - Asset data
   * @returns {Promise} Create response
   */
  async createAsset(asset) {
    try {
      const response = await apiClient.post('/', asset);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create asset',
        error,
      };
    }
  }

  /**
   * Update asset
   * @param {string} id - Asset ID
   * @param {Object} asset - Updated asset data
   * @returns {Promise} Update response
   */
  async updateAsset(id, asset) {
    try {
      const response = await apiClient.put(`/${id}`, asset);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update asset',
        error,
      };
    }
  }

  /**
   * Delete asset
   * @param {string} id - Asset ID
   * @returns {Promise} Delete response
   */
  async deleteAsset(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete asset',
        error,
      };
    }
  }

  /**
   * Get asset categories
   * @returns {Promise} Categories list
   */
  async getAssetCategories() {
    try {
      const response = await apiClient.get('/categories');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset categories',
        error,
      };
    }
  }

  /**
   * Create asset category
   * @param {Object} category - Category data
   * @returns {Promise} Create response
   */
  async createAssetCategory(category) {
    try {
      const response = await apiClient.post('/categories', category);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating asset category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create asset category',
        error,
      };
    }
  }

  /**
   * Update asset category
   * @param {string} id - Category ID
   * @param {Object} category - Updated category data
   * @returns {Promise} Update response
   */
  async updateAssetCategory(id, category) {
    try {
      const response = await apiClient.put(`/categories/${id}`, category);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating asset category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update asset category',
        error,
      };
    }
  }

  /**
   * Delete asset category
   * @param {string} id - Category ID
   * @returns {Promise} Delete response
   */
  async deleteAssetCategory(id) {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting asset category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete asset category',
        error,
      };
    }
  }

  /**
   * Get asset assignments
   * @returns {Promise} Assignments list
   */
  async getAssetAssignments() {
    try {
      const response = await apiClient.get('/assignments');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching asset assignments:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset assignments',
        error,
      };
    }
  }

  /**
   * Assign asset to employee
   * @param {Object} assignment - Assignment data
   * @returns {Promise} Create response
   */
  async assignAsset(assignment) {
    try {
      const response = await apiClient.post('/assignments', assignment);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error assigning asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign asset',
        error,
      };
    }
  }

  /**
   * Update asset assignment
   * @param {string} id - Assignment ID
   * @param {Object} assignment - Updated assignment data
   * @returns {Promise} Update response
   */
  async updateAssetAssignment(id, assignment) {
    try {
      const response = await apiClient.put(`/assignments/${id}`, assignment);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating asset assignment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update asset assignment',
        error,
      };
    }
  }

  /**
   * Unassign asset
   * @param {string} id - Assignment ID
   * @returns {Promise} Delete response
   */
  async unassignAsset(id) {
    try {
      const response = await apiClient.delete(`/assignments/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error unassigning asset:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unassign asset',
        error,
      };
    }
  }

  /**
   * Get asset maintenance records
   * @returns {Promise} Maintenance records list
   */
  async getAssetMaintenance() {
    try {
      const response = await apiClient.get('/maintenance');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching asset maintenance:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset maintenance',
        error,
      };
    }
  }

  /**
   * Create maintenance record
   * @param {Object} maintenance - Maintenance data
   * @returns {Promise} Create response
   */
  async createMaintenanceRecord(maintenance) {
    try {
      const response = await apiClient.post('/maintenance', maintenance);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create maintenance record',
        error,
      };
    }
  }

  /**
   * Update maintenance record
   * @param {string} id - Maintenance ID
   * @param {Object} maintenance - Updated maintenance data
   * @returns {Promise} Update response
   */
  async updateMaintenanceRecord(id, maintenance) {
    try {
      const response = await apiClient.put(`/maintenance/${id}`, maintenance);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update maintenance record',
        error,
      };
    }
  }

  /**
   * Delete maintenance record
   * @param {string} id - Maintenance ID
   * @returns {Promise} Delete response
   */
  async deleteMaintenanceRecord(id) {
    try {
      const response = await apiClient.delete(`/maintenance/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete maintenance record',
        error,
      };
    }
  }

  /**
   * Get asset statistics
   * @returns {Promise} Statistics data
   */
  async getAssetStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching asset stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset stats',
        error,
      };
    }
  }

  /**
   * Search assets
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchAssets(query) {
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error searching assets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search assets',
        error,
      };
    }
  }
}

export default new AssetsService();
