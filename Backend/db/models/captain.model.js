const mongoose = require('mongoose'); // Import Mongoose library
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation

const captainSchema = new mongoose.Schema({
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
        lowercase: true,
        match: /.+\@.+\..+/,
     },

     password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
     },

     socketID: {
        type: String,
        default: null,
     },

     status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
     },

     vehicle: {
        color: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"],
        },
        vehicleType: {
            type: String,
            enum: ['car', 'bike', 'auto'],
            required: true,
        },
     },

    location: {
        type: {
               type: String,
               enum: ['Point'],
               required: true,
               default: 'Point'
        },
        coordinates: {
               type: [Number], // [longitude, latitude]
               required: true
      }
  }

    });

    captainSchema.index({ location: "2dsphere" });


    captainSchema.methods.generateAuthToken = async function () {   
        const captain = this; // Reference to the current captain document
        const token = jwt.sign({ _id: captain._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Generate a JWT token with a 24-hour expiration
        return token; // Return the generated token
    }

    captainSchema.methods.comparePassword = async function (password) {
        const captain = this; // Reference to the current captain document
        return await bcrypt.compare(password, captain.password); // Compare the provided password with the hashed password in the database
    }   

    captainSchema.statics.hashPassword = async function (password) {    
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        return await bcrypt.hash(password, salt); // Hash the password with the generated salt      
    }

    const captainModel = mongoose.model('captain', captainSchema); // Create a Mongoose model for the Captain schema

    module.exports = captainModel; // Export the captain model for use in other files
