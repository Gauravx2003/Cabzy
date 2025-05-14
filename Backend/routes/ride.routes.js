const express = require('express');
const router = express.Router(); // Create a new router instance    
const {body, query} = require('express-validator'); // Import body validator from express-validator  
const rideController = require('../controllers/ride.controller'); // Import ride controller   
const authMiddleware = require('../middlewares/auth.middleware'); // Import authentication middleware

router.post('/create-ride', [ // Define validation rules for the create ride route
    authMiddleware.userAuth, // Apply user authentication middleware 
    body('origin').notEmpty().withMessage('Origin is required'), // Validate origin presence
    body('destination').notEmpty().withMessage('Destination is required'), // Validate destination presence
    body('vehicleType').isString().isIn(['car', 'auto', 'bike']).withMessage('Invalid vehicle Type') // Validate vehicle type presence
], 
    rideController.createRide // Create ride route with validation and controller
); // Define the route for creating a ride

router.get('/get-fare', [
    authMiddleware.userAuth, // Apply user authentication middleware
    query('origin').notEmpty().withMessage('Origin is required'), // Validate origin presence
    query('destination').notEmpty().withMessage('Destination is required'), // Validate destination presence
    rideController.getFare // Get fare route with validation and controller
])

module.exports = router; // Export the router for use in other files