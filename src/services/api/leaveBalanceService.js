import axios from '../../utils/axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const leaveBalanceService = {
  // Get employee leave balance
  getEmployeeLeaveBalance: async (employeeId, params = {}) => {
    const response = await axios.get(`${API_URL}/leave-balance/${employeeId}/balance`, { params });
    return response.data;
  },

  // Get employee leave history
  getEmployeeLeaveHistory: async (employeeId, params = {}) => {
    const response = await axios.get(`${API_URL}/leave-balance/${employeeId}/history`, { params });
    return response.data;
  },

  // Get employee leave statistics
  getEmployeeLeaveStats: async (employeeId) => {
    const response = await axios.get(`${API_URL}/leave-balance/${employeeId}/stats`);
    return response.data;
  },
};

export default leaveBalanceService;

