import { users, posts } from "../config/mongoCollections.js";
import * as validate from "../validation/userValidation.js";
import { ObjectId } from "mongodb";

export async function createUser(id,userName, firstName, lastName, email, age, isSocialSignIn) {
	if(isSocialSignIn){
		email = validate.validateEmail(email);
		userName = "";
		firstName = "";
		lastName = "";
		age = "";
	} else {
		userName = validate.validateUsername(userName, "userName");
		firstName = validate.validateString(firstName, "firstName");
		lastName = validate.validateString(lastName, "lastName");
		email = validate.validateEmail(email);
		age = validate.validateAge(age);
	}

	const userCollection = await users();
	const newUser = {
		_id : id,
		userName: userName,
		firstName: firstName,
		lastName: lastName,
		email: email,
		age: age,
		pfp: "",
		posts: [],
		bio: "",
		education: {
			school: null,
			degree: null,
			major: null,
			gradYear: null,
		},
		experience: [],
		skills: [],
		rating: {
			average: null,
			total: 0,
		},
		reservedTime: [],
        applications: [],
		chatLog: []
	};

	const insertInfo = await userCollection.insertOne(newUser);
	if (insertInfo.insertedCount === 0) throw "Could not add user";

	const newId = insertInfo.insertedId.toString();
	const user = await getUserById(newId);
	return user;
}

export async function getUserById(id) {
	id = validate.validateId(id);
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: id });
	if (user === null) throw "No user with that id";
	return user;
}
export async function doesUserExist(userName){
	userName = validate.validateString(userName, "userName");
	const userCollection = await users();
	const user = await userCollection.findOne({ "userName": { "$regex": `^${userName}$`, "$options": "i" } });
	if (!user){ // if the user does not exist return false
		return false;
	}
	return true;
}

export async function getUserByUserName(userName) {
	userName = validate.validateString(userName, "userName");
	const userCollection = await users();
	const user = await userCollection.findOne({ "userName": { "$regex": `^${userName}$`, "$options": "i" } });
	if (user === null) throw "No user with that username";
	return user;
}

export async function uploadPFP() {
	//upload profile picture in mongodb
}

export async function updateRating(id, rating) {
	id = validate.validateId(id);
	if (!rating || typeof rating !== "number" || rating < 0 || rating > 5) {
		throw `Invalid rating: ${rating}`;
	}

	// get current rating
	const currUser = await getUserById(id);
	const currRating = currUser.rating;
	const totalRating = currRating.average * currRating.total + rating;
	const total = currRating.total + 1;
	const newRating = Math.round((totalRating / total) * 100) / 100;
    return await updateUserById(id, {
		rating: { average: newRating, total: total },
	});
}

export async function updateReservedTime(id, reservedTime) {
	id = validate.validateId(id);
	if (!Array.isArray(reservedTime)) reservedTime = [reservedTime];
	reservedTime = validate.validatereservedTime(reservedTime);

	return await updateUserById(id, { reservedTime: reservedTime });
}

