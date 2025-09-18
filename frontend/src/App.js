// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import ProductInput from './components/ProductInput';
import Chatbot from './components/Chatbot';
import ARViewer from './components/ARViewer';
import './App.css';

function App() {
  // State to hold all chat messages
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! Paste a product link to see it in your space.' }
  ]);
  
  // State to hold the data fetched from the backend
  const [productData, setProductData] = useState(null);
  
  // State to control the visibility of the AR viewer
  const [showAR, setShowAR] = useState(false);

  // This function is triggered when the user submits a URL
const handleUrlSubmit = async (url) => {
    // 1. Add user's message to the chat
    setMessages(prev => [...prev, { from: 'user', text: url }]);
    
    // 2. Add a "thinking" message from the bot
    const thinkingMessage = { from: 'bot', text: 'Analyzing the link... Please wait.' };
    setMessages(prev => [...prev, thinkingMessage]);
    
    try {
        // 3. Send the URL to our backend server
        const response = await axios.post('http://localhost:5001/api/process-url', { productUrl: url });
        const data = response.data;
        
        // 4. Update state with the received product data
        setProductData(data);
        
        // 5. Update the chat with analysis and instructions
        setMessages(prev => [
            ...prev.slice(0, -1), // Remove the "thinking" message
            { from: 'bot', text: `Great! I've found the "${data.name}". It's ${data.dimensions.width}cm wide.` },
            { from: 'bot', text: 'I will now generate the AR preview. Make sure your room has good lighting!' },
            { from: 'bot', text: 'Click "Start AR" and point your camera at a flat surface like the floor.' }
        ]);
        
        // 6. Show the AR component
        setShowAR(true);
        
    } catch (error) {
        console.error('Error fetching product data:', error);
        setMessages(prev => [
            ...prev.slice(0, -1),
            { from: 'bot', text: "Sorry, I couldn't fetch details for that link. Please try another." }
        ]);
    }
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>AR Shopping Assistant</h1>
      </header>
      <main className="main-container">
        <div className="chat-container">
          <Chatbot messages={messages} />
          <ProductInput onSubmit={handleUrlSubmit} />
        </div>
        {/* The AR Viewer is only rendered when we have product data and showAR is true */}
        {showAR && productData && <ARViewer modelPath={productData.modelPath} scale={productData.scale} />}
      </main>
    </div>
  );
}
export default App;
