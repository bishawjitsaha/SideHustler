// Validate all the data from users.js\

import { ObjectId } from "mongodb";

export const validateUsername = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string: ${str}`;
	}
	str.trim();
	if (!/^[a-zA-Z0-9]+$/.test(str)) throw "String must be alphanumeric";
	return str;
};

export const validateString = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string: ${str}`;
	}
	str.trim();
	return str;
};

export const validateEmail = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string: ${str}`;
	}
	str.trim();
	if (!isNaN(str)) throw "Invalid email";
	const emailRegex = /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/i;
	if (!emailRegex.test(str))
		throw "Contact email must be a valid email address";
	return str;
};

export const validateAge = (age) => {
	if (!age || typeof age !== "number" || age < 0) {
		throw `Invalid age: ${age}`;
	}
	if (age < 18) throw "User must be 18 years or older";
	return age;
};

export const validateBio = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string: ${str}`;
	}
	str.trim();
	if (str.length < 15 || str.length > 250)
		throw "Description must be more than 15 characters";
	return str;
};

export const validatePosts = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array: ${arr}`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (!ObjectId.isValid(arr[i])) throw `Invalid id: ${arr[i]}`;
	}
	return arr;
};

export const validateEducation = (obj) => {
	if (!obj || typeof obj !== "object") {
		throw `Invalid object: ${obj}`;
	}
	if (
		!obj.school ||
		typeof obj.school !== "string" ||
		obj.school.trim().length === 0
	) {
		throw `Invalid string: ${obj.school}`;
	}
	obj.school.trim();
	if (
		!obj.degree ||
		typeof obj.degree !== "string" ||
		obj.degree.trim().length === 0
	) {
		throw `Invalid string: ${obj.degree}`;
	}
	obj.major.trim();
	if (
		!obj.major ||
		typeof obj.major !== "string" ||
		obj.major.trim().length === 0
	) {
		throw `Invalid string: ${obj.major}`;
	}
	obj.major.trim();
	if (!obj.gradYear || typeof obj.gradYear !== "number" || obj.gradYear < 0) {
		throw `Invalid number: ${obj.gradYear}`;
	}

	return obj;
};

export const validateId = (id) => {
	if (!id || id.trim().length === 0) {
		throw `Invalid id: ${id}`;
	}
	id = id.trim();
	if (!ObjectId.isValid(id)) throw `Invalid id: ${id}`;
	return id;
};

export const validateSkills = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array: ${arr}`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object: ${arr[i]}`;
		if (
			!arr[i].name ||
			typeof arr[i].name !== "string" ||
			arr[i].name.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].name}`;
		}
		arr[i] = arr[i].trim();
		if (
			!arr[i].description ||
			typeof arr[i].description !== "string" ||
			arr[i].description.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].description}`;
		}
		arr[i].description.trim();
	}
	return arr;
};

export const checkDate = (date) => {
	if (date === undefined) throw `Error!`;
	if (typeof date !== "string") throw `Error: must be a string!`;
	date = date.trim();
	if (date.length === 0)
		throw `Error: cannot be an empty string or string with just spaces`;
	if (!isNaN(date))
		throw `Error: is not a valid value for as it only contains digits`;

	const monthDays = {
		1: 31,
		2: 28,
		3: 31,
		4: 30,
		5: 31,
		6: 30,
		7: 31,
		8: 31,
		9: 30,
		10: 31,
		11: 30,
		12: 31,
	};
	const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
	if (!dateRegex.test(date))
		throw "Event date must be a valid date in the format MM/DD/YYYY 1";
	const dateParts = date.split("/");
	const month = parseInt(dateParts[0]);
	const day = parseInt(dateParts[1]);
	if (day > monthDays[month] || day < 1)
		throw "Event date must be a valid date in the format MM/DD/YYYY 2";

	const currentDate = new Date();
	const eventDateObj = new Date(date);
	if (currentDate > eventDateObj)
		throw "Event date must be a valid date in the format MM/DD/YYYY 3";

	return date;
};

export const validateExperience = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array: ${arr}`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object: ${arr[i]}`;
		if (
			!arr[i].company ||
			typeof arr[i].company !== "string" ||
			arr[i].company.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].company}`;
		}
		arr[i].company.trim();
		if (
			!arr[i].position ||
			typeof arr[i].position !== "string" ||
			arr[i].position.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].position}`;
		}
		arr[i].position.trim();
		if (
			!arr[i].startDate ||
			typeof arr[i].startDate !== "string" ||
			arr[i].startDate.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].startDate}`;
		}
		arr[i].startDate.trim();
		arr[i].startDate = checkDate(arr[i].startDate);
		if (
			!arr[i].endDate ||
			typeof arr[i].endDate !== "string" ||
			arr[i].endDate.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].endDate}`;
		}
		arr[i].endDate.trim();
		arr[i].endDate = checkDate(arr[i].endDate);
	}
	return arr;
};

export const validateRating = (rating) => {
	if (!rating || typeof rating !== "object") {
		throw `Invalid rating: ${rating}`;
	}
	if (
		!rating.average ||
		typeof rating.average !== "number" ||
		rating.average < 0 ||
		rating.average > 5
	) {
		throw `Invalid number: ${rating.average}`;
	}
	if (
		!rating.total ||
		typeof rating.total !== "number" ||
		rating.total < 0 ||
		rating.total > 5
	) {
		throw `Invalid number: ${rating.count}`;
	}
	return rating;
};

export const validatereservedTime = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array: ${arr}`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object: ${arr[i]}`;
		if (
			!arr[i].dateStart ||
			typeof arr[i].dateStart !== "string" ||
			arr[i].dateStart.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].dateStart}`;
		}
		arr[i].dateStart.trim();
		arr[i].dateStart = checkDate(arr[i].dateStart);
		if (
			!arr[i].timeStart ||
			typeof arr[i].timeStart !== "string" ||
			arr[i].timeStart.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].timeStart}`;
		}
		arr[i].timeStart.trim();
		const timeRegex = /^([0-5][0-9]|59):[0-5][0-9]$/;
		if (!timeRegex.test(arr[i].timeStart))
			throw "Event time must be a valid time in the format HH:MM";

		if (
			!arr[i].timeEnd ||
			typeof arr[i].timeEnd !== "string" ||
			arr[i].timeEnd.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].timeEnd}`;
		}
		arr[i].timeEnd.trim();
		if (!timeRegex.test(arr[i].timeEnd))
			throw "Event time must be a valid time in the format HH:MM";

		if (
			!arr[i].dateEnd ||
			typeof arr[i].dateEnd !== "string" ||
			arr[i].dateEnd.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].dateEnd}`;
		}
		arr[i].dateEnd.trim();
		arr[i].dateEnd = checkDate(arr[i].dateEnd);
	}
	return arr;
};