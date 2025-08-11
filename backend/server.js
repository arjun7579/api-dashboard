// Main entry point for the backend server
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const startMonitoring = require('./services/monitorService');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/endpoints', require('./routes/endpointRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/anomaly', require('./routes/anomalyRoutes'));

// Custom error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Start the automated monitoring service
  startMonitoring();
});