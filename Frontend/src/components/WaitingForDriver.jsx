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
  console.log("acceptedRide", acceptedRide);  

  const { 
    driverName = "John Doe", 
    vehicleNumber = "ABC 123", 
    otp = "1234", 
    eta = "5 mins",
    driverImage = "",
    vehicleType = "Sedan"
  } = driverDetails || {};

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-2 border-gray-100 p-4 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">🎉 Captain Found!</h3>
        <div 
          className="bg-gray-100 p-1 rounded-full cursor-pointer"
          onClick={onClose}
        >
          <i className="ri-close-line text-lg"></i>
        </div>
      </div>

      {/* Captain Details Section - Prominently Bordered */}
      <div className="border-2 border-green-200 rounded-xl p-4 mb-4 bg-green-50">
        <div className="flex items-center">
          <div className="h-14 w-14 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            {driverImage ? (
              <img 
                className="h-full w-full object-cover" 
                src={driverImage} 
                alt={`${driverName}`} 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500 text-2xl">
                👤
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h4 className="font-semibold text-lg">
              {acceptedRide?.data?.captain?.fullname?.firstname} {acceptedRide?.data?.captain?.fullname?.lastname}
            </h4>
            <p className="font-medium text-sm text-gray-600">
              🚗 {acceptedRide?.data?.captain?.vehicle?.vehicleType} • {acceptedRide?.data?.captain?.vehicle?.plate}
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex flex-col items-center bg-white rounded-lg p-2 border border-green-300">
              <span className="font-bold text-lg text-green-600">⏱️ {eta}</span>
              <span className="text-xs text-gray-500">away</span>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Section - Large and Prominent */}
      <div className="border-3 border-blue-300 bg-blue-50 rounded-xl p-6 mb-6 shadow-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">🔐 YOUR RIDE OTP</p>
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-md">
            <p className="text-4xl font-black tracking-wider text-blue-600">{acceptedRide.data.otp}</p>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">
            📱 Share this code with your captain to start the ride
          </p>
        </div>
      </div>

      {/* Trip Details Section */}
      <div className="border border-gray-200 rounded-xl p-3 mb-4 bg-gray-50">
        <div className="space-y-3">
          {/* Pickup Point */}
          <div className="flex items-center">
            <span className="mr-3 text-green-600">🟢</span>
            <div>
              <h5 className="font-medium text-sm">Pickup Point</h5>
              <p className="text-gray-600 text-xs">{pickup || "No pickup location selected"}</p>
            </div>
          </div>
          
          {/* Dropoff Point */}
          <div className="flex items-center">
            <span className="mr-3 text-red-600">🔴</span>
            <div>
              <h5 className="font-medium text-sm">Dropoff Point</h5>
              <p className="text-gray-600 text-xs">{dropoff || "No dropoff location selected"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="bg-white text-black border-2 border-blue-300 py-3 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <span className="mr-2 text-xl">📞</span>
          Call Captain
        </button>
        <button 
          className="bg-blue-500 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <span className="mr-2 text-xl">💬</span>
          Message
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;