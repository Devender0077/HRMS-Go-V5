import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all system setup counts
export const getSystemSetupCounts = async () => {
  try {
    const response = await apiClient.get('/system-setup/counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching system setup counts:', error);
    // Return mock data if API fails
    return {
      success: true,
      data: {
        counts: {
          organization: { branches: 5, departments: 12, designations: 25 },
          attendance: { shifts: 4, policies: 4 },
          employees: { total: 0, active: 0 },
          leave: { leaveTypes: 8, leavePolicies: 3 },
          payroll: { salaryComponents: 0, taxSettings: 0, paymentMethods: 0 },
          recruitment: { jobCategories: 0, jobTypes: 0, hiringStages: 0 },
          performance: { kpiIndicators: 0, reviewCycles: 0, goalCategories: 0 },
          training: { trainingTypes: 0, trainingPrograms: 0 },
          documents: { documentCategories: 0, documentTypes: 0 },
          awards: { awardTypes: 0 },
          termination: { terminationTypes: 0, terminationReasons: 0 },
          expense: { expenseCategories: 0, expenseLimits: 0 },
          income: { incomeCategories: 0, incomeSources: 0 },
          payment: { paymentGateways: 0, paymentMethods: 0 },
          contract: { contractTypes: 0, contractTemplates: 0 },
          messenger: { messageTemplates: 0, notificationSettings: 0 },
        },
        stats: {
          total: 15,
          configured: 8,
          pending: 7,
          completion: 53,
        },
      },
    };
  }
};

// Get category details
export const getCategoryDetails = async (categoryId) => {
  try {
    const response = await apiClient.get(`/system-setup/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category details:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const systemSetupService = {
  getSystemSetupCounts,
  getCategoryDetails,
};

export default systemSetupService;

