const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('JWT secrets are not configured. Please set JWT_SECRET and JWT_REFRESH_SECRET in your environment variables.');
  process.exit(1);
}

/**
 * Generate access token
 * @param {Object} payload - User data to include in token
 * @returns {String} - JWT access token
 */
function generateAccessToken(payload) {
  return jwt.sign(
    { 
      userId: payload.userId, 
      email: payload.email,
      type: 'access'
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate refresh token
 * @param {Object} payload - User data to include in token
 * @returns {String} - JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(
    { 
      userId: payload.userId, 
      email: payload.email,
      type: 'refresh',
      tokenId: crypto.randomUUID()
    }, 
    JWT_REFRESH_SECRET, 
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
}

/**
 * Verify access token
 * @param {String} token - JWT access token
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error(`Invalid access token: ${error.message}`);
  }
}

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
}

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - User data
 * @returns {Object} - Object containing both tokens
 */
function generateTokenPair(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
}

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} - Extracted token or null
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  extractTokenFromHeader
};
