const userModel = require('../db/models/user.model'); // Import the user model
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const bcrypt = require('bcrypt'); // Import the bcrypt library
const blacklistTokenModel = require('../db/models/blacklistToken.model'); // Import the blacklist token model

module.exports.userAuth = async (req, res, next)=>{ //Middleware function for user authentication
    const authHeader = req.headers.authorization;
    const token = (req.cookies && req.cookies.token) || (authHeader && authHeader.split(" ")[1]);
    // Check if token is present in cookies or authorization header
    // If token is not present, check if it is in the authorization header and split it to get the token

    if(!token){ // Check if token is not present
        return res.status(401).json({error: "Unauthorized"}); // Return unauthorized error
    }

    const blacklistToken = await blacklistTokenModel.findOne({token}); // Check if the token is blacklisted
    if(blacklistToken){ // If the token is blacklisted
        return res.status(401).json({error: "Unauthorized"}); // Return unauthorized error
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        const user = await userModel.findById(decoded._id); // Find the user by ID from the decoded token
        if(!user){ // Check if user is not found
            return res.status(401).json({error: "Unauthorized"}); // Return unauthorized error
        }
        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware or route handler


    } catch(error){ // Catch any errors during token verification
        return res.status(401).json({error: "Unauthorized"}); // Return unauthorized error
    }

}