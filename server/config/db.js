const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  if (isConnected) {
    return { isConnected: true, mode: 'mongodb' };
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/accessibility_tracker';

  try {
    mongoose.set('strictQuery', false);
    // Connect with a short timeout so that if local MongoDB isn't running, it doesn't hang
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
      socketTimeoutMS: 5000,
    });

    isConnected = true;
    useMemoryStore = false;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return { isConnected: true, mode: 'mongodb' };
  } catch (error) {
    console.warn(`[Database Notice] MongoDB connection failed (${error.message}).`);
    console.info('[Database Mode] Running with resilient in-memory mock MongoDB storage. All CRUD, filtering, import, and verification features are fully active.');
    isConnected = false;
    useMemoryStore = true;
    return { isConnected: false, mode: 'memory' };
  }
};

const getDbStatus = () => ({
  isConnected,
  useMemoryStore,
  database: isConnected ? mongoose.connection.name : 'in-memory-store'
});

module.exports = { connectDB, getDbStatus };

