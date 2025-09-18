// backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/process-url', async (req, res) => {
  try {
    const { productUrl } = req.body;
    console.log('Received URL:', productUrl);

    // --- MOCK LOGIC ---
    // In a real application, you would call a Python scraping service here.
    // For this prototype, we'll return a hardcoded response based on the URL.
    
    let mockData;

    // Simulate different products based on the link
    if (productUrl.includes('sofa')) {
      mockData = {
        name: 'Modern Gray Sofa',
        dimensions: { width: 200, height: 80, depth: 90 }, // in cm
        modelPath: '/models/sofa.glb', // Path to the 3D model
        scale: [0.01, 0.01, 0.01], // Scale factor to convert cm to meters for the 3D scene
        recommendations: [
          { name: 'Leather Couch', price: '$1200', link: '#' },
          { name: 'Velvet Loveseat', price: '$850', link: '#' }
        ]
      };
    } else {
      mockData = {
        name: 'Wooden Coffee Table',
        dimensions: { width: 120, height: 45, depth: 60 },
        modelPath: '/models/table.glb',
        scale: [0.015, 0.015, 0.015],
        recommendations: [
          { name: 'Glass Top Table', price: '$300', link: '#' },
          { name: 'Round Oak Table', price: '$450', link: '#' }
        ]
      };
    }

    // Simulate a network delay to make it feel real
    setTimeout(() => {
      console.log('Sending mock data:', mockData);
      res.json(mockData);
    }, 2000); // 2-second delay
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});