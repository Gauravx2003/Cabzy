# 🚖 Cabzy - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & System Design](#architecture--system-design)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Frontend Components](#frontend-components)
7. [Real-time Communication](#real-time-communication)
8. [Authentication & Security](#authentication--security)
9. [Payment Integration](#payment-integration)
10. [Maps & Location Services](#maps--location-services)
11. [Installation & Setup](#installation--setup)
12. [Environment Configuration](#environment-configuration)
13. [Deployment Guide](#deployment-guide)
14. [User Flows](#user-flows)
15. [Testing](#testing)
16. [Troubleshooting](#troubleshooting)
17. [Performance Optimization](#performance-optimization)
18. [Future Enhancements](#future-enhancements)

---

## Project Overview

### What is Cabzy?
Cabzy is a full-stack, real-time cab booking application that connects passengers with nearby drivers. It provides a seamless experience similar to Uber/Ola with features like live tracking, secure payments, and instant notifications.

### Key Features
- **Real-time Ride Booking**: Instant connection between passengers and drivers
- **Live Location Tracking**: GPS-based tracking with real-time updates
- **Multiple Vehicle Types**: Car, Bike, and Auto options
- **Secure Payments**: Razorpay integration for safe transactions
- **OTP Verification**: Secure ride start verification
- **Dynamic Pricing**: Distance and time-based fare calculation
- **Driver Dashboard**: Comprehensive earnings and ride statistics
- **Responsive Design**: Mobile-first approach with cross-platform compatibility

### Target Users
1. **Passengers**: Users who need transportation services
2. **Drivers (Captains)**: Service providers who own vehicles
3. **Administrators**: System managers (future scope)

---

## Architecture & System Design

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - User Interface│    │ - REST APIs     │    │ - User Data     │
│ - Real-time UI  │    │ - Socket.io     │    │ - Ride Data     │
│ - Maps          │    │ - Authentication│    │ - Location Data │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐              
         └──────────────►│  External APIs  │              
                        │                 │              
                        │ - Google Maps   │              
                        │ - Razorpay      │              
                        │ - Socket.io     │              
                        └─────────────────┘              
```

### System Components

#### 1. Frontend (React.js)
- **User Interface**: Responsive design with Tailwind CSS
- **State Management**: React Context API for global state
- **Real-time Updates**: Socket.io client for live communication
- **Maps Integration**: Google Maps API for location services
- **Payment UI**: Razorpay checkout integration

#### 2. Backend (Node.js/Express)
- **REST API**: RESTful endpoints for CRUD operations
- **Authentication**: JWT-based authentication system
- **Real-time Communication**: Socket.io server for live updates
- **Database Operations**: MongoDB operations with Mongoose
- **External Integrations**: Google Maps API, Razorpay API

#### 3. Database (MongoDB)
- **User Management**: User and Captain profiles
- **Ride Management**: Ride requests, status, and history
- **Location Data**: Real-time location tracking
- **Payment Records**: Transaction history and status

---

## Technology Stack

### Frontend Technologies
```javascript
{
  "framework": "React.js 19.0.0",
  "styling": "Tailwind CSS 4.1.5",
  "routing": "React Router DOM 7.5.3",
  "http_client": "Axios 1.9.0",
  "real_time": "Socket.io Client 4.8.1",
  "maps": "@react-google-maps/api 2.20.6",
  "animations": "GSAP 3.13.0",
  "icons": "React Icons 5.5.0, Remix Icons 4.6.0",
  "build_tool": "Vite 6.3.1"
}
```

### Backend Technologies
```javascript
{
  "runtime": "Node.js",
  "framework": "Express.js 5.1.0",
  "database": "MongoDB with Mongoose 8.14.1",
  "authentication": "JWT (jsonwebtoken 9.0.2)",
  "password_hashing": "bcrypt 5.1.1",
  "real_time": "Socket.io 4.8.1",
  "validation": "express-validator 7.2.1",
  "http_requests": "Axios 1.9.0",
  "payments": "Razorpay 2.9.2",
  "environment": "dotenv 16.5.0",
  "cors": "cors 2.8.5"
}
```

### External Services
- **Google Maps API**: Geocoding, Distance Matrix, Places API
- **Razorpay**: Payment processing and verification
- **MongoDB Atlas**: Cloud database hosting
- **Vercel**: Frontend deployment
- **Railway/Heroku**: Backend deployment

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required),
    lastname: String (required)
  },
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  socketID: String (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

### Captain Collection
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required),
    lastname: String (required)
  },
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  socketID: String (default: null),
  status: String (enum: ['active', 'inactive'], default: 'inactive'),
  vehicle: {
    color: String (required),
    plate: String (required),
    capacity: Number (required, min: 1),
    vehicleType: String (enum: ['car', 'bike', 'auto'], required)
  },
  location: {
    type: String (default: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  totalEarnings: Number (default: 0),
  totalRides: Number (default: 0),
  totalDistance: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Ride Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'user', required),
  captain: ObjectId (ref: 'captain'),
  vehicleType: String (enum: ['car', 'auto', 'bike'], required),
  origin: String (required),
  destination: String (required),
  distance: Number,
  duration: Number,
  fare: Number (required),
  status: String (enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending'),
  paymentId: String,
  orderId: String,
  signature: String,
  otp: String (required, select: false),
  createdAt: Date,
  updatedAt: Date
}
```

### BlacklistToken Collection
```javascript
{
  _id: ObjectId,
  token: String (required),
  createdAt: Date (default: Date.now, expires: 86400) // TTL of 24 hours
}
```

---

## API Documentation

### Authentication Endpoints

#### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "user": {
    "_id": "user_id",
    "fullname": {...},
    "email": "john@example.com",
    "socketID": null
  },
  "token": "jwt_token"
}
```

#### User Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {...},
  "token": "jwt_token"
}
```

#### Captain Registration
```http
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "White",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {
    "type": "Point",
    "coordinates": [73.8567, 18.5204]
  }
}
```

### Ride Management Endpoints

#### Create Ride
```http
POST /ride/create-ride
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": "Pickup Location",
  "destination": "Drop Location",
  "vehicleType": "car"
}

Response (201):
{
  "_id": "ride_id",
  "user": "user_id",
  "origin": "Pickup Location",
  "destination": "Drop Location",
  "vehicleType": "car",
  "fare": 150,
  "status": "pending",
  "otp": "1234"
}
```

#### Accept Ride (Captain)
```http
POST /ride/accept-ride
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "rideId": "ride_id"
}
```

#### Start Ride (Captain)
```http
POST /ride/start-ride
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "otp": "1234"
}
```

#### End Ride (Captain)
```http
POST /ride/end-ride
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "fare": 150,
  "distance": 5.2
}
```

### Maps & Location Endpoints

#### Get Coordinates
```http
GET /maps/get-coordinates?address=Mumbai
Authorization: Bearer <token>

Response (200):
{
  "coordinates": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

#### Get Distance and Time
```http
GET /maps/get-distance-time?origin=Mumbai&destination=Pune
Authorization: Bearer <token>

Response (200):
{
  "distanceAndTime": {
    "distance": "148 km",
    "duration": "2 hours 45 mins"
  }
}
```

#### Get Location Suggestions
```http
GET /maps/get-suggestion?address=Mumb
Authorization: Bearer <token>

Response (200):
{
  "suggestions": [
    "Mumbai, Maharashtra, India",
    "Mumbai Airport, Mumbai, Maharashtra, India",
    "Mumbai Central, Mumbai, Maharashtra, India"
  ]
}
```

### Payment Endpoints

#### Create Payment Order
```http
POST /payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id"
}

Response (200):
{
  "orderId": "order_id",
  "amount": 15000,
  "currency": "INR",
  "key": "razorpay_key_id"
}
```

#### Verify Payment
```http
POST /payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "razorpayPaymentId": "pay_id",
  "razorpayOrderId": "order_id",
  "razorpaySignature": "signature"
}
```

---

## Frontend Components

### Component Structure
```
src/
├── components/
│   ├── FinishRide.jsx          # Captain ride completion
│   ├── LiveDistanceOverlay.jsx # Real-time distance display
│   ├── LiveTracking.jsx        # Google Maps live tracking
│   ├── LocationSearchPanel.jsx # Location search with suggestions
│   ├── LookingForDriver.jsx    # Driver search animation
│   ├── OTPpanel.jsx           # OTP verification for captains
│   ├── PaymentComplete.jsx     # Payment success animation
│   ├── RidePopUp.jsx          # Captain ride request popup
│   ├── RidesPanel.jsx         # Vehicle selection panel
│   └── WaitingForDriver.jsx   # Driver found confirmation
├── pages/
│   ├── Start.jsx              # Landing page
│   ├── UserLogin.jsx          # User authentication
│   ├── UserSignup.jsx         # User registration
│   ├── CaptainLogin.jsx       # Captain authentication
│   ├── CaptainSignup.jsx      # Captain registration
│   ├── home.jsx               # User dashboard
│   ├── capHome.jsx            # Captain dashboard
│   ├── Riding.jsx             # Active ride (user view)
│   ├── CaptainRiding.jsx      # Active ride (captain view)
│   ├── UserProtectWrapper.jsx # User route protection
│   └── CaptainProtectWrapper.jsx # Captain route protection
├── context/
│   ├── UserContext.jsx        # User state management
│   ├── CaptainContext.jsx     # Captain state management
│   └── SocketContext.jsx      # Socket connection management
└── assets/
    └── images/                # Static images and logos
```

### Key Component Details

#### 1. LocationSearchPanel.jsx
```javascript
// Features:
- Real-time location suggestions
- Google Places API integration
- Debounced search to optimize API calls
- Clean, intuitive UI with icons

// Props:
- suggestions: Array of location suggestions
- onLocationSelect: Callback when location is selected
```

#### 2. RidesPanel.jsx
```javascript
// Features:
- Multiple vehicle type selection
- Dynamic pricing display
- Responsive grid layout
- Selection state management

// Vehicle Types:
- CabzyGo (Car): 4 passengers
- Cabzy Moto (Bike): 1 passenger  
- Cabzy Auto (Auto): 3 passengers
```

#### 3. LiveTracking.jsx
```javascript
// Features:
- Google Maps integration
- Real-time location updates
- Geolocation API usage
- 10-second update intervals

// Implementation:
- Uses @react-google-maps/api
- Handles geolocation permissions
- Updates captain location via socket
```

#### 4. Socket Integration
```javascript
// Real-time Events:
- rideRequest: New ride notification to captains
- rideAccepted: Ride confirmation to users
- rideStarted: Ride start notification
- rideEnded: Ride completion notification
- paymentComplete: Payment success notification
- update-captain-location: Live location updates
```

---

## Real-time Communication

### Socket.io Implementation

#### Server-Side (Backend)
```javascript
// socket.js
const { Server } = require("socket.io");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        // User/Captain joins with their ID
        socket.on("join", async (data) => {
            const { userId, type } = data;
            socketUserMap[userId] = socket.id;
            
            if (type === "captain") {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketID: socket.id 
                });
            } else if (type === "user") {
                await userModel.findByIdAndUpdate(userId, { 
                    socketID: socket.id 
                });
            }
        });

        // Captain location updates
        socket.on("update-captain-location", async (data) => {
            const { userId, location } = data;
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude]
                }
            });
        });
    });

    return io;
};
```

#### Client-Side (Frontend)
```javascript
// SocketContext.jsx
const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL);
        
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });
        
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
```

### Real-time Event Flow

#### 1. Ride Request Flow
```
User creates ride → Backend finds nearby captains → 
Socket emits "rideRequest" to matching captains → 
Captain accepts → Socket emits "rideAccepted" to user
```

#### 2. Location Update Flow
```
Captain app gets GPS location → Socket emits "update-captain-location" → 
Backend updates captain location in database → 
Location available for distance calculations
```

#### 3. Ride Status Flow
```
Captain starts ride → Backend verifies OTP → 
Socket emits "rideStarted" to user → 
User navigates to riding page
```

---

## Authentication & Security

### JWT Implementation

#### Token Generation
```javascript
// User/Captain Model Method
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );
    return token;
}
```

#### Authentication Middleware
```javascript
// auth.middleware.js
module.exports.userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || 
                  (authHeader && authHeader.split(" ")[1]);

    if (!token) {
        return res.status(401).json({error: "Unauthorized"});
    }

    // Check token blacklist
    const blacklistToken = await blacklistTokenModel.findOne({token});
    if (blacklistToken) {
        return res.status(401).json({error: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({error: "Unauthorized"});
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({error: "Unauthorized"});
    }
}
```

### Password Security
```javascript
// Password Hashing
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Password Comparison
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
```

### Token Blacklisting
```javascript
// Logout Implementation
module.exports.logout = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || 
                  req.headers.authorization.split(' ')[1];
    
    // Add token to blacklist
    await blacklistTokenModel.create({ token });
    
    res.status(200).json({ message: "Logged out successfully" });
}
```

---

## Payment Integration

### Razorpay Setup

#### Backend Payment Service
```javascript
// payments.service.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount) => {
    const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: "order_" + Date.now(),
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};

