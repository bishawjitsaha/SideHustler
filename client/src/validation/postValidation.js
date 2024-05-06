// import { ObjectId } from "mongodb";
// import moment from "moment";

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
    if (!taskTime.dateEnd) throw "Task end date must be provided";

    taskTime.dateStart = taskTime.dateStart.trim();
    taskTime.dateEnd = taskTime.dateEnd.trim();
    taskTime.timeStart = taskTime.timeStart.trim();
    taskTime.timeEnd = taskTime.timeEnd.trim();
    
    if(!moment(taskTime.dateStart, 'MM/DD/YYYY', true).isValid()){
        throw `Invalid Start Date, ${taskTime.dateStart}, must be in MM/DD/YYYY format`;
    }
    if (!moment(taskTime.dateEnd, "MM/DD/YYYY", true).isValid()) {
        throw `Invalid End Date, ${taskTime.dateEnd}, must be in MM/DD/YYYY format`;
    }
    if(!moment(taskTime.timeStart, 'HH:mm', true).isValid()){
        throw `Invalid Start Time, ${taskTime.timeState}, must be in HH:mm format`;
    }
    if (!moment(taskTime.timeEnd, "HH:mm", true).isValid()) {
        throw `Invalid End Time, ${taskTime.timeEnd}, must be in HH:mm format`;
    }

    const startDateTimeString = `${taskTime.dateStart} ${taskTime.timeStart}`;
    const startDateTime = moment(startDateTimeString, "MM/DD/YYYY HH:mm");
    if(startDateTime.isBefore()){
        throw "Start date must be in the future"
    }

    const endDateTimeString = `${taskTime.dateEnd} ${taskTime.timeEnd}`;
    const endDateTime = moment(endDateTimeString, "MM/DD/YYYY HH:mm");
    if(endDateTime.isBefore(startDateTime)){
        throw "End date must be after the start date"
    }
   return { dateStart: startDateTime.toDate(), dateEnd: endDateTime.toDate(), timeStart: taskTime.timeStart, timeEnd: taskTime.timeEnd };
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