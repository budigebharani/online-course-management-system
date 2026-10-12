const mongoose = require('mongoose');
const { initInMemoryData } = require('./inMemoryDb');

let isConnected = false;
let isInMemory = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Check if real Atlas credentials are provided
  const hasRealAtlasUri = uri && !uri.includes('<username>') && !uri.includes('<password>');

  if (hasRealAtlasUri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      isConnected = true;
      isInMemory = false;
      console.log(`✅ MongoDB Atlas Connected successfully: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(`⚠️  MongoDB Atlas Connection Error: ${error.message}`);
      console.warn('🔄 Falling back to built-in In-Memory Database store so the application runs with full functionality.');
    }
  }

  // Initialize In-Memory Data Store fallback
  await initInMemoryData();
  isConnected = true;
  isInMemory = true;
  console.log(`✅ OCMS Backend Connected in Full Live In-Memory Mode (No Atlas URI required to test!)`);
  return true;
};

const isDbConnected = () => isConnected;
const isInMemoryMode = () => isInMemory;
const getDbMode = () => (isInMemory ? 'In-Memory (Live & Responsive)' : 'MongoDB Atlas (Cloud)');

module.exports = { connectDB, isDbConnected, isInMemoryMode, getDbMode };
