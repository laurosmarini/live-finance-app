const http = require('http');
const url = require('url');

// Import our serverless functions
const authLogin = require('./api/auth/login.js').default;
const authRegister = require('./api/auth/register.js').default;
const accounts = require('./api/accounts/index.js').default;
const cryptoPrices = require('./api/crypto/prices.js').default;
const stocksPrices = require('./api/stocks/prices.js').default;
const portfolio = require('./api/portfolio/index.js').default;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Parse request body for POST requests
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      handleRequest(req, res, path);
    });
  } else {
    req.query = parsedUrl.query;
    handleRequest(req, res, path);
  }
});

function handleRequest(req, res, path) {
  console.log(`${req.method} ${path}`);
  
  // Route requests to appropriate handlers
  if (path === '/api/auth/login') {
    authLogin(req, res);
  } else if (path === '/api/auth/register') {
    authRegister(req, res);
  } else if (path === '/api/accounts') {
    accounts(req, res);
  } else if (path === '/api/crypto/prices') {
    cryptoPrices(req, res);
  } else if (path === '/api/stocks/prices') {
    stocksPrices(req, res);
  } else if (path === '/api/portfolio') {
    portfolio(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
}

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/register');
  console.log('- GET /api/accounts');
  console.log('- GET /api/crypto/prices');
  console.log('- GET /api/stocks/prices');
  console.log('- GET /api/portfolio');
});
