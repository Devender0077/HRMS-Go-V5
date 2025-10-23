import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const recruitmentService = {
  // Job Postings
  getAllJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/recruitment/jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/recruitment/jobs`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/recruitment/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/recruitment/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Applications
  getAllApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/recruitment/applications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  createApplication: async (applicationData) => {
    try {
      const response = await axios.post(`${API_URL}/recruitment/applications`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/recruitment/applications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  getApplicationStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/recruitment/applications/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },
};

export default recruitmentService;

