import { getUserByUserName } from './users.js';
import { getPostById } from './posts.js';
import { users, posts } from '../config/mongoCollections.js';
import { firebase } from '../firebase/serverconfig.js';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const gm = require('gm').subClass({ imageMagick: true });

const emptyUploadsFolder = async () => {
	const folderPath = "./uploads";
	const files = await fs.promises.readdir(folderPath);

	for (const file of files) {
		if (file === "readme.txt") continue;
		await fs.promises.unlink(`${folderPath}/${file}`);
	}
};

// firebase config for image storage uplaod
const uploadImage = async (imagePath) => {
    const rename = imagePath.split('.');
    const newPath = `${rename[0] + v4()}-1.${rename[1]}`;
    // use image magic to compress image
    try {
        await new Promise((resolve, reject) => {
            gm(imagePath)
                .strip()
                .quality(80)
                .write(newPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    } catch (err) {
        console.error(err);
    };

    const storage = getStorage(firebase);
    const bucketRef = storage.bucket(); 
    const fileName = path.basename(newPath);
    const imageRef = bucketRef.file(`images/${fileName}`);
    try {
        const fileContent = fs.readFileSync(newPath);
        await imageRef.save(fileContent);
        
        const url = await getDownloadURL(imageRef);
        // delete file from local storage
        await emptyUploadsFolder();
        return url;
    } catch (err) {
        console.error("Error uploading image:", err);
    }
}

export const uploadPfP = async (username, imagePath) => {
    const user = await getUserByUserName(username);
    if (!user) throw 'User not found';

    // get firebase storage reference url link
    const url = await uploadImage(imagePath);
    if (!url) throw 'Could not upload image';
    
    const updatedFields = {
        pfp: url
    };
    const id = user._id;
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
        {_id: id},
        {$set: updatedFields},
        {ReturnDocument: 'after'}
    );
    if (!updatedUser) throw "Could not update user " + id;
    updatedUser._id = updatedUser._id.toString();
    return updatedUser;
};


export const uploadPostImage = async (postID, imagePath) => {
    const post = await getPostById(postID);
    if (!post) throw 'Post not found';

    // get firebase storage reference url link
    const url = await uploadImage(imagePath);
    if (!url) throw 'Could not upload image';

    const updatedFields = {
        photos: [url] 
    };

    const postCollection = await posts();
    const updatedPost = await postCollection.findOneAndUpdate(
        {_id: ObjectId (postID)},
        {$set: updatedFields},
        {ReturnDocument: 'after'}
    );
    if (!updatedPost) throw "Could not update post " + postID;
    updatedPost._id = updatedPost._id.toString(); 
    return updatedPost;
};


