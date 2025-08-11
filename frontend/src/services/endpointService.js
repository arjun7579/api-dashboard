import api from './api';
const API_URL = '/endpoints/';

// Get all endpoints for the logged-in user
const getEndpoints = async () => {
    const response = await api.get(API_URL);
    return response.data;
}

// Create a new endpoint
const createEndpoint = async (endpointData) => {
    const response = await api.post(API_URL, endpointData);
    return response.data;
}

// Delete an endpoint by ID
const deleteEndpoint = async (id) => {
    const response = await api.delete(`${API_URL}${id}`);
    return response.data;
}

export { getEndpoints, createEndpoint, deleteEndpoint };