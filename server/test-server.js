const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('Starting minimal test server...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Simple health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server working!', 
    port: PORT,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Minimal health check working!',
    port: PORT 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
