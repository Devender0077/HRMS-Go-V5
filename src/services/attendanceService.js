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
};

export default attendanceService;

