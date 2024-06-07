const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as necessary
const Challenge = require('../models/Challenge'); // Adjust the path as necessary
const Attempt = require('../models/Attempt'); // Adjust the path as necessary
const Review = require('../models/Review'); // Adjust the path as necessary
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password, age, discipline, bio } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            age,
            discipline,
            bio
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Failed to register user:', error);
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
});


// Login route


router.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Respond with success if login is valid
        // Include user's username and possibly other needed details
        res.json({
            message: "Logged in successfully",
            userId: user._id,  // Include user ID if needed
            username: user.username  // Include the username in the response
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// Endpoint to get user profile
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
});

// Endpoint to update availability and response time
router.put('/profile/:username', async (req, res) => {
    const { availability, responseTime } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { availability, responseTime },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});


// Endpoint to update availability and response time
router.put('/update-availability', async (req, res) => {
    const { username, availability, responseTime } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { username },
            { availability, responseTime },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update availability', error: error.message });
    }
});





// Endpoint to get all users (including availability and response time)
router.get('/get-users', async (req, res) => {
    try {
        const users = await User.find({}, 'username availability responseTime');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});





// Endpoint to get the count of challenges submitted by a user
router.get('/challenge-count/:username', async (req, res) => {
    try {
        const count = await Challenge.countDocuments({ createdBy: req.params.username });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching challenge count:', error);
        res.status(500).json({ message: 'Error fetching challenge count' });
    }
});

// Endpoint to get the count of attempts done by a user
router.get('/attempt-count/:username', async (req, res) => {
    try {
        const count = await Attempt.countDocuments({ username: req.params.username });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching attempt count:', error);
        res.status(500).json({ message: 'Error fetching attempt count' });
    }
});

// Endpoint to get the count of reviews sent by a user
router.get('/review-count/:username', async (req, res) => {
    try {
        const count = await Review.countDocuments({ reviewerId: req.params.username });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching review count:', error);
        res.status(500).json({ message: 'Error fetching review count' });
    }
});



module.exports = router;


