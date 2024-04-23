import { users, posts } from "../config/mongoCollections.js";
import { ObjectId, ReturnDocument } from "mongodb";
import * as validate from "../validation/userValidation.js";

export async function createUser(id,userName, firstName, lastName, email, age) {
	userName = validate.validateString(userName, "userName");
	firstName = validate.validateString(firstName, "firstName");
	lastName = validate.validateString(lastName, "lastName");
	email = validate.validateEmail(email);
	age = validate.validateAge(age);

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
		education: [
			{
			school: "",
			degree: "",
			major: "",
			gradYear: "",
			}
		],
		experience: [
			{
				company: "",
				position: "",
				startDate: "",
				endDate: "",
			},
		],
		skills: [
			{
				name: "",
				description: "",
			},
		],
		rating: {
			average: null,
			total: 0,
		},
		unAvailable: [{
			dateStart: "",
			timeStart: "",
			timeEnd: "",
			dateEnd: "",
		}],
	};

	const insertInfo = await userCollection.insertOne(newUser);
	if (insertInfo.insertedCount === 0) throw "Could not add user";

	const newId = insertInfo.insertedId;
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

export async function getUserByUserName(userName) {
	userName = validate.validateString(userName, "userName");
	const userCollection = await users();
	const user = await userCollection.findOne({ userName: userName });
	if (user === null) throw "No user with that username";
	user._id = user._id.toString();
	return user;
}

export async function uploadPFP() {
	//upload profile picture in mongodb
}

export async function updateUserById(id, updatedUser) {
	id = validate.validateId(id);
	const currUser = getUserById(id);
	const update = {};
	if (updatedUser.username)
		update.username = validate.validateUsername(
			updatedUser.username,
			"updatedUser"
		);
	if (updatedUser.firstName)
		update.firstName = validate.validateString(
			updatedUser.firstName,
			"updatedUser"
		);
	if (updatedUser.lastName)
		update.lastName = validate.validateString(
			updatedUser.lastName,
			"updatedUser"
		);
	if (updatedUser.email)
		update.email = validate.validateEmail(updatedUser.email, "updatedUser");
	if (updatedUser.age)
		update.age = validate.validateAge(updatedUser.age, "updatedUser");
	if (updatedUser.pfp)
		update.pfp = validate.validateString(updatedUser.pfp, "updatedUser");
	if (updatedUser.posts) {
		const newPosts = validate.validatePosts(
			updatedUser.posts,
			"updatedUser"
		);
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
	if (updatedUser.bio)
		update.bio = validate.validateBio(updatedUser.bio, "updatedUser");
	if (updatedUser.education)
		update.education = validate.validateEducation(
			updatedUser.education,
			"updatedUser"
		);
	if (updatedUser.experience) {
		const newExperience = validate.validateExperience(
			updatedUser.experience,
			"updatedUser"
		);
		const currExperience = currUser.experience;
		update.experience = currExperience.concat(newExperience);
	}
	if (updatedUser.skills) {
		const newSkills = validate.validateSkills(
			updatedUser.skills,
			"updatedUser"
		);
		const currSkills = currUser.skills;
		update.skills = currSkills.concat(newSkills);
	}
	if (updatedUser.rating)
		update.rating = validate.validateRating(
			updatedUser.rating,
			"updatedUser"
		);
	if (updatedUser.unAvailable)
		update.unAvailable = validate.validateUnavailable(
			updatedUser.unAvailable,
			"updatedUser"
		);

	const userCollection = await users();
	const updatedInfo = await userCollection.findOneAndUpdate(
		{ _id: id },
		{ $set: update },
		{ returnDocument: ReturnDocument.After }
	);
	if (!updatedInfo.value) throw "Could not update user " + id;

	return updatedInfo.value;
}
