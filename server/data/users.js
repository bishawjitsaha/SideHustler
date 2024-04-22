import { users, posts } from "../config/mongoCollections.js";
import { ReturnDocument } from "mongodb";
import * as validate from "../validation/userValidation.js";
import { ObjectId } from "mongodb";

export async function createUser(id, userName, firstName, lastName, email, age) {
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
		education: {
			// school: "",
			// degree: "",
			// major: "",
			// gradYear: "",
			school: null,
			degree: null,
			major: null,
			gradYear: null,
		},
		experience: [
			// {
			// 	company: "",
			// 	position: "",
			// 	startDate: "",
			// 	endDate: "",
			// },
		],
		skills: [
			// {
			// 	name: "",
			// 	description: "",
			// },
		],
		rating: {
			average: null,
			total: 0,
		},
		reservedTime: [
			// {
				// dateStart: "",
			// 	timeStart: "",
			// 	timeEnd: "",
			// 	dateEnd: "",
			// },
		],
        applications: [
            // {
            //     postId: "",
            //     status: "",
            // }
        ]
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
	// const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (user === null) throw "No user with that id";
    user._id = user._id.toString();
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
	if (updatedUser.username)
		update.username = validate.validateUsername(updatedUser.username);
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
	if (updatedUser.experience) {
		const newExperience = validate.validateExperience(
			updatedUser.experience
		);
		const currExperience = currUser.experience;
		update.experience = currExperience.concat(newExperience);
	}
	if (updatedUser.skills) {
		const newSkills = validate.validateSkills(updatedUser.skills);
		const currSkills = currUser.skills;
		update.skills = currSkills.concat(newSkills);
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
