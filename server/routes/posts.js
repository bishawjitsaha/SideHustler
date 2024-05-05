import express from "express";
import * as postFunctions from "../data/posts.js";
const router = express.Router();

router.route("/all").get(async (req, res) => {
    try {
        let allPosts = await postFunctions.getAllPosts();
        if(allPosts){
            return res.status(200).json({posts: allPosts})
        }
    } catch (e) {
        console.log(e); // log to console
        res.status(404).json({ error: e });
    }
});

router.route("/create").post(async (req, res) => {
    try {
        let newPost = await postFunctions.createPost(
            req.body.title,
            req.body.description,
            req.body.taskTime,
            req.body.taskPayment,
            req.body.posterId,
            req.body.photos,
            req.body.workType
        );
        return res.status(200).json({ post: newPost });
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
    }
});

export default router;
