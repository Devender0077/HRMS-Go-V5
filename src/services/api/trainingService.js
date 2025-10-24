import axios from '../../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const trainingService = {
  // Training Programs
  getAllPrograms: async () => {
    try {
      const response = await axios.get(`${API_URL}/training/programs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training programs:', error);
      throw error;
    }
  },

  createProgram: async (programData) => {
    try {
      const response = await axios.post(`${API_URL}/training/programs`, programData);
      return response.data;
    } catch (error) {
      console.error('Error creating training program:', error);
      throw error;
    }
  },

  updateProgram: async (id, programData) => {
    try {
      const response = await axios.put(`${API_URL}/training/programs/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error('Error updating training program:', error);
      throw error;
    }
  },

  deleteProgram: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/training/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting training program:', error);
      throw error;
    }
  },

  getTrainingStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/training/programs/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training stats:', error);
      throw error;
    }
  },
};

export default trainingService;

