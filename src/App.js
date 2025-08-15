import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import { config, getApiUrl, validateConfig } from './config';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "How can I help you create structured composing lessons? Can you tell me the grade level for this?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [threadId, setThreadId] = useState(null); // Store OpenAI thread ID
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    validateConfig();
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // API call to your Wix backend - matching the expected format
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,           // Your backend expects 'question'
          conversationHistory: null,   // Your backend expects this
          threadId: threadId          // For conversation continuity
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data); // For debugging
      
      // Typing delay for better UX
      setTimeout(() => {
        let aiResponseText = "I'm here to help with your teaching questions!";
        
        // Handle your Wix backend response format
        if (data.success && data.response) {
          aiResponseText = data.response;
          
          // Store thread ID for conversation continuity
          if (data.threadId) {
            setThreadId(data.threadId);
            console.log('Thread ID stored:', data.threadId);
          }
        } else if (data.error) {
          aiResponseText = `I'm sorry, I encountered an error: ${data.error}`;
        }

        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, config.chat.typingDelay);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // More detailed error handling
      setTimeout(() => {
        let errorMessage = "I'm having trouble connecting right now. Please try again later.";
        
        if (error.message.includes('CORS')) {
          errorMessage = "Connection blocked. Please check CORS settings.";
        } else if (error.message.includes('404')) {
          errorMessage = "Backend endpoint not found. Please check the API URL.";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error occurred. Please try again.";
        }

        const aiMessage = {
          id: Date.now() + 1,
          text: errorMessage,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, config.chat.typingDelay);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Teaching Assistant</h2>
          <p>Ask me anything about teaching!</p>
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
        
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default App;