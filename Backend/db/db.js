const mongoose = require('mongoose');


function connectDB() {
  mongoose.connect(process.env.DB_CONNECT, { // Connect to MongoDB using the URI from environment variables
    
  })
  .then(() => {
    console.log('MongoDB connected'); // Log a message when connected successfully
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err); // Log an error if the connection fails
  });
}



module.exports = connectDB; // Export the connectDB function for use in other files
// This code connects to a MongoDB database using Mongoose and logs the connection status.