const verifyPayment = (razorpayOrderId, razorpayPaymentId, signature) => {
    const crypto = require('crypto');
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");
    
    return generated_signature === signature;
};
```

#### Frontend Payment Integration
```javascript
// Riding.jsx - Payment Handler
const handlePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
        alert("Razorpay SDK failed to load");
        return;
    }

    try {
        // Create order
        const response = await axios.post('/payment/create-order', {
            rideId: rideData.data._id
        });

        const options = {
            key: response.data.key,
            amount: response.data.amount,
            currency: response.data.currency,
            name: "Cabzy",
            description: "Ride Payment",
            order_id: response.data.orderId,
            handler: async (response) => {
                // Verify payment
                await axios.post('/payment/verify', {
                    rideId: rideData.data._id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                });
                
                alert("Payment successful!");
                navigate("/home");
            },
            theme: { color: "#000000" }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        alert("Payment failed");
    }
};
```

### Payment Flow
1. **Order Creation**: Backend creates Razorpay order
2. **Payment UI**: Frontend opens Razorpay checkout
3. **Payment Processing**: User completes payment
4. **Verification**: Backend verifies payment signature
5. **Confirmation**: Socket notifies captain of payment completion

---

## Maps & Location Services

### Google Maps API Integration

#### Services Used
1. **Geocoding API**: Convert addresses to coordinates
2. **Distance Matrix API**: Calculate distance and time
3. **Places API**: Location suggestions and autocomplete
4. **Maps JavaScript API**: Display interactive maps

#### Backend Maps Service
```javascript
// maps.service.js
module.exports.getAddressCoordinate = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Failed to fetch coordinates: ${data.status}`);
        }

        const location = data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    } catch (error) {
        throw new Error('Unable to fetch coordinates');
    }
};

module.exports.getDistanceAndTime = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const element = response.data.rows[0].elements[0];

        return {
            distance: element.distance.text,
            duration: element.duration.text,
        };
    } catch (error) {
        throw new Error('Unable to fetch distance and time');
    }
};
```

