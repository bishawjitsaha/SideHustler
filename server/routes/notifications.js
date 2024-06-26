import { Router } from "express";
import { getNotifications } from "../data/notifications.js";
import verifyToken from "../middleware.js";

const router = Router();

router.get("/:id", verifyToken, async (req, res) => {
    try {
        // idk if this is the correct way to do this?
        // what if someone else just passed in a notification id?
        const userid = req.params.id;
        let notifications = await getNotifications(userid);
        if (notifications) {
        return res.status(200).json({ notifications: notifications });
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
    }
});

export default router;