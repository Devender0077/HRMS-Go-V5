import axios from '../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const announcementService = {
  getAllAnnouncements: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/announcements`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  getAnnouncementById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  },

  createAnnouncement: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/announcements`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  updateAnnouncement: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/announcements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },
};

export default announcementService;

