const express = require('express');
const router = express.Router(); // Create a new router instance
const { body } = require('express-validator'); // Import body validator from express-validator
const userController = require('../controllers/user.controller'); // Import user controller

router.post('/register', [  // Define validation rules for the registration route
    body('fullname.firstname').notEmpty().withMessage('First name is required'), // Validate first name
    body('fullname.lastname').notEmpty().withMessage('Last name is required'), // Validate last name
    body('email').isEmail().withMessage('Invalid email address'), // Validate email format
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long') // Validate password length
], 
    userController.register // Register route with validation and controller

);

router.post('/login', [ // Define validation rules for the login route
    body('email').isEmail().withMessage('Invalid email address'), // Validate email format
    body('password').notEmpty().withMessage('Password is required') // Validate password presence
], 
    userController.login // Login route with validation and controller

)





module.exports = router; // Export the router for use in other files