#### Frontend Maps Integration
```javascript
// LiveTracking.jsx
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);

    const updateCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentPosition(pos);
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    };

    useEffect(() => {
        updateCurrentLocation();
        const intervalId = setInterval(updateCurrentLocation, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} />
            </GoogleMap>
        </LoadScript>
    );
};
```

### Location-Based Features

#### 1. Captain Discovery
```javascript
// Find captains within radius
module.exports.getCaptainInRadius = async (latitude, longitude, radius) => {
    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 6371]
                }
            }
        });
        return captains;
    } catch (error) {
        throw new Error('Unable to fetch captains in radius');
    }
};
```

#### 2. Live Distance Calculation
```javascript
// Calculate live distance between two coordinates
module.exports.LiveLocation = async (originCoords, destinationCoords) => {
    const R = 6371e3; // Earth radius in meters
    const toRad = deg => deg * Math.PI / 180;

    const lat1 = toRad(originCoords.latitude);
    const lat2 = toRad(destinationCoords.latitude);
    const dLat = lat2 - lat1;
    const dLon = toRad(destinationCoords.longitude - originCoords.longitude);

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
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Maps API Key
- Razorpay Account

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/cabzy.git
cd cabzy
```

#### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file
touch .env
```

#### 3. Frontend Setup
```bash
cd Frontend
npm install

