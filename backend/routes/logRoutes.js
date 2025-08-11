const express = require('express');
const router = express.Router();
const { getLogsForEndpoint } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

// Get logs for a specific endpoint, protected route
router.get('/:endpointId', protect, getLogsForEndpoint);

module.exports = router;