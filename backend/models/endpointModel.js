const mongoose = require('mongoose');

const endpointSchema = mongoose.Schema(
  {
    // Associate the endpoint with a user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a name for the endpoint'],
    },
    url: {
      type: String,
      required: [true, 'Please add the URL to monitor'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Endpoint', endpointSchema);