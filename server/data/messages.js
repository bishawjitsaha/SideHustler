import {users, chats } from '../config/mongoCollections.js';
import { validateUsername } from '../validation/userValidation.js'
import { validId } from '../validation/postValidation.js';
import { ObjectId } from 'mongodb';

export async function createChat(user1, user2) {
    user1 = validateUsername(user1);
    user2 = validateUsername(user2);

    const userCollection = await users();
    const user_one = await userCollection.findOne({ userName: user1 });
    if (!user_one) throw 'User1 not found';
    for (let i = 0; i < user_one.chatLog.length; i++) {
        if (user_one.chatLog[i].to === user2) throw 'Chat already exists';
    }

    const user_two = await userCollection.findOne({ userName: user2 });
    if (!user_two) throw 'User2 not found';
    for (let i = 0; i < user_one.chatLog.length; i++) {
        if (user_two.chatLog[i].to === user1) throw 'Chat already exists';
    }

    
    const chat = {
        user1: user1,
        user2: user2,
        messages: []
    };
    
    const chatCollection = await chats();
    const insertInfo = await chatCollection.insertOne(chat);
    if (insertInfo.insertedCount === 0) throw 'Could not add chat';
    
    const updateUser1 = await userCollection.updateOne(
        { userName: user1 }, 
        { $set: { chatLog: [{"to": user2, "chatID": chat._id }, ...user_one.chatLog ] } }
    );
    if (updateUser1.modifiedCount === 0) throw 'Could not add chat';

    const updateUser2 = await userCollection.updateOne(
        { userName: user2 }, 
        { $set: { chatLog: [{"to": user1, "chatID": chat._id }, ...user_two.chatLog] } }
    );
    if (updateUser2.modifiedCount === 0) throw 'Could not add chat';

    chat._id = insertInfo.insertedId.toString();
    return chat;
}

export async function getChatById(id) {
    id = validId(id);
    const chatCollection = await chats();
    const chat = await chatCollection.findOne({ _id: new ObjectId(id) });
    if (!chat) throw 'Chat not found';

    chat._id = chat._id.toString();
    return chat;
}

export async function addMessage(chatId, sender, message) {
    chatId = validId(chatId);
    sender = validateUsername(sender);

    message = message.trim();
    if (!message || typeof message !== 'string' || message === "") throw 'Invalid message';

    if (message.length > 500) throw 'Message is too long';

    const messageObj = {
        sender: sender,
        message: message,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    };

    const chatCollection = await chats();
    const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
    if (!chat) throw 'Chat not found';

    if (chat.user1 !== sender && chat.user2 !== sender) throw 'User not in chat';

    const updateInfo = await chatCollection.updateOne(
        { _id: new ObjectId(chatId) },
        { $push: { messages: messageObj } }
    );

    if (updateInfo.modifiedCount === 0) throw 'Could not add message';
    // return the new chat
    return await getChatById(chatId);
}