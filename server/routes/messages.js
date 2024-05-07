import { Router } from 'express';
import { createChat, getChatById, addMessage } from '../data/messages.js';
import { validateUsername } from '../validation/userValidation.js';
import { validId } from '../validation/postValidation.js';

const router = Router();

// TODO need to make sure the chat is owned by the person making the request
router.get('/:id', async (req, res) => {
    try {
        const id = validId(req.params.id);
        const chat = await getChatById(id);
        res.status(200).json(chat);
    }
    catch (e) {
        console.log("error", e);
        res.status(404).json({ message: e });
    }
});

router.post('/addMessage', async (req, res) => {
    try {
        const chatId = validId(req.body.chatId);
        const sender = validateUsername(req.body.sender);
        const message = req.body.message;
        const newChat = await addMessage(chatId, sender, message);
        res.status(200).json({chat: newChat});
    }
    catch (e) {
        res.status(400).json({ message: e });
    }
});

export default router;