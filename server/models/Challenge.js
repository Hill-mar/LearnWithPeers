// server/models/Challenge.js

const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: Buffer,
    required: false
  },
  createdBy: {
    type: String,
    
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: { type: String, default: 'Open' } // Open, Attempted, Reviewed
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
