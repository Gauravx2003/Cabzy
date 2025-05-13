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
const captainRoutes = require("./routes/captain.routes"); // Import captain routes
const mapsRoutes = require("./routes/maps.routes"); // Import maps routes
const rideRoutes = require("./routes/ride.routes"); // Import ride routes

app.use(cookieParser()); // 🔥 This line enables reading cookies from requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use("/users", userRoutes); // Use user routes for API requests
app.use("/captains", captainRoutes); // Use captain routes for API requests
app.use("/maps", mapsRoutes); // Use maps routes for API requests
app.use("/ride", rideRoutes); // Use ride routes for API requests


module.exports = app;
// This is a simple Express server that responds with "Hello World!" when the root URL is accessed.