# Create .env file
touch .env
```

#### 4. Database Setup
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas
# Create cluster and get connection string
```

#### 5. Environment Configuration
See [Environment Configuration](#environment-configuration) section

#### 6. Start Development Servers
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### Verification Steps
1. Backend server should start on `http://localhost:4000`
2. Frontend should start on `http://localhost:5173`
3. Database connection should be established
4. Socket.io connection should be active

---

## Environment Configuration

### Backend Environment Variables (.env)
```bash
# Database
DB_CONNECT=mongodb://localhost:27017/cabzy
# OR for MongoDB Atlas:
# DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/cabzy

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Google Maps API
GOOGLE_MAPS_API=your_google_maps_api_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (.env)
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# Google Maps API Key
VITE_GOOGLE_MAPS_API=your_google_maps_api_key

# App Configuration
VITE_APP_NAME=Cabzy
VITE_APP_VERSION=1.0.0
```

### API Keys Setup Guide

#### 1. Google Maps API Setup
```bash
# Go to Google Cloud Console
# Enable the following APIs:
- Maps JavaScript API
- Geocoding API
- Distance Matrix API
- Places API

# Create credentials (API Key)
# Restrict API key to your domains
# Add key to environment variables
```

#### 2. Razorpay Setup
```bash
# Sign up at https://razorpay.com
# Go to Dashboard > Settings > API Keys
# Generate Key ID and Key Secret
# Add to environment variables
# Configure webhooks (optional)
```

#### 3. MongoDB Setup
```bash
# Local MongoDB:
# Install MongoDB Community Edition
# Start MongoDB service
# Use connection string: mongodb://localhost:27017/cabzy

# MongoDB Atlas:
# Create account at https://www.mongodb.com/atlas
# Create cluster
# Create database user
# Get connection string
# Replace <password> with actual password
```

---

## Deployment Guide

### Frontend Deployment (Vercel)

#### 1. Prepare for Deployment
```bash
# Build the project
cd Frontend
npm run build

# Test build locally
npm run preview
```

#### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### 3. Vercel Configuration (vercel.json)
```json
{
    "rewrites": [
        {"source": "/(.*)", "destination": "/index.html"}
    ],
    "env": {
        "VITE_BACKEND_URL": "https://your-backend-url.com",
        "VITE_GOOGLE_MAPS_API": "your_google_maps_api_key"
    }
}
```

### Backend Deployment (Railway/Heroku)

#### 1. Prepare Backend
```bash
# Add start script to package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

# Create Procfile (for Heroku)
echo "web: node server.js" > Procfile
```

#### 2. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### 3. Environment Variables Setup
```bash
# Set production environment variables
railway variables set DB_CONNECT=mongodb+srv://...
railway variables set JWT_SECRET=production_secret
railway variables set GOOGLE_MAPS_API=your_api_key
railway variables set RAZORPAY_KEY_ID=your_key_id
railway variables set RAZORPAY_KEY_SECRET=your_secret
```

### Database Deployment (MongoDB Atlas)

#### 1. Create Production Database
```bash
# Create new cluster in MongoDB Atlas
# Configure network access (0.0.0.0/0 for development)
# Create database user
# Get connection string
```

#### 2. Database Migration
```bash
# Export local data (if needed)
mongoexport --db cabzy --collection users --out users.json

# Import to Atlas (if needed)
mongoimport --uri "mongodb+srv://..." --collection users --file users.json
```

### SSL/HTTPS Configuration
```bash
# Frontend (Vercel) - Automatic HTTPS
# Backend - Use Railway/Heroku built-in SSL
# Custom domain - Configure DNS and SSL certificates
```

### Performance Optimization for Production
```bash
# Enable gzip compression
# Set up CDN for static assets
# Configure caching headers
# Optimize database queries
# Set up monitoring and logging
```

---

## User Flows

### 1. User Registration & Login Flow
```
Start Page → User Login → Enter Credentials → 
Authentication → Home Dashboard
```

**Detailed Steps:**
1. User opens app and sees landing page
2. Clicks "Continue" to go to login page
3. Enters email and password
4. Backend validates credentials
5. JWT token generated and stored
6. User redirected to home dashboard
7. Socket connection established

### 2. Ride Booking Flow (User)
```
Home Dashboard → Enter Locations → Select Vehicle → 
Looking for Driver → Driver Found → Ride Started → 
Payment → Ride Completed
```

**Detailed Steps:**
1. User enters pickup and drop-off locations
2. System shows location suggestions via Google Places API
3. User selects locations and sees vehicle options with pricing
4. User selects vehicle type and confirms booking
5. System creates ride request in database
6. Backend finds nearby captains using geospatial queries
7. Ride request sent to matching captains via Socket.io
8. User sees "Looking for Driver" animation
9. Captain accepts ride, user gets notification
10. User sees driver details and OTP
11. Driver starts ride using OTP verification
12. User tracks live location during ride
13. User makes payment via Razorpay
14. Ride marked as completed

### 3. Captain Registration & Onboarding
```
Captain Signup → Vehicle Details → Verification → 
Captain Dashboard → Go Online
```

**Detailed Steps:**
1. Captain fills registration form with personal details
2. Captain enters vehicle information (type, color, plate, capacity)
3. Account created with "inactive" status
4. Captain logs in and sees dashboard
5. Captain toggles online status to receive ride requests
6. Location tracking starts automatically

### 4. Ride Acceptance Flow (Captain)
```
Online Status → Ride Request Notification → 
Accept/Reject → OTP Verification → Start Ride → 
Navigate to Destination → Complete Ride → Payment Received
```

**Detailed Steps:**
1. Captain sets status to "online"
2. Location updates sent to server every 10 seconds
3. Ride request popup appears with passenger details
4. Captain can accept or ignore the request
5. If accepted, captain gets passenger's OTP
6. Captain enters OTP to start the ride
7. Live navigation and distance tracking begins
8. Captain completes ride and updates earnings
9. Payment notification received via Socket.io

### 5. Payment Flow
```
Ride Completion → Payment Button → Razorpay Checkout → 
Payment Processing → Verification → Success Notification
```

**Detailed Steps:**
1. User clicks "Pay" button after ride completion
2. Frontend creates payment order via backend API
3. Razorpay checkout modal opens
4. User enters payment details
5. Payment processed by Razorpay
6. Backend verifies payment signature
7. Payment status updated in database
8. Captain receives payment confirmation via Socket.io
9. User redirected to home dashboard

---

## Testing

### Manual Testing Checklist

#### Authentication Testing
- [ ] User registration with valid data
- [ ] User registration with invalid data (validation errors)
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Captain registration with vehicle details
- [ ] JWT token expiration handling
- [ ] Logout functionality
- [ ] Protected route access without token

#### Ride Booking Testing
- [ ] Location search and suggestions
- [ ] Pickup and drop-off location selection
- [ ] Vehicle type selection and pricing
- [ ] Ride creation and database storage
- [ ] Captain discovery within radius
- [ ] Real-time ride request notifications
- [ ] Ride acceptance and rejection
- [ ] OTP generation and verification
- [ ] Ride status updates
- [ ] Live location tracking

#### Payment Testing
- [ ] Payment order creation
- [ ] Razorpay checkout integration
- [ ] Payment success flow
- [ ] Payment failure handling
- [ ] Payment verification
- [ ] Webhook handling (if implemented)

#### Real-time Communication Testing
- [ ] Socket.io connection establishment
- [ ] User/Captain joining with socket ID
- [ ] Real-time location updates
- [ ] Ride request broadcasting
- [ ] Status update notifications
- [ ] Connection handling on network issues

### API Testing with Postman

#### 1. Authentication Endpoints
```javascript
// User Registration
POST {{baseUrl}}/users/register
{
  "fullname": {
    "firstname": "Test",
    "lastname": "User"
  },
  "email": "test@example.com",
  "password": "password123"
}

// Expected: 201 status with user object and token
```

#### 2. Ride Management Endpoints
```javascript
// Create Ride
POST {{baseUrl}}/ride/create-ride
Authorization: Bearer {{userToken}}
{
  "origin": "Mumbai Airport",
  "destination": "Mumbai Central",
  "vehicleType": "car"
}

// Expected: 201 status with ride object
```

#### 3. Maps API Testing
```javascript
// Get Coordinates
GET {{baseUrl}}/maps/get-coordinates?address=Mumbai
Authorization: Bearer {{userToken}}

// Expected: 200 status with coordinates object
```

### Load Testing Considerations
```javascript
// Test scenarios:
- Concurrent user registrations
- Multiple simultaneous ride requests
- High-frequency location updates
- Payment processing under load
- Socket.io connection limits
```

### Error Handling Testing
```javascript
// Test cases:
- Network connectivity issues
- Database connection failures
- External API failures (Google Maps, Razorpay)
- Invalid input data
- Expired tokens
- Socket disconnections
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Problem: MongoDB connection failed
# Solution:
- Check MongoDB service is running
- Verify connection string in .env
- Check network connectivity
- Ensure database user has proper permissions

# Debug commands:
mongosh "mongodb://localhost:27017/cabzy"
```

#### 2. Socket.io Connection Problems
```bash
# Problem: Real-time features not working
# Solution:
- Check CORS configuration
- Verify socket server is running
- Check client-side socket connection
- Inspect browser network tab for socket errors

# Debug:
console.log('Socket connected:', socket.connected);
```

#### 3. Google Maps API Issues
```bash
# Problem: Maps not loading or geocoding failing
# Solution:
- Verify API key is correct
- Check API key restrictions
- Ensure required APIs are enabled
- Check API usage quotas

# Debug:
console.log('Maps API response:', response.data);
```

#### 4. Payment Integration Issues
```bash
# Problem: Razorpay checkout not opening
# Solution:
- Check Razorpay script loading
- Verify API keys
- Check order creation response
- Inspect browser console for errors

# Debug:
console.log('Razorpay order:', orderResponse);
```

#### 5. Authentication Problems
```bash
# Problem: JWT token issues
# Solution:
- Check token expiration
- Verify JWT secret consistency
- Check token blacklist
- Ensure proper token storage

# Debug:
jwt.verify(token, process.env.JWT_SECRET);
```

### Performance Issues

#### 1. Slow API Responses
```bash
# Solutions:
- Add database indexes
- Optimize queries
- Implement caching
- Use connection pooling

# MongoDB indexes:
db.captains.createIndex({ location: "2dsphere" })
db.rides.createIndex({ user: 1, createdAt: -1 })
```

#### 2. High Memory Usage
```bash
# Solutions:
- Implement pagination
- Limit query results
- Clean up unused variables
- Optimize image sizes

# Memory monitoring:
process.memoryUsage()
```

#### 3. Socket.io Performance
```bash
# Solutions:
- Limit concurrent connections
- Implement room-based messaging
- Optimize event frequency
- Use Redis adapter for scaling

# Connection limits:
io.engine.generateId = () => "custom-socket-id";
```

### Debugging Tools and Techniques

#### 1. Backend Debugging
```javascript
// Add comprehensive logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

// Use in controllers
logger.info('Ride created:', { rideId: ride._id, userId: req.user._id });
```

#### 2. Frontend Debugging
```javascript
// React Developer Tools
// Redux DevTools (if using Redux)
// Browser Network Tab
// Console logging with context

console.log('Socket event received:', { event: 'rideAccepted', data });
```

#### 3. Database Debugging
```javascript
// MongoDB Compass for visual debugging
// Database profiling
db.setProfilingLevel(2);
db.system.profile.find().sort({ ts: -1 }).limit(5);

// Query performance
db.rides.find({ user: ObjectId("...") }).explain("executionStats");
```

---

## Performance Optimization

### Frontend Optimization

#### 1. Code Splitting and Lazy Loading
```javascript
// Implement route-based code splitting
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/home'));
const CaptainHome = lazy(() => import('./pages/capHome'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/captain-home" element={<CaptainHome />} />
      </Routes>
    </Suspense>
  );
}
```

#### 2. Image Optimization
```javascript
// Use WebP format for images
// Implement lazy loading for images
// Optimize image sizes for different screen sizes

const LazyImage = ({ src, alt, className }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};
```

#### 3. State Management Optimization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>;
});

