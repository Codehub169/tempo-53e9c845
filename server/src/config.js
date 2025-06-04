const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL || path.join(__dirname, '..', 'data', 'apartments.db'),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:9000',
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads'), // Directory to store uploaded images
  UPLOADS_ROUTE: '/uploads', // Public route for accessing uploads
  API_SECRET_KEY: process.env.API_SECRET_KEY || 'supersecretkey',
};

module.exports = config;
