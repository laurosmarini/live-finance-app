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

// API routes
app.use('/api/auth', require('./routes/auth'));
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

// Start server
app.listen(PORT, () => {
  console.log(`Finance App API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
