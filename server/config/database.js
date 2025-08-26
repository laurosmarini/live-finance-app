const knex = require('knex');
const knexConfig = require('../../db/knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Create knex instance
const db = knex(config);

// Test database connection
async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database connection
testConnection();

module.exports = db;
