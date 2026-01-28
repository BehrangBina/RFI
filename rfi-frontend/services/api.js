import axios from 'axios';
import config from '../src/config/environment';
import { API_ENDPOINTS } from '../src/constants';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth tokens or logging
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Events API
export const eventsAPI = {
  getAll: () => api.get(API_ENDPOINTS.EVENTS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.EVENTS.BY_ID(id)),
  getUpcoming: () => api.get(API_ENDPOINTS.EVENTS.UPCOMING),
};

// Posters API
export const postersAPI = {
  getAll: () => api.get(API_ENDPOINTS.POSTERS.ALL),
  getByEventId: (eventId) => api.get(API_ENDPOINTS.POSTERS.BY_EVENT(eventId)),
  trackDownload: (posterId) => api.post(API_ENDPOINTS.POSTERS.TRACK_DOWNLOAD(posterId)),
};

// Donations API
export const donationsAPI = {
  create: (donation) => api.post(API_ENDPOINTS.DONATIONS.CREATE, donation),
  getStats: () => api.get(API_ENDPOINTS.DONATIONS.STATS),
  getRecent: (count = 5) => api.get(API_ENDPOINTS.DONATIONS.RECENT(count)),
};

// Analytics API
export const analyticsAPI = {
  getByCountry: () => api.get(API_ENDPOINTS.ANALYTICS.BY_COUNTRY),
  getByCity: () => api.get(API_ENDPOINTS.ANALYTICS.BY_CITY),
};

export default api;