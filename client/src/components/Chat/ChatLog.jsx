import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import { backendUrl } from '../../App';

export const ChatLog = () => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [chatLog, setChatLog] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser) return;

            try {
                const res = await axios.get(`${backendUrl}/user/${currentUser.displayName}`, {
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
            {loading ? <p>Loading...</p> :
                chatLog.length > 0 ? (
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
                    <p>
                        No chats found
                        Apply to posts and get selected to chat with the owner of the post
                        Or create a post and and select an applicant to chat with them
                    </p>
                )}
        </div>
    )
}

export default ChatLog