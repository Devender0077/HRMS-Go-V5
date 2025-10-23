import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const configurationService = {
  // Configuration Summary
  getSummary: async () => {
    const response = await axios.get(`${API_URL}/configuration/summary`);
    return response.data;
  },

  // Shifts
  getShifts: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/shifts`, { params });
    return response.data;
  },

  createShift: async (data) => {
    const response = await axios.post(`${API_URL}/configuration/shifts`, data);
    return response.data;
  },

  updateShift: async (id, data) => {
    const response = await axios.put(`${API_URL}/configuration/shifts/${id}`, data);
    return response.data;
  },

  deleteShift: async (id) => {
    const response = await axios.delete(`${API_URL}/configuration/shifts/${id}`);
    return response.data;
  },

  // Attendance Policies
  getAttendancePolicies: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/attendance-policies`, { params });
    return response.data;
  },

  createAttendancePolicy: async (data) => {
    const response = await axios.post(`${API_URL}/configuration/attendance-policies`, data);
    return response.data;
  },

  updateAttendancePolicy: async (id, data) => {
    const response = await axios.put(`${API_URL}/configuration/attendance-policies/${id}`, data);
    return response.data;
  },

  deleteAttendancePolicy: async (id) => {
    const response = await axios.delete(`${API_URL}/configuration/attendance-policies/${id}`);
    return response.data;
  },

  // Salary Components
  getSalaryComponents: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/salary-components`, { params });
    return response.data;
  },

  createSalaryComponent: async (data) => {
    const response = await axios.post(`${API_URL}/configuration/salary-components`, data);
    return response.data;
  },

  updateSalaryComponent: async (id, data) => {
    const response = await axios.put(`${API_URL}/configuration/salary-components/${id}`, data);
    return response.data;
  },

  deleteSalaryComponent: async (id) => {
    const response = await axios.delete(`${API_URL}/configuration/salary-components/${id}`);
    return response.data;
  },

  // Payment Methods
  getPaymentMethods: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/payment-methods`, { params });
    return response.data;
  },

  createPaymentMethod: async (data) => {
    const response = await axios.post(`${API_URL}/configuration/payment-methods`, data);
    return response.data;
  },

  updatePaymentMethod: async (id, data) => {
    const response = await axios.put(`${API_URL}/configuration/payment-methods/${id}`, data);
    return response.data;
  },

  deletePaymentMethod: async (id) => {
    const response = await axios.delete(`${API_URL}/configuration/payment-methods/${id}`);
    return response.data;
  },

  // Tax Settings
  getTaxSettings: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/tax-settings`, { params });
    return response.data;
  },

  createTaxSetting: async (data) => {
    const response = await axios.post(`${API_URL}/configuration/tax-settings`, data);
    return response.data;
  },

  updateTaxSetting: async (id, data) => {
    const response = await axios.put(`${API_URL}/configuration/tax-settings/${id}`, data);
    return response.data;
  },

  deleteTaxSetting: async (id) => {
    const response = await axios.delete(`${API_URL}/configuration/tax-settings/${id}`);
    return response.data;
  },

  // Document Categories
  getDocumentCategories: async (params = {}) => {
    const response = await axios.get(`${API_URL}/documents/categories`, { params });
    return response.data;
  },

  // === NEW CONFIGURATION TYPES ===
  
  // Leave Policies
  getLeavePolicies: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/leave-policies`, { params });
    return response.data;
  },

  // Recruitment
  getJobCategories: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/job-categories`, { params });
    return response.data;
  },

  getJobTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/job-types`, { params });
    return response.data;
  },

  getHiringStages: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/hiring-stages`, { params });
    return response.data;
  },

  // Performance
  getKPIIndicators: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/kpi-indicators`, { params });
    return response.data;
  },

  getReviewCycles: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/review-cycles`, { params });
    return response.data;
  },

  getGoalCategories: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/goal-categories`, { params });
    return response.data;
  },

  // Training
  getTrainingTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/training-types`, { params });
    return response.data;
  },

  // Documents
  getDocumentTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/document-types`, { params });
    return response.data;
  },

  getCompanyPolicies: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/company-policies`, { params });
    return response.data;
  },

  // Awards
  getAwardTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/award-types`, { params });
    return response.data;
  },

  // Termination
  getTerminationTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/termination-types`, { params });
    return response.data;
  },

  getTerminationReasons: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/termination-reasons`, { params });
    return response.data;
  },

  // Expense
  getExpenseCategories: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/expense-categories`, { params });
    return response.data;
  },

  getExpenseLimits: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/expense-limits`, { params });
    return response.data;
  },

  // Income
  getIncomeCategories: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/income-categories`, { params });
    return response.data;
  },

  getIncomeSources: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/income-sources`, { params });
    return response.data;
  },

  // Contract
  getContractTypes: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/contract-types`, { params });
    return response.data;
  },

  // Messenger
  getMessageTemplates: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/message-templates`, { params });
    return response.data;
  },

  getNotificationSettings: async (params = {}) => {
    const response = await axios.get(`${API_URL}/configuration/notification-settings`, { params });
    return response.data;
  },
};

export default configurationService;

