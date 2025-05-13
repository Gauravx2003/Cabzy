const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator'); // Import validationResult from express-validator

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req); // Validate the request body
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { origin, destination, vehicleType } = req.body; // Destructure request body

    try {
        const ride = await rideService.createRide({ // Call the createRide function from the ride service
            user: req.user._id,
            origin,
            destination,
            vehicleType,
        });

        res.status(201).json(ride); // Send response with created ride data
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}