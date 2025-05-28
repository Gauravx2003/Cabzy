const axios = require('axios'); // Import Axios for HTTP requests
const captainModel = require('../db/models/captain.model'); // Import the captain model for database operations

module.exports.getAddressCoordinate = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API; // Ensure your Google Maps API key is stored in an environment variable
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url); // Make a GET request to the Google Maps API
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Failed to fetch coordinates: ${data.status}`);
        }

        const location = data.results[0].geometry.location; // Extract latitude and longitude from the response
        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw new Error('Unable to fetch coordinates for the given address');
    }
};

module.exports.getDistanceAndTime = async (origin, destination) => {
    if(!origin || !destination){
        throw new Error('Origin and destination are required'); // Check if origin and destination are provided
    }

    const apiKey= process.env.GOOGLE_MAPS_API; // Ensure your Google Maps API key is stored in an environment variable  
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url); // Make a GET request to the Google Maps API
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Failed to fetch distance and time: ${data.status}`);
        }

        const element = data.rows[0].elements[0]; // Extract the first element from the response
        if (element.status !== 'OK') {
            throw new Error(`Failed to fetch distance and time: ${element.status}`);
        }

        return {
            distance: element.distance.text, // Extract distance text
            duration: element.duration.text, // Extract duration text
        };
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw new Error('Unable to fetch distance and time for the given locations');
    }
}

module.exports.LiveLocation = async (originCoords, destinationCoords) => {
    if (!originCoords || !destinationCoords) {
        throw new Error('Origin coordinates and destination address are required');
    }

    console.log("Origin Coords:", originCoords);
    console.log("Destination Coords:", destinationCoords);


    const R = 6371e3; // Earth radius in meters
    const toRad = deg => deg * Math.PI / 180;

    const lat1 = toRad(originCoords.latitude);
    const lat2 = toRad(destinationCoords.latitude);
    const dLat = lat2 - lat1;
    const dLon = toRad(destinationCoords.longitude - originCoords.longitude); // ✅ FIXED HERE

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // in meters

    const averageSpeedKmph = 30;
    const durationHours = (distance / 1000) / averageSpeedKmph;
    const durationMinutes = durationHours * 60;

    return {
        distance: `${(distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(durationMinutes)} mins`
    };
};


module.exports.getSuggestion = async (address) => {
    if(!address){
        throw new Error('Address is required'); // Check if address is provided
    }

    const apiKey = process.env.GOOGLE_MAPS_API; // Ensure your Google Maps API key is stored in an environment variable
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url); // Make a GET request to the Google Maps API
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Failed to fetch suggestions: ${data.status}`);
        }

        return data.predictions.map(prediction => prediction.description); // Extract and return the suggestions
    } catch (error) {
        console.error('Error fetching suggestions:', error.message);
        throw new Error('Unable to fetch suggestions for the given address');
    }
}

module.exports.getCaptainInRadius = async (latitude, longitude, radius) => {
    if(!latitude || !longitude || !radius){
        throw new Error('Latitude, longitude, and radius are required'); // Check if latitude, longitude, and radius are provided
    }

    //radius is in km

    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 6371] // Use the Haversine formula to calculate distance
                }
            }
        });

        return captains; // Return the list of captains within the specified radius
    } catch (error) {
        console.error('Error fetching captains in radius:', error.message);
        throw new Error('Unable to fetch captains in the specified radius');
    }
}