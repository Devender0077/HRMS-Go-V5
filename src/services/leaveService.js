import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const leaveService = {
  // Get all leave applications
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },
  
  getAllLeaves: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },

  // Get leave by ID
  getLeaveById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave:', error);
      throw error;
    }
  },

  // Apply for leave
  applyLeave: async (leaveData) => {
    try {
      const response = await axios.post(`${API_URL}/leaves`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error applying leave:', error);
      throw error;
    }
  },

  // Update leave
  updateLeave: async (id, leaveData) => {
    try {
      const response = await axios.put(`${API_URL}/leaves/${id}`, leaveData);
      return response.data;
    } catch (error) {
      console.error('Error updating leave:', error);
      throw error;
    }
  },

  // Delete leave
  deleteLeave: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting leave:', error);
      throw error;
    }
  },

  // Approve/Reject leave
  updateLeaveStatus: async (id, status, remarks) => {
    try {
      const response = await axios.patch(`${API_URL}/leaves/${id}/status`, { status, remarks });
      return response.data;
    } catch (error) {
      console.error('Error updating leave status:', error);
      throw error;
    }
  },

  // Get leave balances
  getLeaveBalances: async (employeeId) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/balances/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  },
  
  getBalances: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/balances`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  },
  
  // Get leave records
  getRecords: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/applications`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave records:', error);
      throw error;
    }
  },
  
  // Apply for leave
  apply: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/leaves`, data);
      return response.data;
    } catch (error) {
      console.error('Error applying leave:', error);
      throw error;
    }
  },
  
  // Approve leave
  approve: async (id, comments = '') => {
    try {
      const response = await axios.put(`${API_URL}/leaves/applications/${id}/approve`, { comments });
      return response.data;
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  },
  
  // Reject leave
  reject: async (id, comments = '') => {
    try {
      const response = await axios.put(`${API_URL}/leaves/applications/${id}/reject`, { comments });
      return response.data;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  },
  
  // Delete leave
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting leave:', error);
      throw error;
    }
  },
  
  // Get leave statistics
  getLeaveStats: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave stats:', error);
      throw error;
    }
  },
};

export default leaveService;

