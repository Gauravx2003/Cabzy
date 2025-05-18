import React, { useEffect } from "react";
import 'remixicon/fonts/remixicon.css';

const WaitingForDriver = ({ 
  isVisible, 
  driverDetails,
  acceptedRide, 
  pickup, 
  dropoff,
  onClose
}) => {
  // If panel is not visible, don't render anything
  if (!isVisible) return null;

  const { 
    driverName = "John Doe", 
    vehicleNumber = "ABC 123", 
    otp = "1234", 
    eta = "5 mins",
    driverImage = "",
    vehicleType = "Sedan"
  } = driverDetails || {};

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Captain Found</h3>
        <div 
          className="bg-gray-100 p-1 rounded-full cursor-pointer"
          onClick={onClose}
        >
          <i className="ri-close-line text-lg"></i>
        </div>
      </div>

      {/* Driver Details Section */}
      <div className="flex items-center border border-gray-200 rounded-xl p-3 mb-4">
        <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {driverImage ? (
            <img 
              className="h-full w-full object-cover" 
              src={driverImage} 
              alt={`${driverName}`} 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              <i className="ri-user-fill text-xl"></i>
            </div>
          )}
        </div>
        <div className="ml-3">
          <h4 className="font-medium">
            {acceptedRide?.data?.captain?.fullname?.firstname} {acceptedRide?.data?.captain?.fullname?.lastname}
          </h4>
          <p className="font-normal text-xs text-gray-500">{vehicleType} • {vehicleNumber}</p>
        </div>
        <div className="ml-auto">
          <div className="flex flex-col items-center">
            <span className="font-bold text-md">{eta}</span>
            <span className="text-xs text-gray-500">away</span>
          </div>
        </div>
      </div>

      {/* OTP Section */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">YOUR OTP</p>
            <p className="text-2xl font-bold tracking-wider">{acceptedRide.data.otp}</p>
          </div>
          <div className="text-blue-500">
            <i className="ri-shield-check-fill text-2xl"></i>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this code with your captain to start the ride
        </p>
      </div>

      {/* Trip Details Section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mt-1 mr-3">
            <i className="ri-map-pin-fill"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">PICKUP</p>
            <p className="text-sm font-medium">{pickup || "No pickup location selected"}</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="text-blue-500 text-xl mt-1 mr-3">
            <i className="ri-map-pin-line"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">DROPOFF</p>
            <p className="text-sm font-medium">{dropoff || "No dropoff location selected"}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button 
          className="flex-1 bg-white text-black border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <i className="ri-phone-fill mr-2 text-blue-500"></i>
          Call Captain
        </button>
        <button 
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <i className="ri-message-2-fill mr-2"></i>
          Message
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;