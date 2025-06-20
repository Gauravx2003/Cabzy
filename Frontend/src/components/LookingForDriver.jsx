import React, { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';

const LookingForDriver = ({ 
  isVisible, 
  onCancelRide, 
  selectedRide, 
  pickup, 
  dropoff,
  fare,
  onDriverFound
}) => {

  if (!isVisible) return null;

  const [loadingDots, setLoadingDots] = useState("");
  const [driverFound, setDriverFound] = useState(false);

  
  
  // Loading animation effect
  useEffect(() => {
    if (!isVisible || driverFound) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible, driverFound]);

  // Simulate finding a driver (for demo purposes)
  // In a real app, this would come from socket events or API calls
  // useEffect(() => {
  //   if (!isVisible || driverFound) return;
    
  //   // Simulate finding a driver after 5 seconds
  //   const timeout = setTimeout(() => {
  //     setDriverFound(true);
      
  //     // After showing success animation for 1.5 seconds, transition to WaitingForDriver component
  //     setTimeout(() => {
  //       if (onDriverFound) {
  //         onDriverFound({
  //           driverName: "Alex Johnson",
  //           vehicleNumber: "KL 01 AB 1234",
  //           otp: "5678",
  //           eta: "3 mins",
  //           vehicleType: selectedRide?.name || "Sedan"
  //         });
  //         setDriverFound(false); // Reset for next time
  //       }
  //     }, 1500);
  //   }, 5000);
    
  //   return () => {
  //     clearTimeout(timeout);
  //     setDriverFound(false);
  //   };
  // }, [isVisible, onDriverFound, selectedRide]);
  
  // If panel is not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          {driverFound ? "Captain Found!" : `Looking for Driver${loadingDots}`}
        </h3>
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
              {selectedRide.name} <span className="ml-1">👤{selectedRide.capacity}</span>
            </h4>
            <p className="font-normal text-xs text-gray-500">{selectedRide.description}</p>
          </div>
          <h2 className="font-semibold ml-auto">💰{fare[
                              selectedRide.name === "CabzyGo"
                              ? "car"
                              : selectedRide.name === "Cabzy Moto"
                              ? "bike"
                              : "auto"
                            ]}</h2>
        </div>
      )}

      {/* Trip Details Section */}
      <div className="space-y-3 mb-4">
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

      {/* Animation Section */}
      <div className="flex flex-col items-center justify-center py-6">
        {driverFound ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl animate-scale-in">
              ✅
            </div>
            <p className="text-center text-gray-700 font-medium mt-4">
              Captain found! Preparing details...
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 rounded-full animate-spin mb-4"></div>
            <p className="text-center text-gray-700 font-medium">
              🔍 Connecting you with a nearby captain
            </p>
            <p className="text-center text-gray-500 text-sm mt-1">
              This may take a few moments
            </p>
          </>
        )}
      </div>

      {/* Cancel Button - Only show if driver not found yet */}
      {!driverFound && (
        <div className="mt-4">
          <button 
            onClick={onCancelRide}
            className="bg-red-500 text-white w-full py-3 rounded-lg font-medium shadow-md hover:bg-red-600 transition-colors"
          >
            Cancel Ride
          </button>
        </div>
      )}
    </div>
  );
};

export default LookingForDriver;