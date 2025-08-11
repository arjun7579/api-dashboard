const mongoose = require('mongoose');

// This schema helps prevent spamming users with alerts for a persistently failing endpoint.
const alertCooldownSchema = mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Endpoint',
    unique: true,
  },
  lastAlerted: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('AlertCooldown', alertCooldownSchema);