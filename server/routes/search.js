import express from 'express';
import searchFunction from '../data/search';
const router = express.Router();

router
  .route('/search')
  .get(async (req, res) => {
    try{
        if (req.query.user) {
            let userQuery = await searchFunction.searchUser(req.query.user);
            return res.status(200).json({ 'user': userQuery });
        }
        if (req.query.post) {
            let postQuery = await searchFunction.searchPost(req.query.post);
            return res.status(200).json({ 'post': postQuery });
        }
        if (req.query.tag) {
            let tagQuery = await searchFunction.searchTag(req.query.tag);
            return res.status(200).json({ 'tag': tagQuery });
        }
        res.status(400).json({ error: 'Invalid query parameter' });       
    }catch (e) {
        console.log(e); // log to console
        res.status(404).json({ error: e });
    }
  })
  


export default router;