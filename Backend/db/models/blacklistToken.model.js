const mongoose = require('mongoose'); // Import Mongoose library
const blacklistTokenSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 
    } // TTL of 24 hours (86400 seconds)
});

module.exports = mongoose.model('blacklistToken', blacklistTokenSchema);