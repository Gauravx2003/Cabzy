import React from "react";
import { Link } from "react-router-dom";
import mp from "../assets/images/map.jpg"; // Map image placeholder
import 'remixicon/fonts/remixicon.css';

const Riding = ({ selectedRide, pickup, dropoff, onMakePayment }) => {
  // Temporary driver data (will be replaced with real data in the future)
  const driverInfo = {
    name: "Captain Alex",
    rating: 4.8,
    vehicle: "Honda Activa",
    vehicleNumber: "DL 5S AB 1234",
    eta: "5 mins",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Home button */}
      <Link to="/home" className="fixed right-2 top-2 z-10 h-10 w-10 bg-white rounded-full flex justify-center items-center shadow-md">
        <i className="ri-home-5-line"></i>
      </Link>
      
      {/* Map Section - Upper Half */}
      <div className="h-1/2">
        <img className="h-full w-full object-cover" src={mp} alt="map_image" />
      </div>
      
      {/* Ride Details Section - Lower Half */}
      <div className="h-1/2">
        <div className="bg-white rounded-t-3xl shadow-lg p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Your Ride is in Progress</h3>
            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
              On the way
            </div>
          </div>

          {/* Driver Details Section */}
          <div className="flex items-center border border-gray-200 rounded-xl p-3 mb-4">
            <div className="relative">
              <img 
                className="h-14 w-14 rounded-full object-cover" 
                src={driverInfo.image} 
                alt="Driver" 
              />
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full"></div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-base">{driverInfo.name}</h4>
                <div className="flex items-center">
                  <i className="ri-star-fill text-yellow-500 mr-1"></i>
                  <span className="text-sm font-medium">{driverInfo.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{driverInfo.vehicle} • {driverInfo.vehicleNumber}</p>
              <div className="mt-1 flex items-center text-blue-600">
                <i className="ri-time-line mr-1"></i>
                <span className="text-sm">Arriving in {driverInfo.eta}</span>
              </div>
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
                <p className="text-sm font-medium">{pickup || "123 Main Street, Downtown"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-blue-500 text-xl mt-1 mr-3">
                <i className="ri-map-pin-line"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">DROPOFF</p>
                <p className="text-sm font-medium">{dropoff || "456 Park Avenue, Uptown"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-4">
            <button className="flex-1 flex justify-center items-center py-2 border border-gray-300 rounded-lg">
              <i className="ri-phone-fill text-blue-500 mr-2"></i>
              <span>Call</span>
            </button>
            <button className="flex-1 flex justify-center items-center py-2 border border-gray-300 rounded-lg">
              <i className="ri-message-2-line text-blue-500 mr-2"></i>
              <span>Message</span>
            </button>
          </div>

          {/* Payment Button */}
          <div className="mt-4">
            <button 
              onClick={onMakePayment}
              className="bg-black text-white w-full py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;