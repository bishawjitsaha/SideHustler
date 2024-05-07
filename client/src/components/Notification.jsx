import { useState, useEffect } from "react";

export const Notification = () => {
    const { currentUser } = AuthContext;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/notifications`, { "userid": currentUser.uid });
                // TODO ADD AUTHORIZATION HEADER
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error(error);
            }
        };

        fetchNotifications();
    }, [currentUser]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.map((notification, index) => {
                return (
                    <div key={index}>
                        <p>{notification.content}</p>
                        <p>{notification.type}</p>
                        <link to={notification.link}>View</link>
                        <p>{formatDate(notification.date)}</p>
                    </div>
                )
            })}
        </div>
    )

};

export default Notification;