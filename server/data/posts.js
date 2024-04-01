import {posts, users} from '../config/mongoCollections.js';
import {validatePost, validId, validateTitle, validateDescription, validateTaskTime, validateTaskPayment, validateWorkType} from '../helpers.js';
import {getUserById} from './users.js';
import {ObjectId} from 'mongodb';

export const createPost = async (title, description, taskTime, taskPayment, userId, photos, workType) => {
    let {title, description, taskTime, taskPayment, workType} = validatePost(title, description, taskTime, taskPayment, workType);

    const postCollection = await posts();
    const userCollection = await users();

    const user = await getUserById(userId);
    if (!user) throw "User not found";

    const newPost = {
        title: title,
        description: description,
        tags: [], //array of tags, todo
        taskTime: taskTime,
        taskPayment: taskPayment,
        posterId: userId,
        photos: [], //array of photo objects, todo
        workType: workType, // "remote" or "in-person"
        applicants: [],
        status: "Open", //Status : Open, Closed, In Progress, Completed
        dateCreated: new Date(),
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) throw "Could not add post";
    const newId = insertInfo.insertedId;
    const post = await getPostById(newId);
    if (!post) throw "Could not find post with that id";

    let newUser = await userCollection.findOne(
        { _id: new ObjectId(userId) },
        {$push: {posts: newId}},
        {returnDocument: "after"}
    );

    if(!newUser) throw "Could not add post to user";
    
    return post;
}

export const getPostById = async (id) => {
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(id)});
    if (!post) throw "Post not found";
    post_id = post._id;
    return post;
}

export const updatePostById = async (id, updatedPost) => {
    // title, description, taskTime, taskPayment, userId, photos, workType
    id = validId(id);
    const post = await getPostById(id);
    if (updatedPost.title) post.title = validatePost(updatedPost.title);
    
    let update = {};
    if (updatedPost.title) update.title = validate.validateTitle(updatedPost.title);
    if (updatedPost.description) update.description = validate.validateDescription(updatedPost.description);
    if (updatedPost.taskTime) update.taskTime = validate.validateTaskTime(updatedPost.taskTime);
    if (updatedPost.taskPayment) update.taskPayment = validate.validateTaskPayment(updatedPost.taskPayment);
    if (updatedPost.workType) update.workType = validate.validateWorkType(updatedPost.workType);
    
    const postCollection = await posts();

    const updatedInfo = await postCollection.findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: "after" }
    );
    if (!updatedInfo.value) throw "Could not update post " + id;

    return updatedInfo.value;
}
