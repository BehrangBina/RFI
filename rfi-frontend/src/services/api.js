import axios from 'axios';

const API_BASE_URL = 'http://localhost:5186/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventsAPI = {
  getAll: () => apiClient.get('/Events'),
  getById: (id) => apiClient.get(`/Events/${id}`),
  create: (event) => apiClient.post('/Events', event),
  update: (id, event) => apiClient.put(`/Events/${id}`, event),
  delete: (id) => apiClient.delete(`/Events/${id}`),
};

export const postersAPI = {
  getAll: () => apiClient.get('/Posters'),
  getById: (id) => apiClient.get(`/Posters/${id}`),
  getByEvent: (eventId) => apiClient.get(`/Posters/event/${eventId}`),
  create: (poster) => apiClient.post('/Posters', poster),
  update: (id, poster) => apiClient.put(`/Posters/${id}`, poster),
  delete: (id) => apiClient.delete(`/Posters/${id}`),
  trackDownload: (id) => apiClient.post(`/Posters/${id}/download`),
};

export const donationsAPI = {
  getAll: () => apiClient.get('/Donations'),
  getById: (id) => apiClient.get(`/Donations/${id}`),
  create: (donation) => apiClient.post('/Donations', donation),
};

export const analyticsAPI = {
  getVisitorStats: () => apiClient.get('/Analytics/visitors'),
  getTopCountries: (limit = 10) => apiClient.get(`/Analytics/top-countries?limit=${limit}`),
  getTopCities: (limit = 10) => apiClient.get(`/Analytics/top-cities?limit=${limit}`),
};

export default apiClient;
