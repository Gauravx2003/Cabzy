const mapsService = require('../services/maps.service');   
const {validationResult, query} = require('express-validator'); // Import validationResult from express-validator  

module.exports.getCoordinate = async (req, res) => {
    const errors = validationResult(req); // Validate the request
    if (!errors.isEmpty()) { // Check if there are validation errors
        return res.status(422).json({errors: errors.array()}); // Return validation errors
    }

    // Extract the address from the request query parameters
    const {address} = req.query;

    try{
        const coordinates = await mapsService.getAddressCoordinate(address); // Call the service to get coordinates
        return res.status(200).json({coordinates}); // Return the coordinates in the response
    }catch(error){
        console.error('Error fetching coordinates:', error.message); // Log the error message
        return res.status(500).json({error: 'Unable to fetch coordinates for the given address'}); // Return an error response
    }
}

module.exports.getDistanceAndTime = async (req, res, next) => {

    try{

        const errors = validationResult(req); // Validate the request
        if(!errors.isEmpty()) { // Check if there are validation errors
            return res.status(422).json({errors: errors.array()}); // Return validation errors
        }

        const {origin, destination} = req.query; // Extract origin and destination from the request query parameters
        const distanceAndTime = await mapsService.getDistanceAndTime(origin, destination); // Call the service to get distance and time

        res.status(200).json({distanceAndTime}); // Return the distance and time in the response
    }catch(error){
        console.error('Error fetching distance and time:', error.message); // Log the error message
        return res.status(500).json({error: 'Unable to fetch distance and time for the given locations'}); // Return an error response
    }
    

}

module.exports.getSuggestion = async (req, res, next) => {
    try{
        const errors = validationResult(req); // Validate the request
        if(!errors.isEmpty()) { // Check if there are validation errors
            return res.status(422).json({errors: errors.array()}); // Return validation errors
        }

        const {address} = req.query; // Extract address from the request query parameters
        const suggestions = await mapsService.getSuggestion(address); // Call the service to get suggestions

        res.status(200).json({suggestions}); // Return the suggestions in the response  
    }catch(error){
        console.error('Error fetching suggestions:', error.message); // Log the error message
        return res.status(500).json({error: 'Unable to fetch suggestions for the given address'}); // Return an error response
    }

}