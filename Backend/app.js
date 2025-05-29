const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
const cors = require("cors");
app.use(cors({
  origin: "https://cabzy-s4qx.vercel.app", // or use an env variable for flexibility
  credentials: true,
}));

const connectDB = require('./db/db');
connectDB();

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const paymentRoutes = require("./routes/payments.routes");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/ride", rideRoutes);
app.use("/payment", paymentRoutes);




module.exports = app;
// This is a simple Express server that responds with "Hello World!" when the root URL is accessed.

