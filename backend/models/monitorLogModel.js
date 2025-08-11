const mongoose = require('mongoose');

const monitorLogSchema = mongoose.Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Endpoint',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    wasSuccessful: {
      type: Boolean,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    statusText: {
      type: String,
      required: true,
    },
    latency: {
      // Latency in milliseconds
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create an index on endpointId and createdAt for faster log queries
monitorLogSchema.index({ endpointId: 1, createdAt: -1 });

module.exports = mongoose.model('MonitorLog', monitorLogSchema);