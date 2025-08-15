import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message }) => {
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to parse inline markdown within a line
  const parseInlineMarkdown = (text) => {
    if (!text) return text;
    
    // Replace **text** with <strong>text</strong>
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *text* with <em>text</em> (italic)
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return parsed;
  };

  // Function to format message text with proper markdown parsing
  const formatMessageText = (text) => {
    if (!text) return '';
    
    console.log('Raw text:', text); // Debug log
    
    // Split by double line breaks to preserve paragraph structure
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((paragraph, index) => {
      // Handle bullet points and numbered lists
      if (paragraph.trim().match(/^[\d\-*•]+\.?\s/)) {
        const items = paragraph.split(/\n/);
        return (
          <div key={index} className="message-paragraph">
            {items.map((item, itemIndex) => {
              const cleanItem = item.trim().replace(/^[\d\-*•]+\.?\s/, '');
              const parsedItem = parseInlineMarkdown(cleanItem);
              return (
                <div key={itemIndex} className="list-item">
                  <span dangerouslySetInnerHTML={{ __html: parsedItem }} />
                </div>
              );
            })}
          </div>
        );
      }
      
      // Handle regular paragraphs with line breaks
      const lines = paragraph.split(/\n/);
      return (
        <div key={index} className="message-paragraph">
          {lines.map((line, lineIndex) => {
            let cleanLine = line.trim();
            
            console.log('Processing line:', cleanLine); // Debug log
            
            // Handle different markdown elements
            if (cleanLine.startsWith('### ')) {
              cleanLine = cleanLine.replace('### ', '');
              return (
                <h3 key={lineIndex} className="message-heading h3">
                  {cleanLine}
                </h3>
              );
            }
            
            if (cleanLine.startsWith('## ')) {
              cleanLine = cleanLine.replace('## ', '');
              return (
                <h2 key={lineIndex} className="message-heading h2">
                  {cleanLine}
                </h2>
              );
            }
            
            if (cleanLine.startsWith('# ')) {
              cleanLine = cleanLine.replace('# ', '');
              return (
                <h1 key={lineIndex} className="message-heading h1">
                  {cleanLine}
                </h1>
              );
            }
            
            if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
              const cleanItem = cleanLine.replace(/^[-*]\s/, '');
              const parsedItem = parseInlineMarkdown(cleanItem);
              return (
                <div key={lineIndex} className="list-item">
                  <span dangerouslySetInnerHTML={{ __html: parsedItem }} />
                </div>
              );
            }
            
            // Regular text line - parse inline markdown
            const parsedLine = parseInlineMarkdown(cleanLine);
            return (
              <div key={lineIndex} className="message-line">
                <span dangerouslySetInnerHTML={{ __html: parsedLine }} />
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`chat-bubble ${message.sender === 'user' ? 'user' : 'ai'}`}>
      {message.sender === 'ai' && (
        <div className="avatar">
          <span>CE</span>
        </div>
      )}
      <div className="message-content">
        <div className="message-text">
          {formatMessageText(message.text)}
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
