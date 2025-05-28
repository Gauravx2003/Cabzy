import React, { useState, useEffect } from "react";
import axios from "axios";

const RidePopUp = ({ isVisible, onIgnore, confirmRide, onTakePassenger, distance, ride }) => {
  // If panel is not visible, don't render anything
  if (!isVisible) return null;

  const [destinationCoord, setDestinationCoord] = React.useState({});
  const destinationRef = React.useRef({});
  const [LiveDistance, setLiveDistance] = React.useState({});
  

  
   async function LiveUpdation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
  
          console.log("Current position:", pos);
          console.log("Destination coordinates:", destinationRef.current);
  
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/maps/live-location`,
              {
                origin: pos,
                destination: destinationRef.current, // ✅ use ref, not state
                
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
  
            
            if (response.status === 200) {
              console.log("Live Distance and Time:", response.data);
              setLiveDistance(response.data.distanceAndTime);
              // Optionally update state here
            } else {
              console.error("Error fetching distance and time:", response.data);
            }
          } catch (err) {
            console.error("Error in live location update:", err);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }

  useEffect(() => {
    console.log("Ride Data:", ride);
      axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/maps/get-coordinates-cap`,
        {
          params: { address: ride?.data?.origin },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => {
          //console.log("Destination coordinates:", response.data.coordinates);
          setDestinationCoord(response.data.coordinates);
          destinationRef.current = response.data.coordinates; // ✅ sync to ref

          LiveUpdation(); // Call the function to update live distance
        })
        .catch((error) => {
          console.error("Error fetching destination coordinates:", error);
        });
    }, []);



console.log("Live Distance in Ride POP UP:", LiveDistance);



  const rideDetails = {
    passengerName: "Rahul Kumar",
    pickupPoint: "Shivaji Nagar, Pune",
    dropoffPoint: "Koregaon Park, Pune",
    distanceFromPassenger: "2.5 KM",
    rideDistance: "7.3 KM",
    pay: "₹193"
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
      {/* Ride Details Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">New Ride Request</h3>
        <div 
          className="bg-gray-100 p-1 rounded-full cursor-pointer"
          onClick={onIgnore}
        >
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
          <p className="text-gray-600 text-sm">Ride Request</p>
        </div>
      </div>
      
      {/* Ride Details */}
      <div className="space-y-3 mb-4">
        {/* Pickup Point */}
        <div className="flex items-center">
          <span className="mr-3 text-green-600">🟢</span>
          <div>
            <h5 className="font-medium text-sm">Pickup Point</h5>
            <p className="text-gray-600 text-xs">{ride.data.origin}</p>
          </div>
        </div>
        
        {/* Dropoff Point */}
        <div className="flex items-center">
          <span className="mr-3 text-red-600">🔴</span>
          <div>
            <h5 className="font-medium text-sm">Dropoff Point</h5>
            <p className="text-gray-600 text-xs">{ride.data.destination}</p>
          </div>
        </div>
        
        {/* Ride Details Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Distance from Passenger */}
          <div className="bg-blue-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-blue-600 text-xl mb-1">📍</span>
            <h5 className="text-sm font-bold">{LiveDistance.distance}</h5>
            <p className="text-gray-600 text-xs">From You</p>
          </div>
          
          {/* Ride Distance */}
          <div className="bg-green-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-green-600 text-xl mb-1">🚗</span>
            <h5 className="text-sm font-bold">{parseFloat(distance?.distanceAndTime?.distance)} KM</h5>
            <p className="text-gray-600 text-xs">Ride Dist</p>
          </div>
          
          {/* Ride Pay */}
          <div className="bg-purple-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-purple-600 text-xl mb-1">💰</span>
            <h5 className="text-sm font-bold">₹{ride.data.fare}</h5>
            <p className="text-gray-600 text-xs">Earnings</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="bg-red-500 text-white py-3 rounded-lg font-medium shadow-md"
          onClick={onIgnore}
        >
          Ignore
        </button>
        <button 
          className="bg-green-500 text-white py-3 rounded-lg font-medium shadow-md"
          onClick={() => {
            onTakePassenger();
            confirmRide();
          }
        }
        >
          Take Passenger
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;