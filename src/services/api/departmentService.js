import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllDepartments = async () => {
  try {
    const response = await apiClient.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { success: false, error: error.message };
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department:', error);
    return { success: false, error: error.message };
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await apiClient.post('/departments', data);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    return { success: false, error: error.message };
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    return { success: false, error: error.message };
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    return { success: false, error: error.message };
  }
};

const departmentService = {
  getAll: getAllDepartments, // Alias for consistency
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService;

