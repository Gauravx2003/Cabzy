import React, { useState } from "react";
import OTPpanel from "./OTPpanel";

const FinishRide = ({ rideDetails, onFinishRide, distance, ride, onClose }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);

  

  const handleEnterOTP = () => {
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setRideStarted(true);
  };

  //console.log("Sending DATA:", ride);

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          {rideStarted ? "Finish Ride" : "Start Ride"}
        </h3>
        <div className="bg-gray-100 p-1 rounded-full cursor-pointer" onClick={onClose}>
          <i className="ri-close-line text-lg"></i>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center mr-3">
          <span className="text-xl">👤</span>
        </div>
        <div>
          <h4 className="font-semibold">{ride?.data?.user?.fullname?.firstname} {ride?.data?.user?.fullname?.lastname}</h4>
          <p className="text-gray-600 text-sm">
            {rideStarted ? "In Progress" : "Ready to Pick Up"}
          </p>
        </div>
      </div>

      {/* Ride Details */}
      <div className="space-y-3 mb-4">
        {/* Pickup/Dropoff Point */}
        <div className="flex items-center">
          <span className="mr-3 text-green-600">
            {rideStarted ? "🔴" : "🟢"}
          </span>
          <div>
            <h5 className="font-medium text-sm">
              {rideStarted ? "Dropoff Point" : "Pickup Point"}
            </h5>
            <p className="text-gray-600 text-xs">
              {rideStarted ? ride.data.destination : ride.data.origin}
            </p>
          </div>
        </div>

        

        {/* Ride Details Grid */}
        <div className={`grid ${rideStarted ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
          {/* Distance from Passenger */}
          {!rideStarted && (
            <div className="bg-blue-50 rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-blue-600 text-xl mb-1">📍</span>
              <h5 className="text-sm font-bold">{rideDetails.distanceFromPassenger}</h5>
              <p className="text-gray-600 text-xs">From You</p>
            </div>
          )}
          
          {/* Ride Distance */}
          <div className="bg-green-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-green-600 text-xl mb-1">🚗</span>
            <h5 className="text-sm font-bold">{parseFloat(distance?.distanceAndTime?.distance)} KM</h5>
            <p className="text-gray-600 text-xs">Ride Dist</p>
          </div>
          
          {/* Ride Pay */}
          <div className="bg-purple-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-purple-600 text-xl mb-1">💰</span>
            <h5 className="text-sm font-bold">{ride.data.fare}</h5>
            <p className="text-gray-600 text-xs">Earnings</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!showOTP && (
        <button
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium shadow-md"
          onClick={rideStarted ? onFinishRide : handleEnterOTP}
        >
          {rideStarted ? "Finish Ride" : "Enter OTP"}
        </button>
      )}

      
      {/* OTP Panel */}
      {showOTP && <OTPpanel ride={ride} distance={distance} onVerify={handleOTPVerified} />}
    </div>
  );
};

export default FinishRide;