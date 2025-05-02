const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({    
    fullname: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: { 
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
    },

    socketID: {
        type: String,
        default: null,
    }

})

userSchema.methods.generateAuthToken = async function () {  
    const user = this; // Reference to the current user document
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token with a 1-hour expiration
    return token; // Return the generated token
}   

userSchema.methods.comparePassword = async function (password) {
    const user = this; // Reference to the current user document
    return await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database
}

userSchema.statics.hashPassword = async function (password) {    
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    return await bcrypt.hash(password, salt); // Hash the password with the generated salt      
}

const userModel = mongoose.model('user', userSchema); // Create a Mongoose model for the User schema

module.exports = userModel; // Export the user model for use in other files
// This code defines a Mongoose schema for a user model, including methods for password hashing and token generation.