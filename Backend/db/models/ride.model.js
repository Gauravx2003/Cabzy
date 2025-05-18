const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },

    vehicleType:{
        type: String,
        enum: ['car', 'auto', 'bike'],
        required: true,
    },

    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        
    },
    duration: {
        type: Number,
        
    },

    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select : false, // Exclude OTP from queries by default
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('ride', rideSchema); // Export the ride model for use in other files