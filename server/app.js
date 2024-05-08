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

const io = new Server(server, {
  cors: {
    // origin: 'http://localhost:5173/',
    origin: [
      'http://localhost:5173',
      'https://sidehustler.vercel.app',
      'https://sidehustler.vercel.app/chat/663af57b5813a49f2a3d3eaa',
    ],
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
  console.log('Your routes will be running on https://localhost:5173/');
  // console.log('Your routes will be running on https://sidehustler-backend.onrender.com');
});
