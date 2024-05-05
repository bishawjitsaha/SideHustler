import express from 'express';
import searchFunction from '../data/search.js';
const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    try{
        if (req.query.users) {
            let userQuery = await searchFunction.searchUser(req.query.users);
            return res.status(200).json({ 'users': userQuery });
        }
        if (req.query.posts) {
            let postQuery = await searchFunction.searchPost(req.query.posts);
            return res.status(200).json({ 'posts': postQuery });
        }
        if (req.query.tags) {
            let tagQuery = await searchFunction.searchTag(req.query.tags);
            return res.status(200).json({ 'tags': tagQuery });
        }
        res.status(400).json({ error: 'Invalid query parameter' });       
    }catch (e) {
        console.log(e); // log to console
        res.status(404).json({ error: e });
    }
  })
  


export default router;