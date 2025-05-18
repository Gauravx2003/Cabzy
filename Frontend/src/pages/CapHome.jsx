import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import {CaptainDataContext} from "../context/CaptainContext";
import { Link } from "react-router-dom";
import logoUrl from "../assets/images/Captain_logo.jpg";
import mapUrl from "../assets/images/map.jpg";
import RidePopUp from "../components/RidePopUp";
import FinishRide from "../components/FinishRide";
import axios from "axios";
import 'remixicon/fonts/remixicon.css';


const CapHome = () => {
  // Captain Profile and Earnings State
  const [captainDetails, setCaptainDetails] = useState({
    name: "Gaurav Daware",
    todayEarnings: 3000,
    hoursOnline: 10.2,
    kmTravelled: 39,
    ridesCompleted: 12,
    isOnline: true
  });

  const [ride, setRide] = useState({});

  // Ride States
  const [rideState, setRideState] = useState({
    isRidePopUpVisible: false,
    isFinishRideVisible: false,
    currentRide: {
      passengerName: "Rahul Kumar",
      pickupPoint: "Shivaji Nagar, Pune",
      dropoffPoint: "Koregaon Park, Pune",
      distanceFromPassenger: "2.5 KM",
      rideDistance: "7.3 KM",
      pay: "₹193"
    }
  });

  const {captain} = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext); // Fetch Socket from Context 
  // Fetch Captain Data from Context

  // Handlers for Ride Request
  const handleIgnoreRide = () => {
    setRideState(prev => ({
      ...prev,
      isRidePopUpVisible: false
    }));
  };

  const handleTakePassenger = () => {
    setRideState(prev => ({
      ...prev,
      isRidePopUpVisible: false,
      isFinishRideVisible: true
    }));
  };

  const handleCloseFinishRide = () => {
    setRideState(prev => ({
      ...prev,
      isFinishRideVisible: false
    }));
  };

  const handleFinishRide = () => {
    setRideState(prev => ({
      ...prev,
      isFinishRideVisible: false
    }));
    
    // Update stats after completing ride
    setCaptainDetails(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + parseInt(rideState.currentRide.pay.replace('₹', '')),
      kmTravelled: prev.kmTravelled + parseFloat(rideState.currentRide.rideDistance),
      ridesCompleted: prev.ridesCompleted + 1
    }));
  };

  // Handler for Online/Offline Toggle
  const toggleOnlineStatus = () => {
    setCaptainDetails(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
  };

  async function confirmRide() {
    if (!ride || !ride.data) {
      console.error("No ride data available");
      return;
    }
     const response = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/ride/accept-ride`,
  {
    rideId: ride.data._id,
    //otp: ride.data.otp,
    captain: captain,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);

  }


  useEffect(() => {
      if (captain && captain._id && socket) {
        socket.emit("join", { userId: captain._id, type: "captain" });
        
      }

      let locationInterval;

      if (captain && captain._id && socket) {
        locationInterval = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // Emit location to server
                socket.emit("update-captain-location", {
                  userId: captain._id,
                  location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  }
                });
              },
              (error) => {
                // Optionally handle error
              }
            );
          }
        }, 10000);
      }

      return () => {
        if (locationInterval) clearInterval(locationInterval);
      };
    }, [captain, socket]); // Runs only when user/socket change

  
    //console.log(socket.id);
useEffect(() => {
  if (!socket) return;

  socket.on("rideRequest", (data) => {
    console.log("Ride request received via socket:", data);
    setRide(data);
  });

  return () => socket.off("rideRequest"); // cleanup to avoid duplicate handlers
}, [socket]);


useEffect(() => {
  if (ride && ride.data) {
    console.log("Updated ride:", ride);

    // Show the popup after ride is set
    setRideState(prev => ({
      ...prev,
      isRidePopUpVisible: true
    }));
  }
}, [ride]);




useEffect(() => {
  if (socket && captain?._id) {
    socket.emit("join", { userId: captain._id, type: "captain" });
  }
}, [socket, captain]);



  // Calculate panel height - for FinishRide, make map take more space
  const panelHeight = rideState.isFinishRideVisible ? "40%" : "45%";
  const mapHeight = rideState.isFinishRideVisible ? "60%" : "55%";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-2">
        {/* Logo */}
        <div className="bg-white rounded-full p-3 shadow-lg">
          <img 
            className="w-16 h-16 object-contain rounded" 
            src={logoUrl} 
            alt="Captain Logo" 
          />
        </div>
        
        {/* Logout Button */}
        <Link 
          to="/captain/logout" 
          className="h-10 w-10 bg-white rounded-full flex justify-center items-center shadow-md"
        >
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>
      
      {/* Map Section */}
      <div style={{ height: mapHeight }} className="w-full">
        <img 
          className="h-full w-full object-cover" 
          src={mapUrl} 
          alt="Map Background" 
        />
      </div>
      
      {/* Captain Details Section */}
      <div style={{ height: panelHeight }} className="bg-white rounded-t-3xl shadow-lg p-4">
        {/* Captain Profile and Earnings */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">  
            <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h4 className="text-lg font-semibold">{captain?.fullname?.firstname} {captain?.fullname?.lastname}</h4>
          </div>
          
          <div className="text-right">
            <h4 className="text-2xl font-bold text-green-600">
              ₹{captainDetails.todayEarnings}
            </h4>
            <p className="text-gray-600 text-sm">Earned Today</p>
          </div>
        </div>
        
        {/* Captain Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Hours Online */}
          <div className="bg-blue-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-blue-600 text-xl mb-1">⏱️</span>
            <h5 className="text-xl font-bold">{captainDetails.hoursOnline}</h5>
            <p className="text-gray-600 text-sm">Hrs Online</p>
          </div>
          
          {/* Distance Travelled */}
          <div className="bg-green-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-green-600 text-xl mb-1">🚀</span>
            <h5 className="text-xl font-bold">{captainDetails.kmTravelled} KM</h5>
            <p className="text-gray-600 text-sm">Travelled</p>
          </div>
          
          {/* Rides Completed */}
          <div className="bg-purple-50 rounded-xl p-2 flex flex-col items-center justify-center">
            <span className="text-purple-600 text-xl mb-1">🏍️</span>
            <h5 className="text-xl font-bold">{captainDetails.ridesCompleted}</h5>
            <p className="text-gray-600 text-sm">Rides Completed</p>
          </div>
        </div>
        
        {/* Online/Offline Toggle Button */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={toggleOnlineStatus}
            className={`text-white py-3 px-8 rounded-full font-medium shadow-md flex items-center gap-2 ${
              captainDetails.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div className="h-3 w-3 bg-white rounded-full"></div>
            {captainDetails.isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Ride Popup Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
          rideState.isRidePopUpVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <RidePopUp 
          ride={ride}
          confirmRide={confirmRide}
          isVisible={rideState.isRidePopUpVisible}
          onIgnore={handleIgnoreRide}
          onTakePassenger={handleTakePassenger}
        />
      </div>

      {/* Finish Ride Panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
          rideState.isFinishRideVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {rideState.isFinishRideVisible && (
          <FinishRide 
            rideDetails={rideState.currentRide}
            ride={ride}
            onClose={handleCloseFinishRide}
            onFinishRide={handleFinishRide}
          />
        )}
      </div>
    </div>
  );
};

export default CapHome;