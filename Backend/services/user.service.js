const userModel = require('../db/models/user.model'); // Import the user model

const createUser = async ({
    firstname,lastname,email,password, // Destructure the request body to get user details
}) => {
    if(!firstname || !lastname || !email || !password) {
        throw new Error("All fields are required"); // Check if all required fields are provided
    }

    const user = await userModel.create({ // Create a new user in the database
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
    });

    return user; // Return the created user
} // Define the createUser function

module.exports = {
    createUser,
  };