const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',  // This should match the name of the Challenge model
        required: true
    },
    username: { type: String, required: true },
    code: { type: String, required: true },
    videoUrl: { type: String, required: false },
    reviewer: { type: String, required: true },
    questions: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'To be Reviewed' },
    overallRating: { type: Number, default: 0 } // Add this field
});

module.exports = mongoose.model('Attempt', attemptSchema);
