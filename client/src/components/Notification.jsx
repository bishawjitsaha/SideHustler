import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const Notification = () => {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/notifications/${currentUser.uid}`, {
                    headers: {
                      Authorization: `Bearer ${currentUser.accessToken}`
                    }
                  });
                
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
                        <Link to={notification.link}>View</Link>
                        <p>{formatDate(notification.date)}</p>
                    </div>
                )
            })}
        </div>
    )

};

export default Notification;
