import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/contracts`,
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

// Contracts Service
class ContractsService {
  /**
   * Get all contracts
   * @returns {Promise} Contracts list
   */
  async getContracts() {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching contracts:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contracts',
        error,
      };
    }
  }

  /**
   * Get contract by ID
   * @param {string} id - Contract ID
   * @returns {Promise} Contract details
   */
  async getContract(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract',
        error,
      };
    }
  }

  /**
   * Create contract
   * @param {Object} contract - Contract data
   * @returns {Promise} Create response
   */
  async createContract(contract) {
    try {
      const response = await apiClient.post('/', contract);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract',
        error,
      };
    }
  }

  /**
   * Update contract
   * @param {string} id - Contract ID
   * @param {Object} contract - Updated contract data
   * @returns {Promise} Update response
   */
  async updateContract(id, contract) {
    try {
      const response = await apiClient.put(`/${id}`, contract);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract',
        error,
      };
    }
  }

  /**
   * Delete contract
   * @param {string} id - Contract ID
   * @returns {Promise} Delete response
   */
  async deleteContract(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract',
        error,
      };
    }
  }

  /**
   * Get contract types
   * @returns {Promise} Contract types list
   */
  async getContractTypes() {
    try {
      const response = await apiClient.get('/types');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching contract types:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract types',
        error,
      };
    }
  }

  /**
   * Create contract type
   * @param {Object} type - Contract type data
   * @returns {Promise} Create response
   */
  async createContractType(type) {
    try {
      const response = await apiClient.post('/types', type);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating contract type:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract type',
        error,
      };
    }
  }

  /**
   * Update contract type
   * @param {string} id - Contract type ID
   * @param {Object} type - Updated contract type data
   * @returns {Promise} Update response
   */
  async updateContractType(id, type) {
    try {
      const response = await apiClient.put(`/types/${id}`, type);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating contract type:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract type',
        error,
      };
    }
  }

  /**
   * Delete contract type
   * @param {string} id - Contract type ID
   * @returns {Promise} Delete response
   */
  async deleteContractType(id) {
    try {
      const response = await apiClient.delete(`/types/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting contract type:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract type',
        error,
      };
    }
  }

  /**
   * Get contract templates
   * @returns {Promise} Templates list
   */
  async getContractTemplates() {
    try {
      const response = await apiClient.get('/templates');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching contract templates:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract templates',
        error,
      };
    }
  }

  /**
   * Create contract template
   * @param {Object} template - Template data
   * @returns {Promise} Create response
   */
  async createContractTemplate(template) {
    try {
      const response = await apiClient.post('/templates', template);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating contract template:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract template',
        error,
      };
    }
  }

  /**
   * Update contract template
   * @param {string} id - Template ID
   * @param {Object} template - Updated template data
   * @returns {Promise} Update response
   */
  async updateContractTemplate(id, template) {
    try {
      const response = await apiClient.put(`/templates/${id}`, template);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating contract template:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract template',
        error,
      };
    }
  }

  /**
   * Delete contract template
   * @param {string} id - Template ID
   * @returns {Promise} Delete response
   */
  async deleteContractTemplate(id) {
    try {
      const response = await apiClient.delete(`/templates/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting contract template:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract template',
        error,
      };
    }
  }

  /**
   * Generate contract from template
   * @param {string} templateId - Template ID
   * @param {Object} data - Contract data
   * @returns {Promise} Generated contract
   */
  async generateContract(templateId, data) {
    try {
      const response = await apiClient.post(`/templates/${templateId}/generate`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error generating contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate contract',
        error,
      };
    }
  }

  /**
   * Sign contract
   * @param {string} id - Contract ID
   * @param {Object} signature - Signature data
   * @returns {Promise} Sign response
   */
  async signContract(id, signature) {
    try {
      const response = await apiClient.post(`/${id}/sign`, signature);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error signing contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to sign contract',
        error,
      };
    }
  }

  /**
   * Terminate contract
   * @param {string} id - Contract ID
   * @param {Object} termination - Termination data
   * @returns {Promise} Termination response
   */
  async terminateContract(id, termination) {
    try {
      const response = await apiClient.post(`/${id}/terminate`, termination);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error terminating contract:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to terminate contract',
        error,
      };
    }
  }

  /**
   * Get contract statistics
   * @returns {Promise} Statistics data
   */
  async getContractStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching contract stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract stats',
        error,
      };
    }
  }

  /**
   * Search contracts
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchContracts(query) {
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error searching contracts:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search contracts',
        error,
      };
    }
  }

  /**
   * Get contracts expiring soon
   * @param {number} days - Number of days ahead
   * @returns {Promise} Expiring contracts
   */
  async getExpiringContracts(days = 30) {
    try {
      const response = await apiClient.get(`/expiring?days=${days}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching expiring contracts:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch expiring contracts',
        error,
      };
    }
  }
}

export default new ContractsService();
