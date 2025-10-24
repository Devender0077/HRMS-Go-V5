import axios from '../../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const performanceService = {
  // Goals
  getAllGoals: async () => {
    try {
      const response = await axios.get(`${API_URL}/performance/goals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await axios.post(`${API_URL}/performance/goals`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  updateGoal: async (id, goalData) => {
    try {
      const response = await axios.put(`${API_URL}/performance/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/performance/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  getGoalStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/performance/goals/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal stats:', error);
      throw error;
    }
  },
};

export default performanceService;

