const captainModel = require('../db/models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator'); // Import validationResult from express-validator

module.exports.registerCaptain = async (req, res, next) => { // Define the register function

    const errors = validationResult(req); //Validate the request body
    if(!errors.isEmpty()){ // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422

    }

    const { fullname, email, password, vehicle } = req.body; // Destructure request body

    const isCaptainExists = await captainModel.findOne({ email }); // Check if a captain with the provided email already exists
    if (isCaptainExists) { // If a captain with the provided email already exists
        return res.status(409).json({ error: "Captain already exists" }); // Return conflict error
    }

    const hashedPassword = await captainModel.hashPassword(password); // Hash the password using the captain model's method

    const captain = await captainService.createCaptain({ // Call the createCaptain function from the captain service
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword, // Use the hashed password
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    });

    const token = await captain.generateAuthToken(); // Generate an authentication token for the captain
    res.status(201).json({ captain, token }); // Send response with captain data and token
}
