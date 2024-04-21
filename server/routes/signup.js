import express from 'express';
import * as userFunct  from "../data/users.js";
import verifyToken from '../middleware.js';
const router = express.Router();

router
  .route('/')
  .post(verifyToken,async (req, res) => {
    let {uid, userName, firstName, lastName, email, age} = req.body;
    try{
      let user = await userFunct.createUser( uid, userName, firstName, lastName, email, age );
      res.status(200).json({ error: 'Invalid query parameter' }); 
    }catch(e){
      console.log(e);
      res.status(404).json({ error: e });
    }
    



  })


export default router;
