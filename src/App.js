import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import { config, validateConfig } from './config';
import openaiService from './services/openaiService';

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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const isValid = validateConfig();
    if (!isValid) {
      setApiError('OpenAI API key not configured. Please add your API key to the environment variables.');
    }
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isTyping) return;

    // Check for API configuration
    if (!config.openai.apiKey) {
      setApiError('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your environment variables.');
      return;
    }

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
      console.log('Sending message to OpenAI...');
      const result = await openaiService.sendMessage(message, threadId);
      
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
          <h2>Compose Early</h2>
          <p>AI Lesson Planning Tool</p>
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
            disabled={isTyping || !!apiError}
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