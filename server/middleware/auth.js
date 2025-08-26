const { verifyAccessToken, extractTokenFromHeader } = require('../utils/jwt');
const db = require('../config/database');

/**
 * Middleware to authenticate requests using JWT
 * Adds user information to req.user if token is valid
 */
async function authenticateToken(req, res, next) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    // Verify the token
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists and is active
    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'is_active')
      .where({ id: decoded.userId, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update last login timestamp
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date() });

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user information if token is present and valid, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);
    
    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name')
      .where({ id: decoded.userId, is_active: true })
      .first();

    req.user = user ? {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    } : null;

    next();
  } catch (error) {
    // If token is invalid, just set user to null and continue
    req.user = null;
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth
};
