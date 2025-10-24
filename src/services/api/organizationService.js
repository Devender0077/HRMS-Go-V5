import axios from '../../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const organizationService = {
  // Get organization chart
  getOrganizationChart: async () => {
    const response = await axios.get(`${API_URL}/organization/chart`);
    return response.data;
  },

  // Get organization statistics
  getOrganizationStats: async () => {
    const response = await axios.get(`${API_URL}/organization/stats`);
    return response.data;
  },
};

export default organizationService;

