const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const connectDB = require('./db/db'); // Import DB connection
const port = process.env.PORT || 4000;

const server = http.createServer(app);

connectDB().then(() => {
  initializeSocket(server); // Socket runs AFTER DB is ready
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}).catch((err) => {
  console.error('💥 Server startup aborted due to DB error');
});
