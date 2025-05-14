const rideModel = require('../db/models/ride.model');
const mapsService = require('./maps.service');
const crypto = require('crypto');

async function getFare(origin, destination) {
    if(!origin || !destination) {
        throw new Error("Origin and destination are required"); // Check if origin and destination are provided
    }   

    const distanceAndTime = await mapsService.getDistanceAndTime(origin, destination); // Call the service to get distance and time

    const baseFare = {
        bike: 20,
        auto: 30,
        car: 50
    };

    const ratePerKm = {
        bike: 12,
        auto: 15,
        car: 20
    };

    const fares = {
        bike: baseFare.bike + (parseFloat(distanceAndTime.distance) * ratePerKm.bike),
        auto: baseFare.auto + (parseFloat(distanceAndTime.distance) * ratePerKm.auto),
        car: baseFare.car + (parseFloat(distanceAndTime.distance) * ratePerKm.car)
    };

    return fares;
} // Define the getFare function

module.exports.getFare = getFare; // Export the getFare function

function getOTP(num){
    if (!num || num <= 0) {
        throw new Error("Number of digits must be greater than 0");
    }

    const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
    return otp;
}

module.exports.createRide = async({
    user, origin, destination, vehicleType
}) => {
    if(!user || !origin || !destination || !vehicleType) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    const fare = await getFare(origin, destination); // Call the getFare function to calculate fare

    const ride = await rideModel.create({ // Create a new ride in the database
        user,
        origin,
        destination,
        otp: getOTP(4), // Generate a 4-digit OTP
        fare: fare[vehicleType],
        //vehicleType,
    });

    return ride; // Return the created ride 
}