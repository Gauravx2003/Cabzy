const { Server } = require("socket.io");
const captainModel = require('./db/models/captain.model');
const userModel = require('./db/models/user.model');

let io;
const socketUserMap = {}; // userId -> socketId


/**
 * Initializes the Socket.io server.
 * @param {http.Server} server - The HTTP server instance.
 * @returns {Server} The initialized Socket.io instance.
 */
const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
           
            // Remove user from map
          for (let userId in socketUserMap) {
            if (socketUserMap[userId] === socket.id) {
            delete socketUserMap[userId];
            break;
        }
    }
        });

        socket.on("join", async (data) => {
            const { userId, type } = data;
            console.log(userId);
            socketUserMap[userId] = socket.id;  // 🔑 store mapping
            

            console.log(`User ${userId} of type ${type} joined with socket ID: ${socket.id}`);

            try {
                if (type === "captain") {
                    await captainModel.findByIdAndUpdate(userId, { socketID: socket.id }, { new: true });
                    console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
                } else if (type === "user") {
                    await userModel.findByIdAndUpdate(userId, { socketID: socket.id }, { new: true });
                    console.log(`User ${userId} joined with socket ID: ${socket.id}`);
                }
            } catch (err) {
                console.error("Error updating socketId:", err);
            }
        });

        socket.on("update-captain-location", async (data) => {
            const { userId, location } = data;

            if (!location || typeof location.latitude !== "number" || typeof location.longitude !== "number") {
                return socket.emit("error", "Invalid location data");
            }

            const geoLocation = {
                type: "Point",
                coordinates: [location.longitude, location.latitude], // IMPORTANT: GeoJSON = [lng, lat]
            };

           console.log(`Captain ${userId} updated location to:`, geoLocation);

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: geoLocation
                }, { new: true });

                //console.log(`Captain ${userId} location updated successfully.`);
            } catch (err) {
                console.error("Error updating captain location:", err);
            }
        });

        

    });

    return io;
};

/**
 * Sends a message to a specific socket by its ID.
 * @param {string} socketId - The target socket ID.
 * @param {string} event - The event name to emit.
 * @param {*} message - The message/data to send.
 */
const sendMessageToSocketId = (userId, event, message) => {
    
    if (io) {
        
        const socketId = socketUserMap[userId];
        console.log("Sendin to: ",socketId);
        console.log("Current socketUserMap:", socketUserMap);

    if (socketId && io) {
        io.to(socketId).emit(event, message);
    } else {
        
        console.warn(`User ${userId} not connected`);
    }
    } else {
        console.error("Socket.io not initialized. Call initializeSocket() first.");
    }
};

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
