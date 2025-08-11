import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaPen } from 'react-icons/fa';
import { getEndpoints, createEndpoint, deleteEndpoint } from '../services/endpointService';
import Spinner from '../components/Spinner';

function EndpointSettings() {
  const [endpoints, setEndpoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', url: '' });

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    setIsLoading(true);
    try {
      const data = await getEndpoints();
      setEndpoints(data);
    } catch (error) {
      toast.error('Failed to load endpoints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEndpoint = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      toast.error('Name and URL are required.');
      return;
    }
    const toastId = toast.loading('Adding endpoint...');
    try {
      await createEndpoint(formData);
      toast.success('Endpoint added successfully!', { id: toastId });
      setFormData({ name: '', url: '' }); // Reset form
      fetchEndpoints(); // Refresh the list
    } catch (error) {
      toast.error('Failed to add endpoint.', { id: toastId });
    }
  };

  const handleDeleteEndpoint = async (id) => {
    if (window.confirm('Are you sure you want to delete this endpoint? This action cannot be undone.')) {
      const toastId = toast.loading('Deleting endpoint...');
      try {
        await deleteEndpoint(id);
        toast.success('Endpoint deleted.', { id: toastId });
        fetchEndpoints(); // Refresh list
      } catch (error) {
        toast.error('Failed to delete endpoint.', { id: toastId });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Settings</h1>
      
      {/* Add New Endpoint Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a New API</h2>
        <form onSubmit={handleAddEndpoint} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">API Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., My Awesome API" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL to Monitor</label>
            <input type="url" name="url" id="url" value={formData.url} onChange={handleInputChange} placeholder="https://api.example.com/health" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="md:col-start-3 md:col-end-4 w-full md:w-auto justify-self-end inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FaPlus className="mr-2" /> Add Endpoint
          </button>
        </form>
      </div>

      {/* List of Endpoints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Monitored APIs</h2>
        {isLoading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {endpoints.length > 0 ? endpoints.map((ep) => (
                  <tr key={ep._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ep.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{ep.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteEndpoint(ep._id)} className="text-red-600 hover:text-red-900 ml-4">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      You haven't added any APIs to monitor yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EndpointSettings;