// Optimize context usage
const UserContext = createContext();
const SocketContext = createContext();

// Split contexts to avoid unnecessary re-renders
```

#### 4. Bundle Optimization
```javascript
// Vite configuration for optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          maps: ['@react-google-maps/api'],
          socket: ['socket.io-client']
        }
      }
    }
  }
});
```

### Backend Optimization

#### 1. Database Optimization
```javascript
// Add proper indexes
db.captains.createIndex({ 
  location: "2dsphere",
  status: 1,
  "vehicle.vehicleType": 1 
});

db.rides.createIndex({ 
  user: 1, 
  createdAt: -1 
});

db.rides.createIndex({ 
  captain: 1, 
  status: 1 
});

// Use aggregation pipelines for complex queries
const nearbyDrivers = await captainModel.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [longitude, latitude] },
      distanceField: "distance",
      maxDistance: radius * 1000,
      spherical: true
    }
  },
  {
    $match: { 
      status: "active",
      "vehicle.vehicleType": vehicleType 
    }
  },
  {
    $limit: 10
  }
]);
```

#### 2. API Response Optimization
```javascript
// Implement response compression
const compression = require('compression');
app.use(compression());

// Add response caching
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// Cache expensive operations
const getCachedFare = async (origin, destination) => {
  const cacheKey = `fare_${origin}_${destination}`;
  let fare = cache.get(cacheKey);
  
  if (!fare) {
    fare = await calculateFare(origin, destination);
    cache.set(cacheKey, fare);
  }
  
  return fare;
};
```

#### 3. Socket.io Optimization
```javascript
// Use rooms for targeted messaging
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    const { userId, type } = data;
    socket.join(`${type}_${userId}`);
  });
  
  // Send to specific room instead of all clients
  socket.to(`captain_${captainId}`).emit('rideRequest', data);
});

