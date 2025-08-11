import api from './api';
const API_URL = '/logs/';

// Get logs for a specific endpoint
// period can be '24h', '7d', '30d'
const getLogsForEndpoint = async (endpointId, period = '24h') => {
  const response = await api.get(`${API_URL}${endpointId}?period=${period}`);
  return response.data;
};

export { getLogsForEndpoint };