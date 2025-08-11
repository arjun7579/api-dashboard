import api from './api';
const API_URL = '/anomaly/';

// Check for the latest anomaly for a specific endpoint
const checkAnomaly = async (endpointId) => {
  const response = await api.get(`${API_URL}${endpointId}`);
  return response.data;
};

export { checkAnomaly };