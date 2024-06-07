const express = require('express');
const multer = require('multer');
const Challenge = require('../models/Challenge'); // Ensure this path is correct
const router = express.Router();

// Configure multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST endpoint for creating a new challenge
router.post('/', upload.single('photo'), async (req, res) => {
  console.log(req.body); // Log body to see what is received
  console.log(req.file); // Check if the file is received correctly
  try {
    const { title, description, createdBy } = req.body; // Extracting title and createdBy from the request body
    const photo = req.file ? req.file.buffer : null; // Handling photo upload if present

    // Validate required fields
    if (!title || !description || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new challenge document
    const newChallenge = new Challenge({
      title,
      description,
      createdBy,
      photo
    });

    // Save the new challenge to the database
    await newChallenge.save();
    res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
  } catch (error) {
    console.error('Failed to create challenge:', error);
    res.status(500).json({ message: 'Failed to create challenge', error: error.message });
  }
});



// GET endpoint to fetch an image for a challenge
router.get('/:challengeId/photo', async (req, res) => {
  try {
      const challenge = await Challenge.findById(req.params.challengeId);
      if (!challenge || !challenge.photo) {
          return res.status(404).json({ message: 'No photo found for this challenge' });
      }
      res.set('Content-Type', 'image/png'); // Assuming the image is JPEG; adjust if necessary
      res.send(challenge.photo);
  } catch (error) {
      console.error('Failed to fetch photo:', error);
      res.status(500).json({ message: 'Failed to fetch photo', error: error.message });
  }
});



// GET endpoint for fetching all challenges
router.get('/', async (req, res) => {
  try {
      const challenges = await Challenge.find({});
      res.json(challenges);
  } catch (error) {
      console.error('Failed to fetch challenges:', error);
      res.status(500).json({ message: 'Failed to fetch challenges' });
  }
});


// POST endpoint to update challenge status
router.post('/:challengeId/updateStatus', async (req, res) => {
  const { challengeId } = req.params;
  const { status } = req.body;

  try {
      const updatedChallenge = await Challenge.findByIdAndUpdate(
          challengeId,
          { status: status },
          { new: true } // Return the updated document
      );
      if (!updatedChallenge) {
          return res.status(404).json({ message: 'Challenge not found' });
      }
      res.json({ message: 'Challenge status updated successfully', challenge: updatedChallenge });
  } catch (error) {
      console.error('Failed to update challenge status:', error);
      res.status(500).json({ message: 'Failed to update challenge status', error: error.message });
  }
});


// GET endpoint to fetch a specific challenge by ID
router.get('/:challengeId', async (req, res) => {
  try {
      const challenge = await Challenge.findById(req.params.challengeId);
      if (!challenge) {
          return res.status(404).json({ message: 'Challenge not found' });
      }
      res.json(challenge);
  } catch (error) {
      console.error('Failed to fetch challenge:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

