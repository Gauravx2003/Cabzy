const rideService = require('../services/ride.service');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator'); // Import validationResult from express-validator
const {sendMessageToSocketId} = require('../socket');
const captainModel = require('../db/models/captain.model'); // Import the captain model
const rideModel = require('../db/models/ride.model'); // Import the ride model

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

        
        const pickupCoordinates = await mapService.getAddressCoordinate(origin); // Get pickup coordinates using the map service
        console.log(pickupCoordinates); // Log the pickup coordinates
        const captainInRadius = await mapService.getCaptainInRadius(pickupCoordinates.latitude, pickupCoordinates.longitude, 500); // Get nearby captains in the specified radius
        
        ride.otp="";

        const rideUser = await rideModel.findOne({_id:ride._id}).populate('user').populate('captain'); // Find the ride user by ID and populate the user field
        
        //console.log(captainInRadius.length); // Log the number of captains in radius
        setTimeout( () => {
        captainInRadius.map(async (captain) => {
            const freshCaptain = await captainModel.findById(captain._id);
            const captainSocketId = freshCaptain?.socketID;
            const rideId = ride._id; // Get the ride ID
            const message = {
                type: "rideRequest",
                data: rideUser,
            };

            console.log("captainInRadius Called"); // Log the captain's socket ID
            sendMessageToSocketId(captain._id.toString(), "rideRequest", message); // Send a message to the captain's socket ID
        });
    },1000);

        res.status(201).json(ride); // Send response with created ride data

    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}

module.exports.rideFound = async (req, res)=>{
    const errors = validationResult(req); // Validate the request body
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { origin, destination } = req.body; // Destructure request body
    
    try{
    const pickupCoordinates = await mapService.getAddressCoordinate(origin); // Get pickup coordinates using the map service
    console.log(pickupCoordinates); // Log the pickup coordinates
    const captainInRadius = await mapService.getCaptainInRadius(pickupCoordinates.latitude, pickupCoordinates.longitude, 500);

     //console.log(captainInRadius.length); // Log the number of captains in radius
    setTimeout( () => {
    captainInRadius.map(async (captain) => {
            const freshCaptain = await captainModel.findById(captain._id);
            const captainSocketId = freshCaptain?.socketID;
            //const rideId = ride._id; // Get the ride ID
            const message = {
                type: "rideFound",
                //data: rideUser,
            };

            console.log("captainInRadius Called"); // Log the captain's socket ID
            sendMessageToSocketId(captain._id.toString(), "rideFound", message); // Send a message to the captain's socket ID
        });
    },1000);
    res.status(201).json("Captain Found");
}catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }

}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req); // Validate the request query parameters
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { origin, destination } = req.query; // Destructure request query parameters

    try {
        const fare = await rideService.getFare(origin, destination); // Call the getFare function from the ride service
        res.status(200).json(fare); // Send response with fare data
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}

module.exports.acceptRide = async (req, res) => {
    const errors = validationResult(req); // Validate the request body
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { rideId } = req.body; // Destructure request body

    try {
        console.log(req.body);
        const ride = await rideService.confirmRide({rideId, captain: req.captain}); // Call the confirmRide function from the ride service

        const message = {
            type: "rideAccepted",
            data: ride,
        };

        sendMessageToSocketId(ride.user._id.toString(), "rideAccepted", message); // Send a message to the user's socket ID
        res.status(200).json(ride); // Send response with confirmed ride data
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req); // Validate the request query parameters
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { rideId, otp } = req.body; // Destructure request query parameters

    try {
        console.log(req.captain);
        const ride = await rideService.startRide({rideId, otp, captain: req.captain}); // Call the startRide function from the ride service

        sendMessageToSocketId(ride.user._id.toString(), "rideStarted", {
            type: "rideStarted",
            data: ride,
        }); // Send a message to the user's socket ID

        res.status(200).json(ride); // Send response with started ride data
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req); // Validate the request body
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({ errors: errors.array() }); // Return validation errors with status 422
    }

    const { rideId, fare, distance } = req.body; // Destructure request body

    try {
        const ride = await rideService.endRide({rideId, fare, distance, captain: req.captain}); // Call the endRide function from the ride service

        sendMessageToSocketId(ride.user._id.toString(), "rideEnded", {
            type: "rideEnded",
            data: ride,
        }); // Send a message to the user's socket ID

        res.status(200).json(ride); // Send response with ended ride data
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors and send response
    }
}   