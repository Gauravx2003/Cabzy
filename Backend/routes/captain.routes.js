const express = require('express');
const router = express.Router(); // Create a new router instance
const { body } = require('express-validator'); // Import body validator from express-validator
const captainController = require('../controllers/captain.controller'); // Import captain controller

router.post('/register', [  // Define validation rules for the registration route
    body('fullname.firstname').notEmpty().withMessage('First name is required'), // Validate first name
    body('fullname.lastname').notEmpty().withMessage('Last name is required'), // Validate last name
    body('email').isEmail().withMessage('Invalid email address'), // Validate email format
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Validate password length
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'), // Validate vehicle color
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'), // Validate vehicle plate
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'), // Validate vehicle capacity
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'), // Validate vehicle type against allowed values

], 
    captainController.registerCaptain // Register route with validation and controller

);


module.exports = router; // Export the router for use in other files