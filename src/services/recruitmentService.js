import apiClient from '../utils/axios';

// Use shared axios instance (apiClient) which already sets baseURL and token interceptor.
// We will prefix recruitment endpoints with '/recruitment'.
const BASE_PATH = '/recruitment';

// Recruitment Service
class RecruitmentService {
  /**
   * Get all job postings
   * @returns {Promise} Job postings list
   */
  async getJobPostings() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/jobs`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching job postings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job postings',
        error,
      };
    }
  }

  /**
   * Get job posting by ID
   * @param {string} id - Job posting ID
   * @returns {Promise} Job posting details
   */
  async getJobPosting(id) {
    try {
  const response = await apiClient.get(`${BASE_PATH}/jobs/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching job posting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job posting',
        error,
      };
    }
  }

  /**
   * Create new job posting
   * @param {Object} jobPosting - Job posting data
   * @returns {Promise} Create response
   */
  async createJobPosting(jobPosting) {
    try {
  const response = await apiClient.post(`${BASE_PATH}/jobs`, jobPosting);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating job posting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create job posting',
        error,
      };
    }
  }

  /**
   * Update job posting
   * @param {string} id - Job posting ID
   * @param {Object} jobPosting - Updated job posting data
   * @returns {Promise} Update response
   */
  async updateJobPosting(id, jobPosting) {
    try {
  const response = await apiClient.put(`${BASE_PATH}/jobs/${id}`, jobPosting);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating job posting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update job posting',
        error,
      };
    }
  }

  /**
   * Delete job posting
   * @param {string} id - Job posting ID
   * @returns {Promise} Delete response
   */
  async deleteJobPosting(id) {
    try {
  const response = await apiClient.delete(`${BASE_PATH}/jobs/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting job posting:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete job posting',
        error,
      };
    }
  }

  /**
   * Get all job applications
   * @returns {Promise} Job applications list
   */
  async getJobApplications() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/applications`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job applications',
        error,
      };
    }
  }

  /**
   * Create a job application
   * @param {Object} application - Application payload
   * @returns {Promise} Create response
   */
  async createJobApplication(application) {
    try {
      const response = await apiClient.post(`${BASE_PATH}/applications`, application);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating job application:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create job application',
        error,
      };
    }
  }

  /**
   * Get job application by ID
   * @param {string} id - Application ID
   * @returns {Promise} Application details
   */
  async getJobApplication(id) {
    try {
  const response = await apiClient.get(`${BASE_PATH}/applications/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching job application:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job application',
        error,
      };
    }
  }

  /**
   * Update application status
   * @param {string} id - Application ID
   * @param {string} status - New status
   * @returns {Promise} Update response
   */
  async updateApplicationStatus(id, status) {
    try {
  const response = await apiClient.put(`${BASE_PATH}/applications/${id}/status`, { status });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update application status',
        error,
      };
    }
  }

  /**
   * Get all interviews
   * @returns {Promise} Interviews list
   */
  async getInterviews() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/interviews`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching interviews:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch interviews',
        error,
      };
    }
  }

  /**
   * Schedule interview
   * @param {Object} interview - Interview data
   * @returns {Promise} Create response
   */
  async scheduleInterview(interview) {
    try {
  const response = await apiClient.post(`${BASE_PATH}/interviews`, interview);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error scheduling interview:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to schedule interview',
        error,
      };
    }
  }

  /**
   * Get all offers
   * @returns {Promise} Offers list
   */
  async getOffers() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/offers`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching offers:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch offers',
        error,
      };
    }
  }

  /**
   * Create job offer
   * @param {Object} offer - Offer data
   * @returns {Promise} Create response
   */
  async createOffer(offer) {
    try {
  const response = await apiClient.post(`${BASE_PATH}/offers`, offer);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating offer:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create offer',
        error,
      };
    }
  }

  /**
   * Get candidate pipeline
   * @returns {Promise} Pipeline data
   */
  async getCandidatePipeline() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/pipeline`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching candidate pipeline:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch candidate pipeline',
        error,
      };
    }
  }

  /**
   * Get recruitment statistics
   * @returns {Promise} Statistics data
   */
  async getRecruitmentStats() {
    try {
  const response = await apiClient.get(`${BASE_PATH}/stats`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching recruitment stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recruitment stats',
        error,
      };
    }
  }
}

export default new RecruitmentService();