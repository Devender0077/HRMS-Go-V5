import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const attendanceService = {
  // Clock in
  clockIn: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/attendance/clock-in`, data);
      return response.data;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  },

  // Clock out
  clockOut: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/attendance/clock-out`, data);
      return response.data;
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  },

  // Get attendance records
  getAttendanceRecords: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/attendance`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },
  getCalendar: async ({ year, month, department = 'all' }) => {
  try {
    const response = await axios.get(
      `${API_URL}/attendance/calendar`,
      { params: { year, month, department } }
    );
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching attendance calendar:', error);
    throw error;
  }
},

// NEW: explicitly hit /attendance/records with filters (date range, etc.)
getAttendanceRecordsFiltered: async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/records`, { params });
    return response.data; // controller returns { success, data: { attendance, totalCount, ... } }
  } catch (error) {
    console.error('Error fetching filtered attendance records:', error);
    throw error;
  }
},
  // Get attendance by ID
  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Update attendance
  updateAttendance: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  // Get attendance statistics
  getAttendanceStats: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Get regularizations
  getRegularizations: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/regularizations`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching regularizations:', error);
      throw error;
    }
  },

  // Create regularization request
  createRegularization: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/attendance/regularizations`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating regularization:', error);
      throw error;
    }
  },

  // Update regularization
  updateRegularization: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/regularizations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating regularization:', error);
      throw error;
    }
  },

  // Approve regularization
  approveRegularization: async (id, approvedBy) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/regularizations/${id}/approve`, { approvedBy });
      return response.data;
    } catch (error) {
      console.error('Error approving regularization:', error);
      throw error;
    }
  },

  // Reject regularization
  rejectRegularization: async (id, rejectedBy, rejectionReason) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/regularizations/${id}/reject`, { 
        rejectedBy, 
        rejectionReason 
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting regularization:', error);
      throw error;
    }
  },

  // Delete regularization
  deleteRegularization: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/attendance/regularizations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting regularization:', error);
      throw error;
    }
  },
};

export default attendanceService;

