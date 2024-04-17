// Example of a home.js route file
import { Router } from 'express';
const router = Router();
import { getUserById } from '../data/users.js';

router.route('/')
    .get(async(req, res) => {
        try{
          const user = await getUserById("6617209bcb26c3a41f09866f");
            return res.status(200).json(
              user
            )
        }
        catch (err) {
            res.status(400).json({message: err.message})
        }
    })

export default router;
