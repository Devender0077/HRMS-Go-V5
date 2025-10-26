import axios from '../utils/axios';

const announcementService = {
  getAllAnnouncements: async (params = {}) => {
    try {
      const response = await axios.get('/announcements', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  getAnnouncementById: async (id) => {
    try {
      const response = await axios.get(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      return { success: false, data: null, message: error.message };
    }
  },

  createAnnouncement: async (data) => {
    try {
      const response = await axios.post('/announcements', data);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return { success: false, message: error.message };
    }
  },

  updateAnnouncement: async (id, data) => {
    try {
      const response = await axios.put(`/announcements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return { success: false, message: error.message };
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const response = await axios.delete(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return { success: false, message: error.message };
    }
  },
};

export default announcementService;

