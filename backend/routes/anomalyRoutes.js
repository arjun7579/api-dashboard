const express = require('express');
const router = express.Router();
const { checkAnomaly } = require('../controllers/anomalyController');
const { protect } = require('../middleware/authMiddleware');

// Get anomaly status for a specific endpoint, protected route
router.get('/:endpointId', protect, checkAnomaly);

module.exports = router;