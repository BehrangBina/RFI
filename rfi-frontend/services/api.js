import axios from 'axios';

const API_BASE_URL = 'https://localhost:7xxx/api'; // Replace with your actual port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  getUpcoming: () => api.get('/events/upcoming'),
};

export const postersAPI = {
  getByEventId: (eventId) => api.get(`/posters/event/${eventId}`),
  trackDownload: (posterId) => api.post(`/posters/${posterId}/download`),
};

export const donationsAPI = {
  create: (donation) => api.post('/donations', donation),
  getStats: () => api.get('/donations/stats'),
  getRecent: (count = 5) => api.get(`/donations/recent?count=${count}`),
};

export const analyticsAPI = {
  getVisitorCount: () => api.get('/analytics/visitor-count'),
  getStats: () => api.get('/analytics/stats'),
};

export default api;