# Cabzy - Real-Time Cab Booking Application

Cabzy is a modern, real-time cab booking platform that connects riders with nearby drivers. Built with React and Node.js, it offers a seamless experience for both passengers and drivers with features like live tracking, secure payments, and real-time notifications.

## Features

### For Passengers
- Real-time cab booking
- Live driver tracking
- Multiple vehicle options (Car, Bike, Auto)
- Secure payment integration with Razorpay
- OTP verification for ride start
- Live distance and ETA updates
- Location search with suggestions
- Ride history and fare estimates

### For Drivers (Captains)
- Live ride requests
- Real-time location updates
- Earnings tracking
- Ride statistics
- Accept/Reject ride options
- Navigation assistance

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io Client
- Google Maps API
- Razorpay Integration
- GSAP for animations

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Google Maps API
- Razorpay API

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB
- Google Maps API Key
- Razorpay API Keys

## Environment Variables

### Backend (.env)
```
PORT=4000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API=your_google_maps_api_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cabzy.git
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

## Running the Application

1. Start the Backend Server
```bash
cd Backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd Frontend
npm run dev
```

## API Documentation

Detailed API documentation is available in the Backend/README.md file, including:
- User Authentication Routes
- Captain (Driver) Routes
- Ride Management Routes
- Payment Integration
- Maps Integration

## Project Structure

```
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   └── app.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
│   └── index.html
```

## Security Features

- JWT Authentication
- Password Hashing
- Token Blacklisting
- OTP Verification
- Secure Payment Gateway
- Protected Routes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps API for location services
- Razorpay for payment integration
- Socket.io for real-time communication
- MongoDB for database management