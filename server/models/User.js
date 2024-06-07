// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joined: { type: Date, default: Date.now },
    age: { type: Number, required: true },
    discipline: { type: String, required: true },
    bio: { type: String, default: '' },
    availability: { type: String, default: 'Unavailable' },
    responseTime: { type: String, default: 'N/A' }
});

module.exports = mongoose.model('User', userSchema);
