import React, { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';

const LookingForDriver = ({ 
  isVisible, 
  onCancelRide, 
  selectedRide, 
  pickup, 
  dropoff 
}) => {
  const [loadingDots, setLoadingDots] = useState("");
  
  // Loading animation effect
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  // If panel is not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Looking for Driver{loadingDots}</h3>
        <div 
          className="bg-gray-100 p-1 rounded-full cursor-pointer"
          onClick={onCancelRide}
        >
          <i className="ri-close-line text-lg"></i>
        </div>
      </div>

      {/* Ride Details Section */}
      {selectedRide && (
        <div className="flex items-center border border-gray-200 rounded-xl p-3 mb-4">
          <img 
            className="h-12 w-16 object-contain" 
            src={selectedRide.image} 
            alt={`${selectedRide.name} logo`} 
          />
          <div className="ml-3">
            <h4 className="font-medium text-sm">
              {selectedRide.name} <span className="ml-1"><i className="ri-user-fill"></i>{selectedRide.capacity}</span>
            </h4>
            <p className="font-normal text-xs text-gray-500">{selectedRide.description}</p>
          </div>
          <h2 className="font-semibold ml-auto">{selectedRide.price}</h2>
        </div>
      )}

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

      {/* Animation Section */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 rounded-full animate-spin mb-4"></div>
        <p className="text-center text-gray-700 font-medium">
          Connecting you with a nearby driver
        </p>
        <p className="text-center text-gray-500 text-sm mt-1">
          This may take a few moments
        </p>
      </div>

      {/* Cancel Button */}
      <div className="mt-4">
        <button 
          onClick={onCancelRide}
          className="bg-white text-black border border-gray-300 w-full py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default LookingForDriver;