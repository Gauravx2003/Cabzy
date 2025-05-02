const userModel = require('../db/models/user.model'); // Import the user model
const userService = require('../services/user.service'); // Import the user service
const { validationResult } = require('express-validator'); // Import validationResult from express-validator

module.exports.register = async (req, res, next) => { // Define the register function
    
    const erroes = validationResult(req); // Validate the request body
    if (!erroes.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: erroes.array() }); // Return validation errors with status 422
    }
    
    const { fullname,  email, password } = req.body; // Destructure request body

    const hashedPassword = await userModel.hashPassword(password); // Hash the password using the user model's method

    try {
        const user = await userService.createUser({ // Call the createUser function from the user service
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword, // Use the hashed password
        });

        const token = await user.generateAuthToken(); // Generate an authentication token for the user

        res.status(201).json({ user, token }); // Send response with user data and token
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }   
}

module.exports.login = async (req, res, next) => { // Define the login function

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { email, password } = req.body; // Destructure request body

    try {
       const user = await userModel.findOne({email}).select('+password');
       if(!user){
        return res.status(401).json({error: "Invalid email or password"}); // Handle invalid email or password
       }

       const isMatch = await user.comparePassword(password); // Compare provided password with stored password
       if(!isMatch){
        return res.status(401).json({error: "Invalid email or password"});
       }

       const token = await user.generateAuthToken(); // Generate an authentication token for the user
       res.status(200).json({ user, token }); // Send response with user data and token
    }catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }

}