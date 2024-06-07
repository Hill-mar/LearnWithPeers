const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    attemptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true
    },
    reviewerId: { type: String, required: true },
    feedbacks: [
        {
            question: { type: String, required: true },
            response: { type: String, required: true }
        }
    ],
    rubric: {
        codeQuality: { type: Number, default: 0 },
        functionality: { type: Number, default: 0 },
        readability: { type: Number, default: 0 }
    },
    scaledRating: { type: Number, default: 0 },
    reviewFeedbackRubric: {
        clarity: { type: Number, default: 0 },
        helpfulness: { type: Number, default: 0 },
        timeliness: { type: Number, default: 0 }
    },
    reviewFeedbackScaledRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
