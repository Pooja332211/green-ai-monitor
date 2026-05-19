import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export const getStats = () => api.get('stats/carbon/total');
export const getLiveStats = () => api.get('stats/live');
export const getLiveStatus = () => api.get('stats/status');
export const getLogs = () => api.get('logs');
export const getSuggestions = () => api.get('suggestions');
export const trackEmission = (data) => api.post('tracking', data);
export const toggleTracking = (action, project = "Default Project") =>
  api.post('tracking', { action, project });

// Optimization Endpoints
export const analyzeEmission = (data) => api.post('optimization/analyze', data);
export const generateOptimization = (data) => api.post('optimization/optimize', data);
export const chatWithGemini = (data) => api.post('chat/message', data);

export default api;