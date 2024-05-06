import { notifications} from "../config/mongoCollections.js";

export async function createNotification(userID, type, content, link) {
    const notificationCollection = await notifications();
    const newNotification = {
        userID: userID,
        type: type,
        content: content,
        link: link,
        date: new Date()
    };
    const insertInfo = await notificationCollection.insertOne(newNotification);
    if (insertInfo.insertedCount === 0) throw "Could not add notification";
    return newNotification;
}

export async function getNotifications(userID) {
    const notificationCollection = await notifications();
    const notificationList = await notificationCollection.find({ userID: new userID }).toArray().reverse();
    const ret = [];
    for (let i = 0; i < notificationList.length; i++) {
        const notification = notificationList[i];
        notification._id = notification._id.toString();
        ret.push(notification);
    }
    return ret;
}