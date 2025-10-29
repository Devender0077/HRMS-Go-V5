import axios from 'axios';
// config
import { API_URL } from '../config-global';

// ----------------------------------------------------------------------

// Configure the default axios instance so other modules that import
// this file as `axios` get a configured axios with create() available.
axios.defaults.baseURL = API_URL;

// Request interceptor - Add JWT token to all requests
axios.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axios;
