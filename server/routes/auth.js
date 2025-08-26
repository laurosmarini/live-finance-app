const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const router = express.Router();
const db = require('../config/database');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required().max(128),
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
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

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email: email.toLowerCase() })
      .first();

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [newUser] = await db('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'created_at']);

    // Generate tokens
    const tokens = generateTokenPair({
      userId: newUser.id,
      email: newUser.email
    });

    // Store refresh token
    await db('refresh_tokens').insert({
      token: tokens.refreshToken,
      user_id: newUser.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        createdAt: newUser.created_at
      },
      tokens
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { email, password } = value;

    // Find user
    const user = await db('users')
      .where({ email: email.toLowerCase(), is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email
    });

    // Store refresh token
    await db('refresh_tokens').insert({
      token: tokens.refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date() });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = refreshSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { refreshToken } = value;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database and is not expired
    const tokenRecord = await db('refresh_tokens')
      .where({
        token: refreshToken,
        user_id: decoded.userId,
        is_revoked: false
      })
      .andWhere('expires_at', '>', new Date())
      .first();

    if (!tokenRecord) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Check if user still exists and is active
    const user = await db('users')
      .where({ id: decoded.userId, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new access token
    const newTokens = generateTokenPair({
      userId: user.id,
      email: user.email
    });

    // Revoke old refresh token and store new one
    await db.transaction(async (trx) => {
      await trx('refresh_tokens')
        .where({ id: tokenRecord.id })
        .update({ is_revoked: true });

      await trx('refresh_tokens').insert({
        token: newTokens.refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    });

    res.json({
      message: 'Token refreshed successfully',
      tokens: newTokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      code: 'REFRESH_FAILED'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (revoke refresh token)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke the specific refresh token
      await db('refresh_tokens')
        .where({
          token: refreshToken,
          user_id: req.user.id
        })
        .update({ is_revoked: true });
    } else {
      // Revoke all refresh tokens for user
      await db('refresh_tokens')
        .where({ user_id: req.user.id })
        .update({ is_revoked: true });
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'created_at', 'last_login')
      .where({ id: req.user.id })
      .first();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user information'
    });
  }
});

module.exports = router;
