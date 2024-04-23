// Example of a home.js route file
import { Router } from 'express';
const router = Router();
import { getUserById, getUserByUserName } from '../data/users.js';

router.route('/:username')
    .get(async(req, res) => {
        try{
          const user = await getUserByUserName(`${req.params.username}`);
            return res.status(200).json(
              user
            )
        }
        catch (err) {
            res.status(400).json({message: err.message})
        }
    })

export default router;
