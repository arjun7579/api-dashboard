const cron = require('node-cron');
const axios = require('axios');
const Endpoint = require('../models/endpointModel');
const MonitorLog = require('../models/monitorLogModel');
const { sendDownAlert } = require('./alertService');

// This function contains the core monitoring logic
const checkApi = async (endpoint) => {
  const startTime = Date.now();
  let logData = {
    endpointId: endpoint._id,
    userId: endpoint.user,
    wasSuccessful: false,
    statusCode: 0,
    statusText: 'Error',
    latency: 0,
  };

  try {
    const response = await axios.get(endpoint.url, { timeout: 5000 }); // 5 second timeout
    const endTime = Date.now();
    
    logData.wasSuccessful = response.status >= 200 && response.status < 300;
    logData.statusCode = response.status;
    logData.statusText = response.statusText;
    logData.latency = endTime - startTime;
  } catch (error) {
    const endTime = Date.now();
    logData.latency = endTime - startTime;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logData.wasSuccessful = false;
      logData.statusCode = error.response.status;
      logData.statusText = error.response.statusText;
    } else if (error.request) {
      // The request was made but no response was received
      logData.statusText = 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      logData.statusText = `Request failed: ${error.message}`;
    }
    
    // If the check failed, trigger an alert
    await sendDownAlert(endpoint);

  } finally {
    // Save the log to the database
    await MonitorLog.create(logData);
  }
};

// This function sets up and starts the cron job.
const startMonitoring = () => {
  console.log('🕒 Monitoring service started. Checks will run every minute.');

  // Schedule a cron job to run every minute ('* * * * *')
  cron.schedule('* * * * *', async () => {
    // console.log('Running a check on all endpoints...');
    try {
      // Fetch all endpoints from the database
      const endpoints = await Endpoint.find({});
      if (endpoints.length > 0) {
        // Run checks for all endpoints concurrently
        await Promise.all(endpoints.map(checkApi));
      }
    } catch (err) {
      console.error('Error during scheduled monitoring run:', err);
    }
  });
};

module.exports = startMonitoring;