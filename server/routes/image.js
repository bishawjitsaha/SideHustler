import { Router } from 'express';
import multer from 'multer';
import { getUserByUserName } from '../data/users.js';
import { getPostById } from '../data/posts.js';
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
        console.log("Uploading Post Image");
        const path = req.file.path;
        if (!path) throw 'No file uploaded';

        const posturl = await uploadPostImage(path);

        console.log("Post Image Uploaded");
        return res.status(200).json(posturl);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({message: e.message})
    }
});



export default router;