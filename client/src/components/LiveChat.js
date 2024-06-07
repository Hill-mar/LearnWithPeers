import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/LiveChat.css';

const socket = io('https://learn-with-peers-backend.vercel.app'); // Adjust the URL if necessary

const LiveChat = ({ attemptId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit('joinRoom', attemptId);

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leaveRoom', attemptId);
            socket.off();
        };
    }, [attemptId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('chatMessage', { attemptId, message });
            setMessage('');
        }
    };

    return (
        <div className="live-chat">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default LiveChat;
