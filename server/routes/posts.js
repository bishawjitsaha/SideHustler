import express from "express";
import * as postFunctions from "../data/posts.js";
import verifyToken from "../middleware.js";
const router = express.Router();

router.route("/all").get(async (req, res) => {
  try {
    let allPosts = await postFunctions.getAllPosts();
    if (allPosts) {
      return res.status(200).json({ posts: allPosts });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    let post = await postFunctions.getPostById(req.params.id);
    if (post) {
      return res.status(200).json({ post: post });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/create").post(async (req, res) => {
  try {
    // export const createPost = async (title, description, taskTime, taskPayment, posterId, photos, workType) => {
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

router.route("/update/:id").put(async (req, res) => {
  try {
    let updatedPost = await postFunctions.updatePostById(
      req.params.id,
      req.body
    );
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/update-status/:id").put(async (req, res) => {
  try {
    let updatedPost = await postFunctions.updatePostStatus(
      req.params.id,
      req.body.status
    );
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route(verifyToken, "/applicant-add/:id").put(async (req, res) => {
  try {
    const uid = req.uid;
    let updatedPost = await postFunctions.addApplicant(req.params.id, uid);
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/applicant-remove/:id").put(async (req, res) => {
  try {
    let updatedPost = await postFunctions.removeApplicant(
      req.params.id,
      req.body.applicantId
    );
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route(verifyToken, "/delete/:id").delete(async (req, res) => {
  try {
    const uid = req.uid;
    let deletedPost = await postFunctions.deletePost(req.params.id, uid);
    return res.status(200).json({ post: deletedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

export default router;
