import express from 'express';
import routes from './routes/index.js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// Set up CORS middleware
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://sidehustler.vercel.app',
      // Add other allowed origins as needed
    ],
    methods: ['GET', 'POST'],
  },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'send_message' event
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    // Broadcast the received message to all clients except the sender
    socket.broadcast.emit('receive_message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.json());
routes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
