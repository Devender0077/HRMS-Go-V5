import axios from '../../utils/axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Calendar API service
export const calendarService = {
  // Get all calendar events
  getEvents: async () => {
    try {
      const response = await apiClient.get('/calendar/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  // Create new calendar event
  createEvent: async (eventData) => {
    try {
      const response = await apiClient.post('/calendar/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  // Update calendar event
  updateEvent: async (id, eventData) => {
    try {
      const response = await apiClient.put(`/calendar/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  },

  // Delete calendar event
  deleteEvent: async (id) => {
    try {
      const response = await apiClient.delete(`/calendar/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await apiClient.get(`/calendar/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      throw error;
    }
  },
};

export default calendarService;