// Implement connection throttling
const rateLimit = require('express-rate-limit');

const socketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/socket.io/', socketLimiter);
```

#### 4. Memory Management
```javascript
// Implement garbage collection monitoring
const v8 = require('v8');

setInterval(() => {
  const heapStats = v8.getHeapStatistics();
  console.log('Heap used:', heapStats.used_heap_size / 1024 / 1024, 'MB');
}, 30000);

// Clean up inactive socket connections
const cleanupInterval = setInterval(() => {
  for (const [userId, socketId] of Object.entries(socketUserMap)) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket || !socket.connected) {
      delete socketUserMap[userId];
    }
  }
}, 60000); // Clean up every minute
```

### Monitoring and Analytics

#### 1. Performance Monitoring
```javascript
// Add request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  
  next();
});
```

#### 2. Error Tracking
```javascript
// Implement comprehensive error logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## Future Enhancements

### Short-term Improvements (1-3 months)

#### 1. Enhanced User Experience
```javascript
// Features to implement:
- Push notifications for ride updates
- Offline mode with cached data
- Dark mode theme
- Multi-language support
- Voice navigation integration
- Ride scheduling for future dates
- Favorite locations
- Ride sharing with multiple passengers
```

#### 2. Driver Features
```javascript
// Captain enhancements:
- Detailed earnings analytics
- Route optimization suggestions
- Driver ratings and reviews
- Vehicle maintenance reminders
- Fuel tracking
- Insurance integration
- Driver referral program
```

