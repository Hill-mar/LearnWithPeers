const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path'); // Add this line to require the path module

const challengeRoutes = require('../routes/challenges')
const attemptsRoutes = require('../routes/attempts');
const userRoutes = require('../routes/users');
const reviewsRoutes = require('../routes/reviews');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "https://learn-with-peers-frontend.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://learn-with-peers-frontend.vercel.app";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/attempts', attemptsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to LearnWithPeers!');
});

// In-memory store for online users
const onlineUsers = {};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('userOnline', (username) => {
    onlineUsers[username] = socket.id;
    io.emit('updateUserStatus', { username, status: 'online' });
    console.log(`User ${username} is online`);
  });

  socket.on('requestLiveChat', ({ reviewerId, attemptId }) => {
    const reviewerSocketId = onlineUsers[reviewerId];
    if (reviewerSocketId) {
      io.to(reviewerSocketId).emit('liveChatRequest', { attemptId });
    }
  });

  socket.on('disconnect', () => {
    for (const [username, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) {
        delete onlineUsers[username];
        io.emit('updateUserStatus', { username, status: 'offline' });
        console.log(`User ${username} is offline`);
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
