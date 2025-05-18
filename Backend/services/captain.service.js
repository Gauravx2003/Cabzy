const captainModel = require('../db/models/captain.model');

const createCaptain = async ({
    firstname,lastname,email,password, color, plate, capacity, vehicleType, location // Destructure the request body to get user details
}) => {
    if(!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    const captain = await captainModel.create({ // Create a new user in the database
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
        },

        location,
    });

    return captain; // Return the created captain
} // Define the createUser function

module.exports = {
    createCaptain,
  };