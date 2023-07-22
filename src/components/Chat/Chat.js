import React, { useEffect, useState, useRef } from 'react';

import './Chat.css';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const messagesContainerRef = useRef(null);

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, newMessage.trim()]);
            setNewMessage('');
        }
    };
      
    const handleInputKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleSendMessage();
        }
    };
    
    useEffect(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-room-component">
            <div ref={messagesContainerRef} className="messages">
            {messages.map((message, index) => (
                <div key={index} className="message">
                {message}
                </div>
            ))}
            </div>
            <div className="input-container">
                <input 
                    className="input"
                    onChange={handleInputChange} 
                    value={newMessage} 
                    onKeyDown={handleInputKeyDown}
                    placeholder="Send a message...">
                </input>
            </div>
        </div>
    );
}