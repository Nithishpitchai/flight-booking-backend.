require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);
  const updateInterval = setInterval(() => {
    socket.emit('flight-update', {
      message: "✈️ Real-time: Flight schedules or prices might have changed!",
      timestamp: new Date(),
    });
  }, 15000);

  socket.on('disconnect', () => {
    clearInterval(updateInterval);
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ ADDED THIS BLOCK FOR BOOKINGS ROUTES
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes); 

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
