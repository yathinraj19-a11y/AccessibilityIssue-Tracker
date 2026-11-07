require('dotenv').config();
const app = require('../server/app');
const { connectDB } = require('../server/config/db');

// Cache database connection across serverless function invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.warn('Serverless DB connection warning:', err.message);
    }
  }
  return app(req, res);
};

