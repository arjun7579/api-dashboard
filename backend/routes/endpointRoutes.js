const express = require('express');
const router = express.Router();
const {
  getEndpoints,
  setEndpoint,
  updateEndpoint,
  deleteEndpoint,
} = require('../controllers/endpointController');
const { protect } = require('../middleware/authMiddleware');

// All these routes are protected and require a valid JWT
router.route('/').get(protect, getEndpoints).post(protect, setEndpoint);
router.route('/:id').put(protect, updateEndpoint).delete(protect, deleteEndpoint);

module.exports = router;