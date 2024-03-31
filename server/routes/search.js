import express from 'express';
import searchFunction from '../data/search';
const router = express.Router();

router
  .route('/search')
  .get(async (req, res) => {
    try{
        const [userQuery, postQuery, tagQuery] = await Promise.all([
            searchFunction.searchUser(req.query.user),
            searchFunction.searchPost(req.query.post),
            searchFunction.searchTag(req.query.tag),
        ]);
        res.status(200).json({'user':userQuery, 'post':postQuery, 'tag':tagQuery});        
    }catch (e) {
        console.log(e); // page console
        res.status(404).json({error: e});
    }
  })
  
export default router;