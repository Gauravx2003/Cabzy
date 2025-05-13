const axios = require('axios'); // Import Axios for HTTP requests

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