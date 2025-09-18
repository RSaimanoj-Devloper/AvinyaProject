import React, { useState } from 'react';

const ProductInput = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 'auto' }}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste product URL here..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Analyze Product
      </button>
    </form>
  );
};

export default ProductInput;