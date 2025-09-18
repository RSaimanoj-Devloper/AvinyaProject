import React, { useEffect, useRef } from 'react';

const Chatbot = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      marginBottom: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    }}>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            textAlign: message.from === 'user' ? 'right' : 'left',
            marginBottom: '0.5rem'
          }}
        >
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            maxWidth: '80%',
            backgroundColor: message.from === 'user' ? '#007bff' : '#e9ecef',
            color: message.from === 'user' ? 'white' : 'black'
          }}>
            {message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatbot;