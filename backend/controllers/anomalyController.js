const asyncHandler = require('express-async-handler');
const MonitorLog = require('../models/monitorLogModel');
const Endpoint = require('../models/endpointModel');

// @desc    Check for latency anomalies
// @route   GET /api/anomaly/:endpointId
// @access  Private
const checkAnomaly = asyncHandler(async (req, res) => {
  const { endpointId } = req.params;

  const endpoint = await Endpoint.findById(endpointId);
  // Authorization check
  if (!endpoint || endpoint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // 1. Fetch the last 100 successful latency readings
  const recentLogs = await MonitorLog.find({
    endpointId: endpointId,
    wasSuccessful: true,
  })
    .sort({ createdAt: -1 })
    .limit(100);

  if (recentLogs.length < 10) {
    // Not enough data to determine an anomaly
    return res.status(200).json({ isAnomaly: false, latestLatency: recentLogs[0]?.latency || 0 });
  }

  const latencies = recentLogs.map((log) => log.latency);
  const latestLatency = latencies[0];

  // 2. Calculate the mean (μ)
  const mean = latencies.reduce((acc, val) => acc + val, 0) / latencies.length;

  // 3. Calculate the standard deviation (σ)
  const stdDev = Math.sqrt(
    latencies
      .map((x) => Math.pow(x - mean, 2))
      .reduce((a, b) => a + b, 0) / latencies.length
  );

  // 4. Define the anomaly threshold (μ + 2σ)
  // This means any value more than 2 standard deviations from the average is an anomaly.
  const anomalyThreshold = mean + 2 * stdDev;

  // 5. Check if the latest reading is an anomaly
  const isAnomaly = latestLatency > anomalyThreshold;

  res.status(200).json({
    isAnomaly,
    latestLatency,
    mean: mean.toFixed(2),
    stdDev: stdDev.toFixed(2),
    threshold: anomalyThreshold.toFixed(2),
  });
});

module.exports = { checkAnomaly };