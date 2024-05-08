import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';

export const ChatLog = () => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [chatLog, setChatLog] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser) return;

            try {
                const res = await axios.get(`https://localhost:3000/user/${currentUser.displayName}`, {
                    headers: {
                      Authorization: `Bearer ${currentUser.accessToken}`
                    }
                  });


                setChatLog(res.data.chatLog);
                setLoading(false);
            }
            catch (e) {
                console.error(e);
                navigate('/not-found');
            }
        };

        fetchUser();
    }, [currentUser, navigate]);

    return (
        <div>
            <h2>Chat Log</h2>
            {loading && <p>Loading...</p>}
            {chatLog.length > 0 ? (
                chatLog.map((chatLog, index) => {
                    return (
                        <div key={index}>
                            <Link to={`/chat/${chatLog.chatID}`}>
                                {chatLog.to}
                            </Link>
                        </div>
                    );
                })
            ) : (
                <p>No chats found</p>
            )}
        </div>
    )
}

export default ChatLog