const http = require('http');
const app = require('./app'); // Import the Express app from app.js
const { initializeSocket } = require('./socket'); // Import the initializeSocket function from socket.js
const port = process.env.PORT || 4000; // Set the port to listen on, defaulting to 4000

const server = http.createServer(app); // Create an HTTP server using the Express app

initializeSocket(server); // Initialize the Socket.io server by passing the HTTP server

server.listen(port, () => { // Start the server and listen on the specified port
  console.log(`Server is running on port ${port}`); // Log a message when the server starts
});