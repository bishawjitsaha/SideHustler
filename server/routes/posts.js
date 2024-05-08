import express from "express";
import * as postFunctions from "../data/posts.js";
import { getUserById, updateSelectedApplicant } from "../data/users.js";
import { createNotification } from "../data/notifications.js";
import { createChat } from "../data/messages.js";
import verifyToken from "../middleware.js";

const router = express.Router();

router.route("/all").get(verifyToken, async (req, res) => {
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

router.route("/:id").get(verifyToken, async (req, res) => {
  try {
    let post = await postFunctions.getPostById(req.params.id);
    let applicants = await postFunctions.getApplicants(req.params.id);
    post.applicants = applicants;
    if (post) {
      return res.status(200).json({ post: post });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
})
.put(verifyToken, async (req, res) => {
  try {
    let updatedApplicant = await updateSelectedApplicant(
      req.params.id,
      req.body.selectedApplicant
    );
    const currPost = await postFunctions.getPostById(req.params.id);
    if (req.body.selectedApplicant !== null) {

      // notify the selected applicant that they have been chosen
      const selectedAppNoti = await createNotification(req.body.selectedApplicant,
        "post",
        "You have been chosen for a post",
        `/post/${req.params.id}`
      );

      // notify the chooser that they have successfully chosen an applicant
      const postOwnerNoti = await createNotification(currPost.posterId,
        "post", 
        "You have successfully chosen an applicant: " + updatedApplicant.userName,
        `/user/${updatedApplicant.userName}`
      );

      const currUser = await getUserById(currPost.posterId);;

      // open up a chat between them
      const newChat = createChat(updatedApplicant.userName, currUser.userName);
    }
    else if (req.body.selectedApplicant === null && currPost.selectedApplicant !== null) {
      const unChosenUser = await getUserById(currPost.selectedApplicant);

      const postOwnerNoti = await createNotification(currPost.posterId,
        "post",
        "You have unchosen an applicant: " + unChosenUser.userName,
        `/user/${unChosenUser.userName}`
      );

    }

    let updatedPost = await postFunctions.updatePostById(
      req.params.id,
      req.body
    );

    let status = req.body.selectedApplicant ? "In progress" : "Open"

    let updatedStatus = await postFunctions.updatePostStatus(
      req.params.id,
      status
    );
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/create").post(verifyToken, async (req, res) => {
  try {
    let newPost = await postFunctions.createPost(
      req.body.title,
      req.body.description,
      req.body.taskTime,
      req.body.taskPayment,
      req.body.posterId,
      req.body.photos,
      req.body.workType,
      req.body.tags,
    );
    return res.status(200).json({ post: newPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/update/:id").put(verifyToken, async (req, res) => {
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

router.route("/update-status/:id").put(verifyToken, async (req, res) => {
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

router.route("/applicant-add/:id").get(verifyToken, async (req, res) => {
  try {
    // console.log('hello')
    const uid = req.uid;
    // console.log(req.params.id, uid)

    let updatedPost = await postFunctions.addApplicant(req.params.id, uid);
    
    
    // notify the posterID that someone has applied
    const post = await postFunctions.getPostById(req.params.id);
    const getApplicant = await getUserById(uid);

    const noti = await createNotification(post.posterId,
      "post",
      getApplicant.userName + "has applied to your post",
      `/user/${getApplicant.userName}`
    );

    //notify the applicant that they have applied
    const applicantNoti = await createNotification(uid,
      "post",
      "You have applied to a post",
      `/post/${req.params.id}`
    );

    // console.log(updatedPost)
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.route("/applicant-remove/:id").get(verifyToken, async (req, res) => {
  try {
    // console.log('remove')
    const uid = req.uid;
    // console.log(req.params.id, uid)
    let updatedPost = await postFunctions.removeApplicant(
      req.params.id,
      uid
    );

    // notify the posterID that someone has removed their application
    const post = await postFunctions.getPostById(req.params.id);
    const getApplicant = await getUserById(uid);

    const noti = await createNotification(post.posterId,
      "post",
      getApplicant.userName + " has removed their application to your post",
      `/user/${getApplicant.userName}`
    );

    //notify the applicant that they have removed their application
    const applicantNoti = await createNotification(uid,
      "post",
      "You have removed your application to a post",
      `/post/${req.params.id}`
    );
    return res.status(200).json({ post: updatedPost });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.route(verifyToken, "/delete/:id").delete(verifyToken, async (req, res) => {
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
