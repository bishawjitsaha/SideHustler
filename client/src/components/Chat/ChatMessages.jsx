import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext'
import io from 'socket.io-client';
import './chat.css';

export const ChatMessages = () => {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [chatLog, setChatLog] = useState([]);
    const [history, setHistory] = useState([]);
    const [chatPartner, setChatPartner] = useState('');
    const [currMessage, setCurrMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    const fetchMessages = async () => {
        try {
            const response = await axios.get(`https://localhost:3000/messages/${id}`, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });

            setHistory(response.data.messages);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // check if id relates to current user
        const fetchUser = async () => {
            if (!currentUser) return;

            try {
                const res = await axios.get(`https://localhost:3000/user/${currentUser.displayName}`, {
                    headers: {
                      Authorization: `Bearer ${currentUser.accessToken}`
                    }
                  });

                setChatLog(res.data.chatLog);

                let allowed = false;
                for (let i = 0; i < res.data.chatLog.length; i++) {
                    if (res.data.chatLog[i].chatID === id) {
                        allowed = true;
                        setChatPartner(res.data.chatLog[i].to);
                    }
                }

                if (!allowed) { navigate('/chat') }
            }
            catch (e) {
                console.error(e);;
            }
        };

        fetchUser();

        fetchMessages();


    }, [id, currentUser, navigate])

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io('https://sidehustler-backend.onrender.com');
        socketRef.current.on('receive_message', async (data) => {
            if (data !== id) return;
            else {
                console.log('oh brother')
                await fetchMessages();
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, [history, socketRef, id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!currMessage) return;
        const msg = {
            sender: currentUser.displayName,
            chatId: id,
            message: currMessage
        }
        try {
            const response = await axios.post('https://localhost:3000/messages/addMessage', msg, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });

            socketRef.current.emit('send_message', id);
            const temp = {
                sender: currentUser.displayName,
                message: currMessage,
                timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
            }
            setHistory([...history, temp]);
            setCurrMessage('');
        } catch (error) {
            console.error(error);
        }

    }

    // make it auto scroll to bottom
    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [history])

    return (
        <div>
            <h2>Chat Messages with {chatPartner}</h2>
            <div id="chat-container" className="chat-container">
                {history.length > 0 ? history.map((message, index) => {
                    return (
                        <div key={index}>
                            <p>({formatDate(message.timestamp)}) {message.sender}: {message.message}</p>
                        </div>
                    )
                }) :
                    <p>Start Messaging Now !</p>
                }
            </div>
            <div className="input-container">
                <form>
                    <input type="text" value={currMessage} onChange={e => setCurrMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                </form>
            </div>
        </div>
    )

}

export default ChatMessages