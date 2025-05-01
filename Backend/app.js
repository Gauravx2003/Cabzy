const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const express = require("express");
const app = express();

const cors = require("cors"); // Import CORS middleware
app.use(cors()); // Use CORS middleware to allow cross-origin requests


app.get("/", (req, res) => {
  console.log("GET / route was hit");
  res.send("Hello World!");
});

module.exports = app;
// This is a simple Express server that responds with "Hello World!" when the root URL is accessed.
