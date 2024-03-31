// Validate all the data from users.js\

import { ObjectId } from "mongodb";

export const validateUsername = (str) => {
    if (!str || typeof str !== "string" || str.trim().length === 0) {
        throw `Invalid string: ${str}`;
    }
    str.trim();
    if (!/^[a-zA-Z0-9]+$/.test(str)) throw "String must be alphanumeric";
    return str;
}

export const validateString = (str) => {
    if (!str || typeof str !== "string" || str.trim().length === 0) {
        throw `Invalid string: ${str}`;
    }
    str.trim();
    return str;
}

export const validateEmail = (str) => {
    if (!str || typeof str !== "string" || str.trim().length === 0) {
        throw `Invalid string: ${str}`;
    }
    str.trim();
    if(!isNaN(str))
        throw "Invalid email";
    const emailRegex = /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/i;
    if(!emailRegex.test(str)) throw 'Contact email must be a valid email address';
    return str;
}

export const validateAge = (age) => {
    if (!age || typeof age !== "number" || age < 0) {
        throw `Invalid age: ${age}`;
    }
    if (age < 18) throw "User must be 18 years or older";
    return age;
}

export const validateDescription = (str) => {
    if (!str || typeof str !== "string" || str.trim().length === 0) {
        throw `Invalid string: ${str}`;
    }
    str.trim();
    if(str.length < 15) throw "Description must be more than 15 characters";
    return str;
}

export const validateArray = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
        throw `Invalid array: ${arr}`;
    }
    for (let i = 0; i < arr.length; i++) {
        if(!ObjectId.isValid(arr[i])) throw `Invalid post id in array: ${arr[i]}`;
    }
    return arr;
}

export const validateObject = (obj) => {
    if (!obj || typeof obj !== "object") {
        throw `Invalid object: ${obj}`;
    }
    return obj;
}

export const validateId = (id) => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
        throw `Invalid id: ${id}`;
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) throw `Invalid id: ${id}`;
    return id;
}