const asyncHandler = require('express-async-handler');
const MonitorLog = require('../models/monitorLogModel');
const Endpoint = require('../models/endpointModel');
const mongoose = require('mongoose');

// @desc    Get monitoring logs for a specific endpoint
// @route   GET /api/logs/:endpointId
// @access  Private
const getLogsForEndpoint = asyncHandler(async (req, res) => {
  const { endpointId } = req.params;
  const { period = '24h' } = req.query; // Default to last 24 hours

  // Validate endpointId
  if (!mongoose.Types.ObjectId.isValid(endpointId)) {
    res.status(400);
    throw new Error('Invalid Endpoint ID');
  }
  
  const endpoint = await Endpoint.findById(endpointId);

  // Authorization check: ensure the endpoint belongs to the requesting user
  if (!endpoint || endpoint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to view these logs');
  }

  // Calculate the start date based on the period query param
  const now = new Date();
  let startDate;
  switch (period) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '24h':
    default:
      startDate = new Date(now.setHours(now.getHours() - 24));
  }
  
  // Fetch logs within the time range
  const logs = await MonitorLog.find({
    endpointId: endpointId,
    createdAt: { $gte: startDate },
  }).sort({ createdAt: -1 }); // Get latest logs first

  // Calculate Uptime Percentage
  const totalLogs = logs.length;
  const successfulLogs = logs.filter(log => log.wasSuccessful).length;
  const uptimePercentage = totalLogs > 0 ? (successfulLogs / totalLogs) * 100 : 100;

  // Calculate Average Latency
  const successfulLatencies = logs.filter(log => log.wasSuccessful).map(log => log.latency);
  const averageLatency = successfulLatencies.length > 0
    ? successfulLatencies.reduce((a, b) => a + b, 0) / successfulLatencies.length
    : 0;
  
  res.status(200).json({
      logs: logs.slice(0, 50), // Return up to 50 recent logs for the table
      chartData: logs.map(l => ({ time: l.createdAt, latency: l.latency })).reverse(), // reversed for chart
      stats: {
          uptime: uptimePercentage.toFixed(2),
          avgLatency: averageLatency.toFixed(0),
          totalChecks: totalLogs,
          totalDown: totalLogs - successfulLogs,
      }
  });
});

module.exports = { getLogsForEndpoint };