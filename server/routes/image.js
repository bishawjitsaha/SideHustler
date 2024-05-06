import { Router } from 'express';
import multer from 'multer';
import { getUserByUserName } from '../data/users.js';
import { uploadPfP, uploadPostImage } from '../data/images.js';

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
  
router.post('/pfpUpload', multer({storage: storage}).single('file'), async (req, res) => {
    try {
        const user = await getUserByUserName(req.body.username);
        if(!user) throw 'User not found';

        const path = req.file.path;
        if (!path) throw 'No file uploaded';

        await uploadPfP(req.body.username, path);

        return res.status(200).json({});
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
});

router.post('/postImgUpload', multer({storage: storage}).single('file'), async (req, res) => {
    try {
        const id = req.body.postID;

        const postwithid = await getPostById(id);
        if (!postwithid) throw 'Post not found';

        const path = req.file.path;
        if (!path) throw 'No file uploaded';

        await uploadPostImage(id, path);

        return res.status(200).json({});
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
});



export default router;