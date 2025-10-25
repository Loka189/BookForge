const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGOURI;
console.log('🔍 Mongo URI value:', mongoURI ? 'Loaded ✅' : '❌ Undefined');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
