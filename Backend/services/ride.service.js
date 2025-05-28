const { send } = require('process');
const rideModel = require('../db/models/ride.model');
const mapsService = require('./maps.service');
const crypto = require('crypto');
const captainModel = require('../db/models/captain.model'); // Import the captain model

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
        bike: parseFloat((baseFare.bike + parseFloat(distanceAndTime.distance) * ratePerKm.bike).toFixed(2)),
        auto: parseFloat((baseFare.auto + parseFloat(distanceAndTime.distance) * ratePerKm.auto).toFixed(2)),
        car: parseFloat((baseFare.car + parseFloat(distanceAndTime.distance) * ratePerKm.car).toFixed(2))
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
        vehicleType,
    });

    return ride; // Return the created ride 
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if(!rideId) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    await rideModel.findOneAndUpdate({
           _id: rideId },
        {
            status: "accepted", // Update the ride status to accepted
            //otp: otp, // Update the OTP
            captain: captain._id // Assign the captain to the ride
        });
    

    const ride = await rideModel.findOne({_id:rideId}).populate('user').populate('captain').select('+otp'); // Find the ride by ID

    if(!ride) {
        throw new Error("Ride not found"); // Check if the ride exists
    }

    // if(ride.otp !== otp) {
    //     throw new Error("Invalid OTP"); // Check if the OTP is valid
    // }

   

    return ride; // Return the updated ride
} // Define the confirmRide function

module.exports.startRide = async ({
    rideId, otp, captain
}) => {
    if(!rideId || !otp) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        otp: otp,
        //status: "accepted",
        captain: captain._id
    }, {
        status: "ongoing" // Update the ride status to started
    }).populate('user').populate('captain').select('+otp'); // Populate user and captain details

    if(!ride) {
        throw new Error("Ride not found or invalid OTP"); // Check if the ride exists or OTP is valid
    }

    

    return ride; // Return the updated ride
} // Define the startRide function 

module.exports.endRide = async ({   
    rideId, captain, fare, distance
}) => {
    if(!rideId) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    // Update captain stats
    await captainModel.findByIdAndUpdate(
      captain._id,
      {
        $inc: {
          totalRides: 1,
          totalEarnings: fare,
          totalDistance: parseFloat(distance.toFixed(1))
        }
      },
      { new: true }
    );

    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        status: "ongoing",
        captain: captain._id
    }, {
        status: "completed" // Update the ride status to completed
    }).populate('user').populate('captain'); // Populate user and captain details

    

    if(!ride) {
        throw new Error("Ride not found or invalid OTP"); // Check if the ride exists or OTP is valid
    }

    

    return ride; // Return the updated ride
} // Define the endRide function