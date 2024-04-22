import { ObjectId } from "mongodb";
import moment from "moment";

export const validateTitle = (title) => {
    if (!title) throw "Title must be provided";
    if (typeof title !== "string") throw "Title must be a string";
    if ((title = title.trim()).length === 0) throw "Title must not be empty";
    if (title.length < 3 || title.length > 50) throw "Title must be 3-50 characters";
    return title;
}

export const validateDescription = (description) => {
    if (!description) throw "Description must be provided";
    if (typeof description !== "string") throw "Description must be a string";
    if ((description = description.trim()).length === 0) throw "Description must not be empty";
    if (description.length < 10 || description.length > 250) throw "Description must be between 10 and 250 characters";
    return description;
}

export const validateTaskTime = (taskTime) => {
    if (!taskTime) throw "Task time must be provided";
    if (typeof taskTime !== "object") throw "Task time must be an object";
    if (!taskTime.dateStart) throw "Task start date must be provided";
    // if (!(taskTime.dateStart instanceof Date))throw "Task start date must be a Date object";
    if (!taskTime.dateEnd) throw "Task end date must be provided";
    // if (!(taskTime.dateEnd instanceof Date)) throw "Task end date must be a Date object";

    console.log("Start: ", taskTime.dateStart, moment(taskTime.dateStart, 'MM/DD/YYYY', true).isValid());
    console.log("Start Time", taskTime.timeStart, moment(taskTime.timeStart, 'HH:mm', true).isValid());
    console.log("End: ", taskTime.dateEnd, moment(taskTime.dateEnd, 'MM/DD/YYYY', true).isValid());
    console.log("End Time", taskTime.timeEnd, '\n');


    let REdate = /(^[0-9]{2}\/[0-9]{2}\/[0-9]{4})/g;
    if (!REdate.test(taskTime.dateStart)) throw "Invalid Start Date, must be in MM/DD/YYYY format";
    let REdate2 = /(^[0-9]{2}\/[0-9]{2}\/[0-9]{4})/g;
    if (!REdate2.test(taskTime.dateEnd)) throw "Invalid End Date, must be in MM/DD/YYYY format";

    let daysPerMonth = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let StYear = parseInt(taskTime.dateStart.split("/")[2]);
    let StMonth = parseInt(taskTime.dateStart.split("/")[0]);
    let StDay = parseInt(taskTime.dateStart.split("/")[1]);

    let EnYear = parseInt(taskTime.dateEnd.split("/")[2]);
    let EnMonth = parseInt(taskTime.dateEnd.split("/")[0]);
    let EnDay = parseInt(taskTime.dateEnd.split("/")[1]);

    if (!StMonth ||!StYear || !StDay ||  StMonth < 1 || StMonth > 12 || StDay < 1 ||StDay > daysPerMonth[StMonth]) throw "Invalid Start Date";
    if (!EnMonth ||!EnYear || !EnDay ||  EnMonth < 1 || EnMonth > 12 || EnDay < 1 ||EnDay > daysPerMonth[EnMonth]) throw "Invalid End Date";

    // The eventDate must be greater than the current date (so only future events can be created).
    let currDate = new Date();
    currDate.setUTCHours(currDate.getUTCHours()-4); //Current time EST


    // The startTime must be a valid time in 12-hour AM/PM format "11:30 PM":  If it's not in the expected format or not a valid time, the method should throw.
    // The endTime must be a valid time in 12-hour AM/PM format "11:30 PM":  If it's not in the expected format or not a valid time, the method should throw.
    let checkTime = (timex) => {
        let REtime = /^([1-9]|1[0-9])\:[0-9]{2}\s(AM|PM)$/g;
        if (!REtime.test(timex)) throw `Invalid time format ${timex}`;
        let hrs = parseInt(timex.split(":")[0]);
        let mins = parseInt(timex.split(":")[1].slice(0, 2));
        let am = timex.split(":")[1].slice(3, 5) === "AM" ? true : false;

        if (hrs > 12 || hrs < 1 || mins > 59 || mins < 0)
            throw `Invalid time ${timex}`;
        return [hrs, mins, am];
    };
    // The startTime cannot be later than the endTime, if it is, the method should throw.
    // The endTime cannot be earlier than the startTime, if it is, the method should throw.
    let [shrs, smins, sam] = checkTime(taskTime.timeStart);
    let [ehrs, emins, eam] = checkTime(taskTime.timeEnd);
    if (shrs === 12) {
        if (sam === true) {
            shrs = 0;
        }
    } else if (sam === false) {
        shrs += 12;
    }
    if (ehrs === 12) {
        if (eam === true) {
            ehrs = 0;
        }
    } else if (eam === false) {
        ehrs += 12;
    }

    let startDate = new Date(StYear, StMonth - 1, StDay);
    startDate.setUTCHours(shrs, smins);
    let endDate = new Date(EnYear, EnMonth - 1, EnDay);
    endDate.setUTCHours(ehrs, emins);

    // The endTime should be at least 30 minutes later than the startTime, if it's not, the method should throw.
    if (!(startDate > currDate)) throw "Start date must be in the future";
    if(endDate - startDate < 1800000) throw `End time: ${endDate} must be at least 30 mins after the start time: ${startDate}`
    return { dateStart: startDate, dateEnd: endDate, timeStart: taskTime.timeStart, timeEnd: taskTime.timeEnd };
}

export const validateTaskPayment = (taskPayment) => {
    if (!taskPayment) throw "Task payment must be provided";
    if (!(typeof taskPayment === "number") || isNaN(taskPayment)) throw "Task payment must be a number";
    if (taskPayment < 0) throw "Task payment must be greater than or equal to 0";
    if (taskPayment > 10000) throw "Task payment must be less than or equal to $10,000";
    return taskPayment;
}

export const validateWorkType = (workType) => {
    if (!workType) throw "Work type must be provided";
    if (typeof workType !== "string") throw "Work type must be a string";
    if ((workType = workType.trim()).length === 0) throw "Work type must not be empty";
    workType = workType.toLowerCase();
    if (workType !== "remote" && workType !== "in-person") throw "Work type must be either 'remote' or 'in-person'";
    return workType;
}

export const validateStatus = (status) => {
    if(!status) throw "Status must be provided";
    if (typeof status !== "string") throw "Status must be a string";
    if ((status = status.trim()).length === 0) throw "Status must not be empty";
    status = status.toLowerCase();
    if (status !== "open" && status !== "closed" && status !== "in progress" && status !== "completed") throw "Status must be either 'open', 'closed', 'in progress', or 'completed'";
    return status;
}

export const validatePost = (title, description, taskTime, taskPayment, workType) => {
    title = validateTitle(title);
    description = validateDescription(description);
    taskTime = validateTaskTime(taskTime);
    taskPayment = validateTaskPayment(taskPayment);
    workType = validateWorkType(workType);

    return { title:title, description: description, taskTime: taskTime, taskPayment:taskPayment, workType: workType };
}

export const validId = (id) => {
    //Validates id strings
    if (!id) throw "Error: You must provide an id to search for";
    if (typeof id !== "string") throw "Error: id must be a string";
    id = id.trim();
    if (id.length === 0) throw "Error: id cannot be an empty string or just spaces";
    if (!ObjectId.isValid(id)) throw "Error: invalid object ID";

    return id;
};