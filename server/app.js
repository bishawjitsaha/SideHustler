import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://sidehustler.vercel.app',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });
});

app.use(express.json());
routes(app);

server.listen(3000, () => {
  console.log('Your routes will be running on http://localhost:3000');
});
