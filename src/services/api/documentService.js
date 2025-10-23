import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const documentService = {
  // Get all document categories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/documents/categories`);
    return response.data;
  },

  // Get employee documents
  getEmployeeDocuments: async (employeeId, params = {}) => {
    const response = await axios.get(`${API_URL}/documents/employee/${employeeId}`, { params });
    return response.data;
  },

  // Get all employee documents (for documents page)
  getAllEmployeeDocuments: async (params = {}) => {
    const response = await axios.get(`${API_URL}/documents/all`, { params });
    return response.data;
  },

  // Get employee document statistics
  getEmployeeDocumentStats: async (employeeId) => {
    const response = await axios.get(`${API_URL}/documents/employee/${employeeId}/stats`);
    return response.data;
  },

  // Upload document
  uploadDocument: async (formData) => {
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Verify document
  verifyDocument: async (id, data) => {
    const response = await axios.put(`${API_URL}/documents/${id}/verify`, data);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id) => {
    const response = await axios.delete(`${API_URL}/documents/${id}`);
    return response.data;
  },
};

export default documentService;
