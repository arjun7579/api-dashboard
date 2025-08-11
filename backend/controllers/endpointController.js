const asyncHandler = require('express-async-handler');
const Endpoint = require('../models/endpointModel');
const MonitorLog = require('../models/monitorLogModel');

// @desc    Get user's endpoints
// @route   GET /api/endpoints
// @access  Private
const getEndpoints = asyncHandler(async (req, res) => {
  const endpoints = await Endpoint.find({ user: req.user.id });
  res.status(200).json(endpoints);
});

// @desc    Create a new endpoint
// @route   POST /api/endpoints
// @access  Private
const setEndpoint = asyncHandler(async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    res.status(400);
    throw new Error('Please provide a name and URL');
  }

  const endpoint = await Endpoint.create({
    name,
    url,
    user: req.user.id,
  });

  res.status(201).json(endpoint);
});

// @desc    Update an endpoint
// @route   PUT /api/endpoints/:id
// @access  Private
const updateEndpoint = asyncHandler(async (req, res) => {
  const endpoint = await Endpoint.findById(req.params.id);

  if (!endpoint) {
    res.status(404);
    throw new Error('Endpoint not found');
  }

  // Check if the endpoint belongs to the logged-in user
  if (endpoint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEndpoint = await Endpoint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedEndpoint);
});

// @desc    Delete an endpoint
// @route   DELETE /api/endpoints/:id
// @access  Private
const deleteEndpoint = asyncHandler(async (req, res) => {
  const endpoint = await Endpoint.findById(req.params.id);

  if (!endpoint) {
    res.status(404);
    throw new Error('Endpoint not found');
  }

  // Check for user authorization
  if (endpoint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Also delete all associated monitoring logs
  await MonitorLog.deleteMany({ endpointId: req.params.id });

  await endpoint.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getEndpoints,
  setEndpoint,
  updateEndpoint,
  deleteEndpoint,
};