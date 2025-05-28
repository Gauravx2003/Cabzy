const express = require('express'); // Import express framework
const router = express.Router(); // Create a new router instance  
const authMiddleware = require('../middlewares/auth.middleware'); // Import authentication middleware
const mapsController = require('../controllers/maps.controller'); // Import maps controller
const { query,body } = require('express-validator'); // Import query validator from express-validator    

router.get('/get-coordinates', query('address').notEmpty().withMessage('Address is required'), // Validate address query parameter,
           authMiddleware.userAuth, // Apply user authentication middleware,
           mapsController.getCoordinate // Call the controller method to get coordinates
); // Define the route for getting coordinates

router.get('/get-coordinates-cap', query('address').notEmpty().withMessage('Address is required'), // Validate address query parameter,
           authMiddleware.captainAuth, // Apply user authentication middleware,
           mapsController.getCoordinate // Call the controller method to get coordinates
); // Define the route for getting coordinates

router.get('/get-distance-time-cap', 
            query('origin').notEmpty().withMessage('Origin is required'), // Validate origin query parameter,
            query('destination').notEmpty().withMessage('Destination is required'), // Validate destination query parameter,
            authMiddleware.captainAuth, // Apply captain authentication middleware,
            mapsController.getDistanceAndTime // Call the controller method to get distance and time
); // Define the route for getting distance and time for captain

router.get('/get-distance-time', query('origin').notEmpty().withMessage('Origin is required'), // Validate origin query parameter, 
            query('origin').notEmpty().withMessage('Origin is required'), // Validate origin query parameter,
            query('destination').notEmpty().withMessage('Destination is required'), // Validate destination query parameter,
            authMiddleware.userAuth, // Apply user authentication middleware,
            mapsController.getDistanceAndTime // Call the controller method to get distance and time
); // Define the route for getting distance and time

router.post('/live-location',[
            body('origin').notEmpty().withMessage('Origin is required'), // Validate origin query parameter,
            body('destination').notEmpty().withMessage('Destination is required'), // Validate destination query parameter,
            authMiddleware.captainAuth, // Apply captain authentication middleware,
],
            mapsController.liveLocation // Call the controller method to get distance and time
)

router.post('/live-location-user',[
            body('origin').notEmpty().withMessage('Origin is required'), // Validate origin query parameter,
            body('destination').notEmpty().withMessage('Destination is required'), // Validate destination query parameter,
            authMiddleware.userAuth, // Apply captain authentication middleware,
],
            mapsController.liveLocation // Call the controller method to get distance and time
)

router.get('/get-suggestion', query('address').notEmpty().withMessage('Address is required'), // Validate address query parameter,
           authMiddleware.userAuth, // Apply user authentication middleware,
           mapsController.getSuggestion // Call the controller method to get suggestions
); // Define the route for getting suggestions  

module.exports = router; // Export the router for use in other files