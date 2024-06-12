// routes/attempts.js
const express = require('express');
const Attempt = require('../models/Attempt'); // Ensure this path is correct
const Challenge = require('../models/Challenge'); // Ensure this path is correct for updating challenge status
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');
const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
});

router.post('/upload-video', upload.single('video'), async (req, res) => {
    try {
      const videoPath = req.file.location; // Save the S3 URL to your database
      res.status(201).json({ message: 'Video uploaded successfully', path: videoPath });
    } catch (error) {
      console.error('Failed to upload video:', error);
      res.status(500).json({ message: 'Failed to upload video', error: error.message });
    }
  });
  
// POST endpoint for submitting a new attempt
router.post('/send-attempts', async (req, res) => {
  const { challengeId, code, username, videoUrl, reviewer, questions } = req.body;

  const newAttempt = new Attempt({
    challengeId,
    code,
    username,
    videoUrl,
    reviewer,
    questions
  });

  try {
    const savedAttempt = await newAttempt.save();

    // Update the challenge status to "Attempted"
    await Challenge.findByIdAndUpdate(challengeId, { status: 'Attempted' });
    
    res.status(201).json(savedAttempt);
  } catch (error) {
    console.error('Error saving attempt:', error); // Add error logging
    res.status(400).json({ message: error.message });
  }
});

router.get('/view-attempts/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const attempts = await Attempt.find({ reviewer: username }).populate('challengeId');
    res.status(200).json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/view-attempts', async (req, res) => {
  try {
    const attempts = await Attempt.find().populate('challengeId'); // Ensure 'challengeId' correctly references the Challenge model
    res.json(attempts);
  } catch (error) {
    console.error('Failed to fetch attempts:', error);
    res.status(500).json({ message: 'Failed to fetch attempts', error: error.message });
  }
});



// Route to get an attempt by ID
router.get('/:attemptId', async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('challengeId');
    if (!attempt) {
      return res.status(404).send('Attempt not found');
    }
    res.json(attempt);
  } catch (error) {
    console.error('Failed to fetch attempt:', error);
    res.status(500).json({ message: 'Failed to fetch attempt', error: error.message });
  }
});

module.exports = router;
