import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
routes(app);

app.listen(3000, () => {
  console.log('Your routes will be running on http://localhost:3000');
});