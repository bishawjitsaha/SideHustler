import { Router, application } from 'express';
import { doesUserExist } from '../data/users.js';
const router = Router();

router.route('/verifyUser/:username')
  .get(async (req,res) => {
    let enteredUser = req.params.username;
    try{
      let userFlag = await doesUserExist(enteredUser);
      if(userFlag){ //
        return res.status(200).json({isUserNameUnique: false}); //if the user exists we return false as in it is not unique.
      }
      else{
        return res.status(200).json({isUserNameUnique: true});
        //if it does not we return true as in it is unique
      }
    } catch (e) {
        return res.status(400).json({message: e});
    }
  }) 

export default router;