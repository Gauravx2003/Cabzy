const captainModel = require('../db/models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator'); // Import validationResult from express-validator
const blacklistTokenModel = require('../db/models/blacklistToken.model'); // Import the blacklist token model

module.exports.registerCaptain = async (req, res, next) => { // Define the register function

    const errors = validationResult(req); //Validate the request body
    if(!errors.isEmpty()){ // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422

    }

    const { fullname, email, password, vehicle, location } = req.body; // Destructure request body

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
        location,
    });

    const token = await captain.generateAuthToken(); // Generate an authentication token for the captain
    res.status(201).json({ captain, token }); // Send response with captain data and token
}

module.exports.login = async (req, res, next) => { // Define the login function

    const errors = validationResult(req); // validate the request body
    if(!errors.isEmpty()){ // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { email, password } = req.body; // Destructure request body
    try{
        const captain = await captainModel.findOne({email}).select('+password'); // Find the captain by email and select the password field
        if(!captain){ // If captain is not found
            return res.status(401).json({error: "Invalid email or password"}); // Handle invalid email or password
        }

        const isMatch = await captain.comparePassword(password); // Compare provided password with stored password
        if(!isMatch){ // If password does not match
            return res.status(401).json({error: "Invalid email or password"}); // Handle invalid email or password
        }

        const token = await captain.generateAuthToken(); // Generate an authentication token for the captain
        res.cookie('token', token); // Set the token in a cookie
        res.status(200).json({ captain, token }); // Send response with captain data and token
    } catch(error){ // Catch any errors during login   
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
    
}

module.exports.getCaptainProfile = async (req, res, next) => { // Define the getCaptainProfile function
    
    res.status(200).json({ captain: req.captain }); // Send response with captain data from request object

}

module.exports.logout = async (req, res, next) => { // Define the logout function
    res.clearCookie('token'); // Clear the token cookie
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]; // Get the token from cookies
    
    await blacklistTokenModel.create({ token }); // Blacklist the token by saving it to the database
    
    res.status(200).json({ message: "Logged out successfully" }); // Send response indicating successful logout
}