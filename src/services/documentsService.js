import axios from '../utils/axios';
import { API_URL } from '../config-global';

// API Client
const apiClient = axios.create({
  baseURL: `${API_URL}/documents`,
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

// Documents Service
class DocumentsService {
  /**
   * Get all documents
   * @returns {Promise} Documents list
   */
  async getDocuments() {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch documents',
        error,
      };
    }
  }

  /**
   * Get document by ID
   * @param {string} id - Document ID
   * @returns {Promise} Document details
   */
  async getDocument(id) {
    try {
      const response = await apiClient.get(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch document',
        error,
      };
    }
  }

  /**
   * Upload document
   * @param {FormData} formData - Document file and metadata
   * @returns {Promise} Upload response
   */
  async uploadDocument(formData) {
    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload document',
        error,
      };
    }
  }

  /**
   * Update document
   * @param {string} id - Document ID
   * @param {Object} document - Updated document data
   * @returns {Promise} Update response
   */
  async updateDocument(id, document) {
    try {
      const response = await apiClient.put(`/${id}`, document);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update document',
        error,
      };
    }
  }

  /**
   * Delete document
   * @param {string} id - Document ID
   * @returns {Promise} Delete response
   */
  async deleteDocument(id) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete document',
        error,
      };
    }
  }

  /**
   * Download document
   * @param {string} id - Document ID
   * @returns {Promise} Download response
   */
  async downloadDocument(id) {
    try {
      const response = await apiClient.get(`/${id}/download`, {
        responseType: 'blob',
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error downloading document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download document',
        error,
      };
    }
  }

  /**
   * Get employee documents
   * @param {string} employeeId - Employee ID
   * @returns {Promise} Employee documents list
   */
  async getEmployeeDocuments(employeeId) {
    try {
      const response = await apiClient.get(`/employee/${employeeId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching employee documents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch employee documents',
        error,
      };
    }
  }

  /**
   * Get document library
   * @returns {Promise} Document library list
   */
  async getDocumentLibrary() {
    try {
      const response = await apiClient.get('/library');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching document library:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch document library',
        error,
      };
    }
  }

  /**
   * Get document categories
   * @returns {Promise} Categories list
   */
  async getDocumentCategories() {
    try {
      const response = await apiClient.get('/categories');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching document categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch document categories',
        error,
      };
    }
  }

  /**
   * Create document category
   * @param {Object} category - Category data
   * @returns {Promise} Create response
   */
  async createDocumentCategory(category) {
    try {
      const response = await apiClient.post('/categories', category);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating document category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create document category',
        error,
      };
    }
  }

  /**
   * Update document category
   * @param {string} id - Category ID
   * @param {Object} category - Updated category data
   * @returns {Promise} Update response
   */
  async updateDocumentCategory(id, category) {
    try {
      const response = await apiClient.put(`/categories/${id}`, category);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating document category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update document category',
        error,
      };
    }
  }

  /**
   * Delete document category
   * @param {string} id - Category ID
   * @returns {Promise} Delete response
   */
  async deleteDocumentCategory(id) {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting document category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete document category',
        error,
      };
    }
  }

  /**
   * Search documents
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchDocuments(query) {
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error searching documents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search documents',
        error,
      };
    }
  }

  /**
   * Get document statistics
   * @returns {Promise} Statistics data
   */
  async getDocumentStats() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching document stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch document stats',
        error,
      };
    }
  }
}

export default new DocumentsService();
