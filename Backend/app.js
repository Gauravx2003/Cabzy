const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const app = express();

const cookieParser = require('cookie-parser'); // Import cookie parser middleware


const cors = require("cors"); // Import CORS middleware
app.use(cors()); // Use CORS middleware to allow cross-origin requests

const connectDB = require('./db/db'); // Import the database connection function
connectDB(); // Connect to the database

const userRoutes = require("./routes/user.routes"); // Import user routes



app.get("/", (req, res) => {
  console.log("GET / route was hit");
  res.send("Hello World!");
});

app.use(cookieParser()); // 🔥 This line enables reading cookies from requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use("/users", userRoutes); // Use user routes for API requests


module.exports = app;
// This is a simple Express server that responds with "Hello World!" when the root URL is accessed.
