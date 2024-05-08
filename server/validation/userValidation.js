// Validate all the data from users.js\

import { ObjectId } from "mongodb";
import moment from "moment";

export const validateUsername = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string for username: ${str}`;
	}
	str.trim();
	if (!/^[a-zA-Z0-9]+$/.test(str)) throw "String must be alphanumeric";
	return str;
};

export const validateName = (str) => {
	if (!str || typeof str !== "string" || str.trim().length === 0) {
		throw `Invalid string for name: ${str}`;
	}
	str.trim();
	if (!/^[a-zA-Z]+$/.test(str)) throw "String must be alphabetic";
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
		throw `Invalid string for email: ${str}`;
	}
	str.trim();
	if (!isNaN(str)) throw "Invalid email";
	const emailRegex = /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/i;
	if (!emailRegex.test(str))
		throw `Contact email ${str} must be a valid email address`;
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
		throw `Invalid string for bio: ${str}`;
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
		throw `Invalid string for school: ${obj.school}`;
	}
	if (!/^[a-zA-Z ']+$/.test(obj.school)) throw "School must be alphabetic";

	obj.school.trim();
	if (
		!obj.degree ||
		typeof obj.degree !== "string" ||
		obj.degree.trim().length === 0
	) {
		throw `Invalid string for degree: ${obj.degree}`;
	}
	if (!/^[a-zA-Z ']+$/.test(obj.degree)) throw "Degree must be alphabetic";

	obj.degree.trim();
	if (
		!obj.major ||
		typeof obj.major !== "string" ||
		obj.major.trim().length === 0
	) {
		throw `Invalid string for major: ${obj.major}`;
	}
	if (!/^[a-zA-Z ]+$/.test(obj.major)) throw "Major must be alphabetic";

	obj.major.trim();
	
	if (!obj.gradYear || 
		typeof obj.gradYear !== "string" || 
		obj.gradYear.trim().length === 0 || 
		isNaN(obj.gradYear)){
		throw `Invalid string for Grad Year: ${obj.gradYear}`;
	}
	obj.gradYear.trim();

	if (parseInt(obj.gradYear) < 1930 || parseInt(obj.gradYear) > 2030)
		throw `Grad Year should be between 1930 and 2030: ${obj.gradYear}`;


	return obj;
};

export const validateId = (id) => {
	if (!id || id.trim().length === 0) {
		throw `Invalid id: ${id}`;
	}
	id = id.trim();
	// if (!ObjectId.isValid(id)) throw `Invalid id: ${id}`;
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
			throw `Invalid string for name of skill: ${arr[i].name}`;
		}
		arr[i].name = arr[i].name.trim();
		if (!/^[a-zA-Z\s.']+$/.test(arr[i].name)) throw "Skill name must be alphabetic";

		if (
			!arr[i].description ||
			typeof arr[i].description !== "string" ||
			arr[i].description.trim().length === 0
		) {
			throw `Invalid string for description of skill: ${arr[i].description}`;
		}
		arr[i].description = arr[i].description.trim();
		if (!/^[a-zA-Z\s.,']+$/.test(arr[i].description)) throw "Skill description must be alphabetic";

	}
	return arr;
};

export const checkDate = (start, end) => {
	if (start === undefined) throw `Error!`;
	if (end === undefined) throw `Error!`;

	if((moment(start, 'YYYY-MM-DD', true).isValid())) {
        start = moment(start, "YYYY-MM-DD", true).format("MM-DD-YYYY");
    } else {
        throw "Invalid start date format";
    }
    
    if(moment(end, 'YYYY-MM-DD', true).isValid()) {
        end = moment(end, 'YYYY-MM-DD', true).format("MM-DD-YYYY");
    } else {
        throw "Invalid end date format";
    }

	if(!moment(start, 'MM-DD-YYYY', true).isValid()){
        throw `Invalid Date, ${date}, must be in MM/DD/YYYY format`;
    }

	if(!moment(end, 'MM-DD-YYYY', true).isValid()){
		throw `Invalid Date, ${date}, must be in MM/DD/YYYY format`;
	}

    const startDate = moment(start, "MM-DD-YYYY");
	const endDate = moment(end, "MM-DD-YYYY");
	if(startDate.isAfter(endDate)){
		throw "Start date must be before end date";
	}

	return {startDate, endDate};

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
			throw `Invalid string for company: ${arr[i].company}`;
		}
		arr[i].company.trim();
		if (!/^[a-zA-Z\s.']+$/.test(arr[i].company)) throw "Company must be alphabetic";

		if (
			!arr[i].position ||
			typeof arr[i].position !== "string" ||
			arr[i].position.trim().length === 0
		) {
			throw `Invalid string for position: ${arr[i].position}`;
		}
		arr[i].position.trim();
		if (!/^[a-zA-Z\s]+$/.test(arr[i].position)) throw "Position must be alphabetic";

		if (
			!arr[i].startDate ||
			typeof arr[i].startDate !== "string" ||
			arr[i].startDate.trim().length === 0
		) {
			throw `Invalid string for Start Date: ${arr[i].startDate}`;
		}
		arr[i].startDate.trim();
		if (
			!arr[i].endDate ||
			typeof arr[i].endDate !== "string" ||
			arr[i].endDate.trim().length === 0
		) {
			throw `Invalid string for End Date: ${arr[i].endDate}`;
		}
		arr[i].endDate.trim();

		const {startDate, endDate} = checkDate(arr[i].startDate, arr[i].endDate);

		arr[i].startDate = startDate.format("YYYY-MM-DD");
		arr[i].endDate = endDate.format("YYYY-MM-DD");
		
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
		rating.total < 0
	) {
		throw `Invalid number: ${rating.total}`;
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
		// arr[i].dateStart = checkDate(arr[i].dateStart);
		if (
			!arr[i].timeStart ||
			typeof arr[i].timeStart !== "string" ||
			arr[i].timeStart.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].timeStart}`;
		}
		arr[i].timeStart.trim();
		// const timeRegex = /\b((1[0-2])|([1-9])):(0[0-9]|[1-5][0-9]) [AP]M\b/i;
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
		if (!timeRegex.test(arr[i].timeStart))
			throw `Start time ${arr[i].timeStart} must be a valid time in the format HH:MM`;

		if (
			!arr[i].timeEnd ||
			typeof arr[i].timeEnd !== "string" ||
			arr[i].timeEnd.trim().length === 0
		) {
			throw `Invalid string: ${arr[i].timeEnd}`;
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
			throw `Invalid string: ${arr[i].dateEnd}`;
		}
		arr[i].dateEnd.trim();
        const {startDate, endDate} = checkDate(arr[i].dateStart, arr[i].dateEnd);
		arr[i].dateStart = startDate;
        arr[i].dateEnd  = endDate;
	}
	return arr;
};

export const validateApplications = (arr) => {
    if (!arr || !Array.isArray(arr)) {
        throw `Invalid array: ${arr}`;
    }
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== "object") throw `Invalid object: ${arr[i]}`;
        if (
            !arr[i].postId ||
            typeof arr[i].postId !== "string" ||
            arr[i].postId.trim().length === 0
        ) {
            throw `Invalid string: ${arr[i].postId}`;
        }
        arr[i].postId.trim();
        if (
            !arr[i].status ||
            typeof arr[i].status !== "string" ||
            arr[i].status.trim().length === 0
        ) {
            throw `Invalid string: ${arr[i].status}`;
        }
        arr[i].status.trim().toLowerCase();
        if(arr[i].status !== "pending" || arr[i].status !== "accepted" || arr[i].status !== "rejected"){
            throw `Invalid status: ${arr[i].status}`;
        }
    }
    return arr;
}