export async function updateUserById(id, updatedUser) {
	id = validate.validateId(id);
	const currUser = await getUserById(id);
	const update = {};
	if (updatedUser.userName)
		update.userName = validate.validateUsername(updatedUser.userName);
	if (updatedUser.firstName)
		update.firstName = validate.validateString(updatedUser.firstName);
	if (updatedUser.lastName)
		update.lastName = validate.validateString(updatedUser.lastName);
	if (updatedUser.email)
		update.email = validate.validateEmail(updatedUser.email);
	if (updatedUser.age) update.age = validate.validateAge(updatedUser.age);
	// update pfp using uploadPFP function
	if (updatedUser.posts) {
		const newPosts = validate.validatePosts(updatedUser.posts);
		// Check if the posts exist Must update post collection before user
		const postCollection = await posts();
		for (let i = 0; i < updatedUser.posts.length; i++) {
			const post = await postCollection.findOne({
				_id: updatedUser.posts[i],
			});
			if (!post)
				throw (
					"Post with id " + updatedUser.posts[i] + " does not exist"
				);
		}
		const currPosts = currUser.posts;
		update.posts = currPosts.concat(newPosts);
	}
	if (updatedUser.bio) update.bio = validate.validateBio(updatedUser.bio);
	if (updatedUser.education)
		update.education = validate.validateEducation(updatedUser.education);
	if (updatedUser.experience && updatedUser.experience.length > 0) {
		const newExperience = validate.validateExperience(updatedUser.experience);
		if (currUser.experience && currUser.experience.length > 0) {
			update.experience = newExperience.map(newExp => {
				const matchingExp = currUser.experience.find(currExp => currExp.company === newExp.company);
				return matchingExp ? matchingExp : newExp;
			});
		} else {
			update.experience = newExperience;
		}
	} else {
		update.experience = [];
	}
	if (updatedUser.skills && updatedUser.skills.length > 0) {
		const newSkills = validate.validateSkills(updatedUser.skills);
		if(currUser.skills && currUser.skills.length > 0){
			update.skills = newSkills.map(newSkill => {
				const matchingSkill = currUser.skills.find(currSkill => currSkill.name === newSkill.name);
				return matchingSkill ? matchingSkill : newSkill;
			});
		} else {
			update.skills = newSkills;
		}
	} else {
		update.skills = [];
	}
	
	if (updatedUser.rating)
		update.rating = validate.validateRating(updatedUser.rating);
	if (updatedUser.reservedTime) {
		const newReservedTime = validate.validatereservedTime(
			updatedUser.reservedTime
		);
		const currReservedTime = currUser.reservedTime;
		update.reservedTime = currReservedTime.concat(newReservedTime);
	}
    if(updatedUser.applications){
        const newApplications = validate.validateApplications(updatedUser.applications);
        const currApplications = currUser.applications;
        update.applications = currApplications.concat(newApplications);
    }

	const userCollection = await users();
	const updatedInfo = await userCollection.findOneAndUpdate(
		// { _id: new ObjectId(id) },
		{ _id: id},
		{ $set: update },
		{ returnDocument: "after" }
	);
	if (!updatedInfo) throw "Could not update user " + id;
    updatedInfo._id = updatedInfo._id.toString();
	return updatedInfo;
}

export async function updateSelectedApplicant(postId, userId) {

	postId = validate.validateId(postId);
	const postCollection = await posts();
	const post = await postCollection.findOne({ _id: new ObjectId(postId)});
	if (!post) throw "Post not found";

	const userCollection = await users();
	let user;
	let updatedApplicant;
	if(userId !== null){ // means that a user has been selected
		// console.log("this route is being hit ", userId);
		userId = validate.validateId(userId);
		user = await userCollection.findOne({ _id: userId });
		if (!user) throw "User not found";

		const startDate = new Date(post.taskTime.dateStart);
		const endDate = new Date(post.taskTime.dateEnd);
		const formattedDate = {
			dateStart: startDate.toISOString().split("T")[0],
			dateEnd: endDate.toISOString().split("T")[0],
			timeStart: post.taskTime.timeStart,
			timeEnd: post.taskTime.timeEnd,
		};

		updatedApplicant = await userCollection.findOneAndUpdate(
			{ _id: userId },
			{ $push: { reservedTime: formattedDate } },
			{ returnDocument: "after" }
		);
		if (!updatedApplicant) throw "Failed to update user";

		const updatedApplicationPostStatus = await userCollection.findOneAndUpdate(
			{ _id: userId, "applications.postId": postId },
			{ $set: { "applications.$.status": "Accepted" } },
			{ returnDocument: "after" }
		);
		if (!updatedApplicationPostStatus) throw "Failed to update user";

	
		return updatedApplicant;
	}
	else{ // means that the selected applicant has been removed
		if (post.selectedApplicant === null) return;
		userId = post.selectedApplicant;
		userId = validate.validateId(userId);
		user = await userCollection.findOne({ _id: userId });
		if (!user) throw "User not found";
		updatedApplicant = await userCollection.findOneAndUpdate(
			{ _id: userId },
			{ $pull: { reservedTime: post.taskTime } },
			{ returnDocument: "after" }
		);
		if (!updatedApplicant) throw "Failed to update user";

		const updatedApplicationPostStatus = await userCollection.findOneAndUpdate(
			{ _id: userId, "applications.postId": postId },
			{ $set: { "applications.$.status": "Rejected" } },
			{ returnDocument: "after" }
		);
		if (!updatedApplicationPostStatus) throw "Failed to update user";

		return updatedApplicant;
	}
	
}