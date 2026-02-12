const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/database');
const emailRoutes = require('./routes/emailRoutes');
const { startSMTPServer } = require('./services/smtpServer');
const { startCleanupService } = require('./services/cleanup');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to database and start services
connectDB().then(() => {
  // Routes
  app.use('/api/emails', emailRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TempMail API is running', database: 'SQLite' });
  });

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('subscribe', (emailAddress) => {
      socket.join(emailAddress);
      console.log(`Client subscribed to: ${emailAddress}`);
    });
    
    socket.on('unsubscribe', (emailAddress) => {
      socket.leave(emailAddress);
      console.log(`Client unsubscribed from: ${emailAddress}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Using SQLite database`);
    
    // Start SMTP server for receiving emails
    startSMTPServer(io);
    
    // Start cleanup service for expired emails
    startCleanupService();
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = { io };
