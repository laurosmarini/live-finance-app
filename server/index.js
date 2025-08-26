require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || 'https://live-finance-app.vercel.app',
        /https:\/\/.*\.vercel\.app$/,
        /https:\/\/.*\.railway\.app$/
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Finance App API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const users = [
    { id: 1, email: 'demo@finance-app.com', password: 'password123', firstName: 'Demo', lastName: 'User' },
    { id: 2, email: 'john@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' }
  ];
  
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
  }
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    tokens: { accessToken: 'demo-access-token-' + Date.now() + '-' + user.id, refreshToken: 'demo-refresh-token-' + Date.now() + '-' + user.id }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const newUser = { id: Date.now(), email: email.toLowerCase(), firstName: firstName || 'New', lastName: lastName || 'User' };
  const tokens = { accessToken: 'demo-access-token-' + Date.now() + '-' + newUser.id, refreshToken: 'demo-refresh-token-' + Date.now() + '-' + newUser.id };
  
  res.status(201).json({ message: 'User registered successfully', user: newUser, tokens });
});

// Financial endpoints
app.get('/api/accounts', (req, res) => {
  const accounts = [
    { id: 1, name: 'Main Checking', type: 'checking', balance: 5420.50, institution: 'Chase Bank' },
    { id: 2, name: 'Savings Account', type: 'savings', balance: 12750.25, institution: 'Wells Fargo' },
    { id: 3, name: 'Investment Portfolio', type: 'investment', balance: 28940.80, institution: 'Fidelity' },
    { id: 4, name: 'Credit Card', type: 'credit', balance: -1250.00, institution: 'American Express' }
  ];
  const totalBalance = accounts.filter(a => a.type !== 'credit').reduce((s, a) => s + a.balance, 0);
  res.json({ accounts, summary: { totalBalance, netWorth: totalBalance - 1250 } });
});

app.get('/api/transactions', (req, res) => {
  const transactions = [
    { id: 1, description: 'Salary Deposit', amount: 3250.00, category: 'Income', type: 'income', date: new Date(Date.now() - 24*60*60*1000).toISOString() },
    { id: 2, description: 'Grocery Store', amount: -45.50, category: 'Food & Dining', type: 'expense', date: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: 3, description: 'Gas Station', amount: -85.20, category: 'Transportation', type: 'expense', date: new Date(Date.now() - 3*24*60*60*1000).toISOString() }
  ];
  res.json({ transactions, summary: { totalIncome: 3250, totalExpenses: 130.70 } });
});

app.get('/api/crypto', (req, res) => {
  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 43250 + (Math.random() - 0.5) * 2000, change24h: (Math.random() - 0.5) * 10, rank: 1 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2580 + (Math.random() - 0.5) * 200, change24h: (Math.random() - 0.5) * 8, rank: 2 }
  ];
  res.json({ cryptos, lastUpdated: new Date().toISOString() });
});

app.get('/api/stocks', (req, res) => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185 + (Math.random() - 0.5) * 10, change: (Math.random() - 0.5) * 5, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 143 + (Math.random() - 0.5) * 8, change: (Math.random() - 0.5) * 4, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420 + (Math.random() - 0.5) * 15, change: (Math.random() - 0.5) * 6, sector: 'Technology' }
  ];
  const indices = [
    { name: 'S&P 500', symbol: 'SPX', value: 4850 + (Math.random() - 0.5) * 50, change: (Math.random() - 0.5) * 30 },
    { name: 'NASDAQ', symbol: 'IXIC', value: 15420 + (Math.random() - 0.5) * 100, change: (Math.random() - 0.5) * 80 }
  ];
  res.json({ stocks, indices, lastUpdated: new Date().toISOString() });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    user: { firstName: 'Demo', lastName: 'User', email: 'demo@finance-app.com' },
    financialSummary: { totalNetWorth: 45861.55, totalAssets: 47111.55, totalDebts: 1250.00, monthlyIncome: 3250.00, savingsRate: 12.4 },
    recentTransactions: [
      { id: 1, description: 'Salary Deposit', amount: 3250.00, category: 'Income', type: 'income', date: new Date(Date.now() - 24*60*60*1000).toISOString() },
      { id: 2, description: 'Grocery Store', amount: -45.50, category: 'Food & Dining', type: 'expense', date: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
    ],
    portfolio: {
      stocks: { totalValue: 18750.40, dayChange: 245.80, dayChangePercent: 1.33 },
      crypto: { totalValue: 8420.15, dayChange: -125.40, dayChangePercent: -1.47 }
    },
    lastUpdated: new Date().toISOString()
  });
});

// API routes (only load if database is available)
try {
  const db = require('./config/database');
  // app.use('/api/auth', require('./routes/auth')); // Disabled for now
  console.log('✅ Database available but using simple auth for demo');
} catch (error) {
  console.warn('⚠️ Database not available, using simple auth routes:', error.message);
}
// app.use('/api/users', require('./routes/users'));
// app.use('/api/accounts', require('./routes/accounts'));
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/budgets', require('./routes/budgets'));
// app.use('/api/crypto', require('./routes/crypto'));

// Catch all handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = err.message;
    error.status = 400;
  } else if (err.name === 'UnauthorizedError') {
    error.message = 'Unauthorized';
    error.status = 401;
  } else if (err.code === '23505') { // PostgreSQL unique violation
    error.message = 'Resource already exists';
    error.status = 409;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete err.stack;
  } else {
    error.stack = err.stack;
  }

  res.status(error.status).json({ error });
});

// Export app for Vercel serverless
module.exports = app;

// Start server only in non-serverless environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Finance App API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}
