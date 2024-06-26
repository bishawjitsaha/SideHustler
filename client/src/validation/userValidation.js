// Validate all the data from users.js\

// import { ObjectId } from "mongodb";

export const validateString = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string`;
	}
	str.trim();
	return str;
};

export const validateUsername = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid username`;
	}
	str.trim();
	if (!/^[a-zA-Z0-9]+$/.test(str)) throw "Username must be alphanumeric";
	return str;
};

export const validateName = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid name`;
	}
	str.trim();
	if (!/^[a-zA-Z]+$/.test(str)) throw "Name must be alphabetic";
	return str;
};

export const validateEmail = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid email`;
	}
	str.trim();
	if (!isNaN(str)) throw "Invalid email";
	const emailRegex = /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/i;
	if (!emailRegex.test(str))
		throw `Contact email must be a valid email address`;
	return str;
};

export const validateAge = (age) => {
	if (!age || typeof age !== "number" || age < 0) {
		throw `Invalid age`;
	}
	if (age < 18) throw "User must be 18 years or older";
	if (age > 120) throw "User must be 120 years or younger";
	return age;
};

export const validateBio = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid bio`;
	}
	str.trim();
	if (str.length < 15 || str.length > 250)
		throw "Description must be more than 15 characters";
	return str;
};

export const validateEducation = (obj) => {
	if (!obj || typeof obj !== "object") {
		throw `Invalid object`;
	}
	if (
		!obj.school ||
		typeof obj.school !== "string" ||
		obj.school.trim().length === 0
	) {
		throw `Invalid school`;
	}
	if (!/^[a-zA-Z ']+$/.test(obj.school)) throw "School must be alphabetic";

	obj.school.trim();
	if (
		!obj.degree ||
		typeof obj.degree !== "string" ||
		obj.degree.trim().length === 0
	) {
		throw `Invalid degree`;
	}
	if (!/^[a-zA-Z ']+$/.test(obj.degree)) throw "Degree must be alphabetic";

	obj.degree.trim();
	if (
		!obj.major ||
		typeof obj.major !== "string" ||
		obj.major.trim().length === 0
	) {
		throw `Invalid major`;
	}
	if (!/^[a-zA-Z ]+$/.test(obj.major)) throw "Major must be alphabetic";

	obj.major.trim();
	
	if (!obj.gradYear || 
		typeof obj.gradYear !== "string" || 
		obj.gradYear.trim().length === 0 || 
		isNaN(obj.gradYear)){
		throw `Invalid year for Grad Year`;
	}
	obj.gradYear.trim();

	if (parseInt(obj.gradYear) < 1930 || parseInt(obj.gradYear) > 2030)
		throw `Grad Year should be between 1930 and 2030`;

	return obj;
};

export const validateId = (id) => {
	if (!id || id.trim().length === 0) {
		throw `Invalid id`;
	}
	id = id.trim();
	return id;
};

export const validateSkills = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object`;
		if (
			!arr[i].name ||
			typeof arr[i].name !== "string" ||
			arr[i].name.trim().length === 0
		) {
			throw `Invalid name of skill`;
		}
		arr[i].name = arr[i].name.trim();
		if (!/^[a-zA-Z\s.']+$/.test(arr[i].name)) throw "Skill name must be alphabetic";

		if (
			!arr[i].description ||
			typeof arr[i].description !== "string" ||
			arr[i].description.trim().length === 0
		) {
			throw `Invalid description of skill`;
		}
		arr[i].description = arr[i].description.trim();
		if (!/^[a-zA-Z\s.,']+$/.test(arr[i].description)) throw "Skill description must be alphabetic";

	}
	return arr;
};

export const checkDate = (date) => {
	if (date === undefined) throw `Invalid Date`;
	if (typeof date !== "string") throw `Date must be a string!`;
	date = date.trim();
	if (date.length === 0)
		throw `Date cannot be an empty or just spaces`;

	return date;
};

export const validateExperience = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object`;
		if (
			!arr[i].company ||
			typeof arr[i].company !== "string" ||
			arr[i].company.trim().length === 0
		) {
			throw `Invalid company`;
		}
		arr[i].company.trim();
		if (!/^[a-zA-Z\s]+$/.test(arr[i].company)) throw "Company must be alphabetic";

		if (
			!arr[i].position ||
			typeof arr[i].position !== "string" ||
			arr[i].position.trim().length === 0
		) {
			throw `Invalid position`;
		}
		arr[i].position.trim();
		if (!/^[a-zA-Z\s]+$/.test(arr[i].position)) throw "Position must be alphabetic";

		if (
			!arr[i].startDate ||
			typeof arr[i].startDate !== "string" ||
			arr[i].startDate.trim().length === 0
		) {
			throw `Invalid Start Date`;
		}
		arr[i].startDate.trim();
		arr[i].startDate = checkDate(arr[i].startDate);
		if (
			!arr[i].endDate ||
			typeof arr[i].endDate !== "string" ||
			arr[i].endDate.trim().length === 0
		) {
			throw `Invalid End Date`;
		}
		arr[i].endDate.trim();
		arr[i].endDate = checkDate(arr[i].endDate);
	}
	return arr;
};

export const validateRating = (rating) => {
	if (!rating || typeof rating !== "object") {
		throw `Invalid rating`;
	}
	if (
		!rating.average ||
		typeof rating.average !== "number" ||
		rating.average < 0 ||
		rating.average > 5
	) {
		throw `Invalid number`;
	}
	if (
		!rating.total ||
		typeof rating.total !== "number" ||
		rating.total < 0
	) {
		throw `Invalid number`;
	}
	return rating;
};

export const validatereservedTime = (arr) => {
	if (!arr || !Array.isArray(arr)) {
		throw `Invalid array`;
	}
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "object") throw `Invalid object`;
		if (
			!arr[i].dateStart ||
			typeof arr[i].dateStart !== "string" ||
			arr[i].dateStart.trim().length === 0
		) {
			throw `Invalid Start Date`;
		}
		arr[i].dateStart.trim();
		arr[i].dateStart = checkDate(arr[i].dateStart);
		if (
			!arr[i].timeStart ||
			typeof arr[i].timeStart !== "string" ||
			arr[i].timeStart.trim().length === 0
		) {
			throw `Invalid Start Time`;
		}
		arr[i].timeStart.trim();
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
		if (!timeRegex.test(arr[i].timeStart))
			throw `Start time must be a valid time in the format HH:MM`;

		if (
			!arr[i].timeEnd ||
			typeof arr[i].timeEnd !== "string" ||
			arr[i].timeEnd.trim().length === 0
		) {
			throw `Invalid End Time`;
		}
		arr[i].timeEnd.trim();
        const timeRegex2 = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
		if (!timeRegex2.test(arr[i].timeEnd))
			throw "End time must be a valid time in the format HH:MM";

		if (
			!arr[i].dateEnd ||
			typeof arr[i].dateEnd !== "string" ||
			arr[i].dateEnd.trim().length === 0
		) {
			throw `Invalid End Date`;
		}
		arr[i].dateEnd.trim();
		arr[i].dateEnd = checkDate(arr[i].dateEnd);
	}
	return arr;
};

export const validateApplications = (arr) => {
    if (!arr || !Array.isArray(arr)) {
        throw `Invalid array`;
    }
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== "object") throw `Invalid object`;
        if (
            !arr[i].postId ||
            typeof arr[i].postId !== "string" ||
            arr[i].postId.trim().length === 0
        ) {
            throw `Invalid Post Id`;
        }
        arr[i].postId.trim();
        if (
            !arr[i].status ||
            typeof arr[i].status !== "string" ||
            arr[i].status.trim().length === 0
        ) {
            throw `Invalid Status`;
        }
        arr[i].status.trim().toLowerCase();
        if(arr[i].status !== "pending" || arr[i].status !== "accepted" || arr[i].status !== "rejected"){
            throw `Invalid status for application`;
        }
    }
    return arr;
}