#### 3. Safety Features
```javascript
// Security improvements:
- Emergency SOS button
- Real-time ride sharing with contacts
- Driver background verification
- In-app calling (masked numbers)
- Ride recording for safety
- Panic button integration
- Safe pickup/drop zones
```

### Medium-term Features (3-6 months)

#### 1. Advanced Analytics
```javascript
// Business intelligence:
- Demand prediction algorithms
- Dynamic pricing based on demand
- Route optimization for drivers
- Customer behavior analysis
- Revenue optimization
- Market expansion insights
```

#### 2. Integration Enhancements
```javascript
// Third-party integrations:
- Calendar integration for scheduled rides
- Weather API for ride adjustments
- Traffic API for better ETAs
- Public transport integration
- Hotel/restaurant partnerships
- Corporate account management
```

#### 3. Mobile App Development
```javascript
// Native mobile apps:
- React Native implementation
- Push notification services
- Biometric authentication
- Offline map caching
- Background location tracking
- Deep linking support
```

### Long-term Vision (6+ months)

#### 1. AI and Machine Learning
```javascript
// ML implementations:
- Demand forecasting
- Route optimization algorithms
- Fraud detection systems
- Customer churn prediction
- Dynamic pricing models
- Driver-passenger matching optimization
```

#### 2. Scalability Improvements
```javascript
// Infrastructure scaling:
- Microservices architecture
- Container orchestration (Kubernetes)
- Load balancing and auto-scaling
- Multi-region deployment
- CDN implementation
- Database sharding
```

