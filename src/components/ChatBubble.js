import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message }) => {
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`chat-bubble ${message.sender === 'user' ? 'user' : 'ai'}`}>
      <div className="message-content">
        <div className="message-text">{message.text}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
      {message.sender === 'ai' && (
        <div className="avatar">
          <span>AI</span>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
