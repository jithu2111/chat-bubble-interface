import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import { config, validateConfig } from './config';
import wixProxyService from './services/wixProxyService';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.chat.welcomeMessage,
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize configuration for Wix backend
  useEffect(() => {
    setIsConfigured(true);
    setApiError(null);
  }, []);

  useEffect(() => {
    // Only validate if we have a configuration
    if (isConfigured) {
      const isValid = validateConfig();
      if (!isValid) {
        setApiError('OpenAI configuration not received from parent. Please check your Wix setup.');
      }
    } else {
      setApiError('Waiting for configuration from Wix...');
    }
  }, [isConfigured]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isTyping) return;



    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setApiError(null);

    try {
      console.log('Sending message to Wix backend...');
      const result = await wixProxyService.sendMessage(message, threadId);
      
      // Typing delay for better UX
      setTimeout(() => {
        if (result.success) {
          const aiMessage = {
            id: Date.now() + 1,
            text: result.response,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Store thread ID for conversation continuity
          if (result.threadId) {
            setThreadId(result.threadId);
            console.log('Thread ID stored:', result.threadId);
          }
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            text: `I'm sorry, I encountered an error: ${result.error}`,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        setIsTyping(false);
      }, config.chat.typingDelay);

    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm having trouble connecting right now. Please try again later.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, config.chat.typingDelay);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: config.chat.welcomeMessage,
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
    setThreadId(null);
    setApiError(null);
    console.log('Chat cleared, new conversation started');
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Teaching Assistant</h2>
          <p>Ask me anything about teaching!</p>
          {apiError && (
            <div className="api-error">
              ⚠️ {apiError}
            </div>
          )}
        </div>
        
        <div className="messages-container">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-footer">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            disabled={isTyping || !!apiError || !isConfigured}
          />
          <button 
            onClick={clearChat}
            className="clear-button"
            disabled={isTyping}
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;