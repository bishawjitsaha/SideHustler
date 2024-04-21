import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
routes(app);


app.listen(3000, () => {
  console.log('Your routes will be running on http://localhost:3000');
});