import React from "react";
import { Link, useLocation } from "react-router-dom";
import mp from "../assets/images/map.jpg"; // Map image placeholder
import 'remixicon/fonts/remixicon.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainRiding = ({ confirmedRide, pickup, dropoff, onCompleteRide }) => {
  // User data for the confirmed ride
  const userInfo = {
    name: "Sarah Johnson",
    rating: 4.7,
    phone: "+91 98765 43210",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    otp: "2847"
  };

  // Trip details
  const tripDetails = {
    distance: "3.8 km",
    duration: "15 mins",
    fare: "₹145",
    rideType: "UberGo",
    paymentMethod: "Cash"
  };

  const location = useLocation();
  const navigate = useNavigate();
  const rideData= location.state?.ride || {};
  console.log("Ride Data:", rideData);

  async function onCompleteRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ride/end-ride`,
        {
          rideId: rideData.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Ride completed successfully:", response.data);
        navigate("/captain-home");

        // Handle successful ride completion
      }
    } catch (error) {
      console.error("Error completing ride:", error.response?.data || error.message);
      alert(error.response?.data?.error || "An error occurred while completing the ride.");
    }
  }
  

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with trip status */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-green-500 h-3 w-3 rounded-full mr-3"></div>
          <span className="font-semibold text-gray-800">Trip in Progress</span>
        </div>
        <Link to="/captain-home" className="h-10 w-10 bg-gray-100 rounded-full flex justify-center items-center">
          <i className="ri-close-line text-gray-600"></i>
        </Link>
      </div>

      {/* Map Section */}
      <div className="h-2/5 relative">
        <img className="h-full w-full object-cover" src={mp} alt="map_image" />
        
        {/* Trip info overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <i className="ri-navigation-line text-blue-500 text-lg mr-2"></i>
                <span className="font-medium">{tripDetails.distance}</span>
                <span className="text-gray-500 ml-1">• {tripDetails.duration}</span>
              </div>
              <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Navigate
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trip Details Section */}
      <div className="flex-1 bg-white">
        <div className="p-4">
          {/* Passenger Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Passenger Details</h3>
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                OTP: {userInfo.otp}
              </div>
            </div>
            
            <div className="flex items-center">
              <img 
                className="h-12 w-12 rounded-full object-cover" 
                src={userInfo.image} 
                alt="Passenger" 
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{userInfo.name}</h4>
                  <div className="flex items-center">
                    
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{userInfo.phone}</p>
              </div>
              
            </div>
          </div>

          {/* Trip Summary */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Trip Summary</span>
              <span className="text-gray-500 text-sm">{tripDetails.rideType}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-blue-500 text-xl mb-1">
                  <i className="ri-route-line"></i>
                </div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-semibold">{tripDetails.distance}</p>
              </div>
              <div>
                <div className="text-blue-500 text-xl mb-1">
                  <i className="ri-time-line"></i>
                </div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold">{tripDetails.duration}</p>
              </div>
              <div>
                <div className="text-green-500 text-xl mb-1">
                  <i className="ri-money-rupee-circle-line"></i>
                </div>
                <p className="text-xs text-gray-500">Fare</p>
                <p className="font-semibold text-green-600">{tripDetails.fare}</p>
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-3 mb-6">
            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="bg-green-500 h-4 w-4 rounded-full"></div>
                <div className="border-l-2 border-dashed border-gray-300 h-6"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                <p className="text-sm">{pickup || "123 Main Street, Downtown Area"}</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="border-2 border-red-500 h-4 w-4 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">DROP-OFF</p>
                <p className="text-sm">{dropoff || "456 Park Avenue, Business District"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            
            
            <button 
              onClick={onCompleteRide}
              className="w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <i className="ri-checkbox-circle-line mr-2"></i>
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;