import {posts, users} from '../config/mongoCollections.js';
import {validatePost, validId, validateTitle, validateDescription, validateTaskTime, validateTaskPayment, validateWorkType, validateStatus} from '../validation/postValidation.js';
import {getUserById} from './users.js';
import {ObjectId} from 'mongodb';

export const createPost = async (title, description, taskTime, taskPayment, posterId, photos, workType, tags) => {
    let validData = validatePost(title, description, taskTime, taskPayment, workType);


    const postCollection = await posts();
    const userCollection = await users();

    const user = await getUserById(posterId);
    if (!user) throw "User not found";

    const newPost = {
        title: validData.title,
        description: validData.description,
        tags: tags, //array of tags, todo
        taskTime: validData.taskTime,
        taskPayment: validData.taskPayment,
        posterId: posterId,
        photos: [], //array of photo objects, todo
        workType: validData.workType, // "remote" or "in-person"
        applicants: [],
        status: "open", //Status : Open, Closed, In Progress, Completed
        selectedApplicant: null,
        dateCreated: new Date(),
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) throw "Could not add post";
    const newId = insertInfo.insertedId.toString();
    const post = await getPostById(newId);
    if (!post) throw "Could not find post with that id";

    let newUser = await userCollection.findOneAndUpdate(
        {_id: posterId},
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
    post._id = post._id.toString();
    return post;
}

export const getAllPosts = async () => {
    const postCollection = await posts();
    const allPosts = await postCollection.find({}).toArray();
    allPosts.forEach(post => {
        post._id = post._id.toString();
    });
    return allPosts;
}

export const updatePostById = async (id, updatedPost) => {
    // title, description, taskTime, taskPayment, userId, photos, workType
    id = validId(id);
    const post = await getPostById(id);
    let update = {};
    if (updatedPost.title) update.title = validateTitle(updatedPost.title);
    if (updatedPost.description) update.description = validateDescription(updatedPost.description);
    if (updatedPost.taskTime) update.taskTime = validateTaskTime(updatedPost.taskTime);
    if (updatedPost.taskPayment) update.taskPayment = validateTaskPayment(updatedPost.taskPayment);
    if (updatedPost.workType) update.workType = validateWorkType(updatedPost.workType);
    if (updatedPost.hasOwnProperty('selectedApplicant')) update.selectedApplicant = updatedPost.selectedApplicant;
    
    const postCollection = await posts();
    const updatedInfo = await postCollection.findOneAndUpdate(
        { _id: new ObjectId(id)},
        { $set: update },
        { returnDocument: "after" }
    );
    if (!updatedInfo) throw "Could not update post " + id;
    updatedInfo._id = updatedInfo._id.toString();

    return updatedInfo;
}

//Check if current user is updater in Routes
export const updatePostStatus = async (id, status) => {
    id = validId(id);
    status = validateStatus(status);
    const post = await getPostById(id);
    const postCollection = await posts();

    const updatedInfo = await postCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: {status: status} },
        { returnDocument: "after" }
    );
    if (!updatedInfo) throw "Could not update post " + id;
    updatedInfo._id = updatedInfo._id.toString();

    return updatedInfo;
}

export const addApplicant = async (postId, applicantId) => {
    postId = validId(postId);
    if(applicantId && applicantId.trim().length > 0){
        applicantId = applicantId.trim();
    }else{
        throw "Applicant ID is required to add Applicant";
    }
    
    const post = await getPostById(postId);
    if (!post) throw "Post not found";
    
    const user = await getUserById(applicantId);
    if (!user) throw "User not found";
    
    if(post.applicants.includes(user._id)) throw "User has already applied to this post";
    if(post.posterId === user._id) throw "User cannot apply to their own post";
    
    const postCollection = await posts();
    let updatedPost = await postCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $push: {applicants: applicantId} },
        { returnDocument: "after" }
    );

    if (!updatedPost) throw "Failed to update post";

    const userCollection = await users();
    let updatedUser = await userCollection.findOneAndUpdate(
        { _id: applicantId },
        { $push: {applications: {postId: postId, status: "pending"}} },
        { returnDocument: "after" }
    );

    if (!updatedUser) throw "Failed to update user";

    updatedPost._id = updatedPost._id.toString();
    return updatedPost;
}

export const removeApplicant = async (postId, applicantId) => {
    postId = validId(postId);
    if (applicantId && applicantId.trim().length > 0) {
        applicantId = applicantId.trim();
    } else {
        throw "Applicant ID is required to add Applicant";
    }

    const postCollection = await posts();
    const userCollection = await users();

    const post = await getPostById(postId);
    if (!post) throw "Post not found";
    const user = await getUserById(applicantId);
    if (!user) throw "User not found";

    let updatedPost = await postCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $pull: {applicants: applicantId} },
        { returnDocument: "after" }
    );

    if (!updatedPost) throw "Failed to update post";
    updatedPost._id = updatedPost._id.toString();

    if(post.selectedApplicant === applicantId){
        updatedPost = await postCollection.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $set: {selectedApplicant: null} },
            { returnDocument: "after" }
        );
        if (!updatedPost) throw "Failed to update post";
        updatedPost._id = updatedPost._id.toString();
    }

    let updatedUser = await userCollection.findOneAndUpdate(
        { _id: applicantId },
        { $pull: { applications: {postId: updatedPost._id}}},
        { returnDocument: "after" }
    );

    if (!updatedUser) throw "Failed to update user";
    
    return updatedPost;
}

export const deletePostById = async (postId, currentUserId) => {
    postId = validId(postId);
    // currentUserId = validId(currentUserId);

    const postCollection = await posts();
    const userCollection = await users();

    const post = await getPostById(postId);
    if(!post) throw "Post not found";

    const user = await getUserById(currentUserId);
    if(!user) throw "User not found";

    if(post.posterId !== user._id) throw "User does not own this post";

    for (let i = 0; i < post.applicants.length; i++) {
       let updatedApp = await userCollection.findOneAndUpdate(
           { _id: post.applicants[i] },
           { $pull: { applications: { postId: post._id } } },
           { returnDocument: "after" }
       );
       if (!updatedApp) throw "Failed to update User applications";
    }
    
    let updateUser = await userCollection.findOneAndUpdate(
         //removes post from posts[] of that user
         { _id: user._id},
         { $pull: { posts: post._id }},
         { returnDocument: "after" }
     );


     if (!updateUser) throw "Failed to update User";

    const deletionInfo = await postCollection.deleteOne({_id: new ObjectId(postId)});
    if (deletionInfo.deletedCount === 0) throw "Could not delete post " + postId;

    return post;
}

export const getApplicants = async (postId) => {
    postId = validId(postId);
    const post = await getPostById(postId);
    if (!post) throw "Post not found";

    const userCollection = await users();
    const usersFound = await userCollection.find({_id: { $in: post.applicants }}).toArray();

    return usersFound;
}
