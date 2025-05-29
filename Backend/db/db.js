const mongoose = require('mongoose');

function connectDB() {
  return mongoose.connect(process.env.DB_CONNECT, {})
    .then(() => {
      console.log('✅ MongoDB connected');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      throw err; // Rethrow to stop server start on failure
    });
}

module.exports = connectDB;
