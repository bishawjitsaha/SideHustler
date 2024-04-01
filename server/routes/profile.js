// Example of a home.js route file
import express from 'express';
const router = express.Router();

router.get('/profile', (req, res) => {
  res.send('Profiles page');
});

export default router;