#### 3. Business Expansion
```javascript
// New business models:
- Food delivery integration
- Package delivery services
- Car rental services
- Electric vehicle support
- Subscription-based rides
- Corporate transportation solutions
```

### Technical Debt and Improvements

#### 1. Code Quality
```javascript
// Improvements needed:
- Comprehensive unit testing (Jest, React Testing Library)
- Integration testing (Supertest)
- End-to-end testing (Cypress)
- Code coverage reporting
- ESLint and Prettier configuration
- TypeScript migration
- API documentation with Swagger
```

#### 2. Security Enhancements
```javascript
// Security improvements:
- Rate limiting implementation
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- API versioning
- Audit logging
- Data encryption at rest
```

#### 3. Performance Monitoring
```javascript
// Monitoring tools:
- Application Performance Monitoring (APM)
- Real User Monitoring (RUM)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Metrics collection (Prometheus)
- Alerting systems
- Health check endpoints
```

### Implementation Roadmap

#### Phase 1: Foundation (Completed)
- [x] Basic ride booking functionality
- [x] Real-time communication
- [x] Payment integration
- [x] Maps integration
- [x] User authentication

#### Phase 2: Enhancement (Next 3 months)
- [ ] Mobile app development
- [ ] Push notifications
- [ ] Advanced safety features
- [ ] Driver analytics dashboard
- [ ] Comprehensive testing suite

#### Phase 3: Scale (3-6 months)
- [ ] Microservices architecture
- [ ] AI/ML integration
- [ ] Multi-city expansion
- [ ] Corporate partnerships
- [ ] Advanced analytics

#### Phase 4: Innovation (6+ months)
- [ ] Autonomous vehicle integration
- [ ] Blockchain-based payments
- [ ] IoT device integration
- [ ] AR/VR features
- [ ] Global expansion

---

## Conclusion

Cabzy represents a comprehensive solution for modern transportation needs, built with cutting-edge technologies and best practices. The application demonstrates:

### Technical Excellence
- **Scalable Architecture**: Modular design supporting future growth
- **Real-time Communication**: Seamless user experience with instant updates
- **Security First**: JWT authentication, input validation, and secure payments
- **Performance Optimized**: Efficient database queries and optimized frontend

### Business Value
- **User-Centric Design**: Intuitive interface for both passengers and drivers
- **Revenue Generation**: Multiple monetization strategies
- **Market Ready**: Production-ready with deployment configurations
- **Extensible Platform**: Foundation for additional services

### Development Best Practices
- **Clean Code**: Well-structured, maintainable codebase
- **Documentation**: Comprehensive technical and user documentation
- **Testing Ready**: Framework for comprehensive testing implementation
- **Monitoring**: Built-in logging and error handling

This documentation serves as a complete guide for developers, stakeholders, and future contributors to understand, maintain, and extend the Cabzy platform. The project showcases modern full-stack development practices and provides a solid foundation for a production-ready ride-sharing application.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team  
**License**: MIT