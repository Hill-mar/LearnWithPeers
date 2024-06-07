// server/routes/reviews.js

const express = require('express');
const Review = require('../models/Review');
const Attempt = require('../models/Attempt'); // Ensure this path is correct
const Challenge = require('../models/Challenge');
const router = express.Router();

router.post('/send-reviews', async (req, res) => {
  console.log('Received request:', req.body); // Log the incoming request

  const { attemptId, reviewerId, feedbacks, rubric, scaledRating } = req.body;

  try {
      const review = new Review({
          attemptId,
          reviewerId,
          feedbacks,
          rubric, // Save the rubric ratings
          scaledRating // Save the scaled rating
      });
      await review.save();

      // Update the attempt with the overall rating and status
      await Attempt.findByIdAndUpdate(attemptId, {
          status: 'Reviewed',
          overallRating: scaledRating
      });

      res.status(201).json(review);
  } catch (error) {
      console.error('Failed to submit review:', error);
      res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
});

// Route to get reviews for a specific user
router.get('/get-user-reviews/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const reviews = await Review.find()
      .populate({
        path: 'attemptId',
        match: { username: username }, // Filter attempts by username
        populate: {
          path: 'challengeId', // Populate the challengeId within attemptId
          select: 'title createdBy' // Select only the fields you need
        }
      });

    // Log the reviews before filtering
    console.log('Reviews before filtering:', reviews);

    // Filter out reviews where attemptId is null (no match found)
    const userReviews = reviews.filter(review => review.attemptId !== null);

    // Log the filtered reviews
    console.log('Filtered user reviews:', userReviews);

    res.json(userReviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
});


router.get('/get-reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'attemptId',
        populate: {
          path: 'challengeId',
          model: 'Challenge'
        }
      })
      .populate({
        path: 'reviewerId',
        select: 'name'  // Assuming the User model has a 'name' field
      })
      .exec();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

// Fetch review feedback
router.get('/review-feedback', async (req, res) => {
  try {
      const feedbacks = await Review.find().populate({
          path: 'attemptId',
          populate: { path: 'challengeId' } // Populate the challengeId field
      });
      res.json(feedbacks);
  } catch (error) {
      console.error('Error fetching review feedback:', error);
      res.status(500).json({ message: 'Error fetching review feedback' });
  }
});


// Save review ratings
router.post('/rate-review/:reviewId', async (req, res) => {
  try {
      const { reviewId } = req.params;
      const { clarity, helpfulness, timeliness } = req.body;

      const review = await Review.findById(reviewId);
      if (!review) {
          return res.status(404).json({ message: 'Review not found' });
      }

      review.reviewFeedbackRubric = { clarity, helpfulness, timeliness };
      review.reviewFeedbackScaledRating = (clarity + helpfulness + timeliness) / 3; // Example scaling logic

      await review.save();
      res.json({ message: 'Review rating saved successfully', review });
  } catch (error) {
      console.error('Error saving review rating:', error);
      res.status(500).json({ message: 'Error saving review rating' });
  }
});

// Fetch a review by ID
router.get('/:reviewId', async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId)
            .populate('attemptId') // Make sure to populate the attemptId to access attempt details
            .exec();
        if (!review) {
            return res.status(404).send('Review not found');
        }
        res.json(review);
    } catch (error) {
        console.error('Failed to fetch review:', error);
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
});






module.exports = router;
