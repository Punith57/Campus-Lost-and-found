import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Items
export const getItems = (params) => api.get('/items', { params });
export const getItemById = (id) => api.get(`/items/${id}`);
export const createItem = (formData) =>
  api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateItemStatus = (id, status) => api.patch(`/items/${id}/status`, { status });
export const getStats = () => api.get('/items/stats');

// Requests
export const submitRequest = (data) => api.post('/requests', data);
export const getRequestsForItem = (itemId) => api.get(`/requests/${itemId}`);

export default api;
