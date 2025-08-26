const bcrypt = require('bcryptjs');
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required().max(128),
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100)
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { email, password, firstName, lastName } = value;

    // For demo purposes, just return success
    // In production, you'd save to database
    const mockTokens = {
      accessToken: 'demo-access-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now()
    };

    const newUser = {
      id: Date.now(),
      email: email.toLowerCase(),
      firstName: firstName || 'New',
      lastName: lastName || 'User'
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      tokens: mockTokens
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
}
