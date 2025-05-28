import React, { useState, useEffect, useRef, use } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import logo from "../assets/images/Cabzy_logo.png";
import mp from "../assets/images/map.jpg";
import { MdLocationPin } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import LocationSearchPanel from "../components/LocationSearchPanel";
import RidesPanel from "../components/RidesPanel";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import 'remixicon/fonts/remixicon.css';
import {SocketContext} from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";   
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isRidesPanelVisible, setIsRidesPanelVisible] = useState(false);
  const [isLookingForDriverVisible, setIsLookingForDriverVisible] = useState(false);
  const [isWaitingForDriverVisible, setIsWaitingForDriverVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [active, setActive] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [fare, setFare] = useState({});
  const [acceptedRide, setAcceptedRide] = useState({});

  const { socket } = React.useContext(SocketContext);
  const {user}= React.useContext(UserDataContext);

  const navigate = useNavigate();
  
  const ridesPanelRef = useRef(null);
  const driverPanelRef = useRef(null);
  const waitingPanelRef = useRef(null);
  
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleInputFocus = () => {
    setIsPanelExpanded(true);
    setIsRidesPanelVisible(false);
    setIsLookingForDriverVisible(false);
    setIsWaitingForDriverVisible(false);
  };

  const handleCollapsePanel = () => {
    setPickup("");
    setDropoff("");
    setIsPanelExpanded(false);
  };

  const fetchSuggestions = async (address) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/maps/get-suggestion`, {
        params: { address },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

 async function createRide(vehicleType) {
    try { 
        console.log(pickup);
        console.log(dropoff);
        console.log(vehicleType);   
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ride/create-ride`, {
            origin: pickup,
            destination: dropoff,
            vehicleType
            
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response.data); 
        return response.data;
    } catch (error) {
        console.error('Error creating ride:', error);
        throw error;
    }
 }

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    
    if (type === "Pickup") {
      setPickup(value);
    } else {
      setDropoff(value);
    }

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout to avoid too many API calls
    setSearchTimeout(setTimeout(() => {
      if (value.trim()) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 300));
  };

  const handleLocationSelect = async (location) => {
    if (active === "Dropoff") {
      setDropoff(location);
      // Only show rides panel if both locations are set
      if (pickup) {
        setIsRidesPanelVisible(true);
        setIsPanelExpanded(false);
      }
    } else {
      setPickup(location);
      // Only show rides panel if both locations are set
      if (dropoff) {
        setIsRidesPanelVisible(true);
        setIsPanelExpanded(false);
      }
    }
    setSuggestions([]); // Clear suggestions after selection
    setIsPanelExpanded(true);

     // Safely assign origin and destination
  const origin = active === "Dropoff" ? pickup : location;
  const destination = active === "Dropoff" ? location : dropoff;

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ride/get-fare`, {
        params: { origin, destination},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

    console.log(response.data);
    setFare(response.data);
  };

  const handleBookRide = (ride) => {
    setSelectedRide(ride);
    setIsRidesPanelVisible(false);
    setIsLookingForDriverVisible(true);
  };

  const handleCancelRide = () => {
    setIsLookingForDriverVisible(false);
    setIsWaitingForDriverVisible(false);
    setIsRidesPanelVisible(true);
  };

  const handleDriverFound = (driverData) => {
    setDriverDetails(driverData);
    setIsLookingForDriverVisible(false);
    setIsWaitingForDriverVisible(true);
  };

  const handleClickOutside = (event) => {
    // Close rides panel when clicking outside
    if (ridesPanelRef.current && !ridesPanelRef.current.contains(event.target) && 
        !event.target.closest('.location-panel')) {
      setIsRidesPanelVisible(false);
    }
    
    // We don't want to close the driver panels when clicking outside
    // as they're part of an active process
  };

  const handleOtherCap = async()=>{
     try { 
        console.log(pickup);
        console.log(dropoff);
        //console.log(vehicleType);   
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ride/ride-found`, {
            origin: pickup,
            destination: dropoff,
            
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response.data); 
        return response.data;
    } catch (error) {
        console.error('Error creating ride:', error);
        throw error;
    }
  }

  useEffect(() => {
    // Add click event listener to detect clicks outside the rides panel
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Hide rides panel if either pickup or dropoff is cleared
    if (!pickup || !dropoff) {
      setIsRidesPanelVisible(false);
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    if (user && user._id && socket) {
      socket.emit("join", { userId: user._id, type: "user" });
    }
  }, [user, socket]); // Runs only when user/socket change

  useEffect(() => {
    if(socket){
      socket.on("rideAccepted", (data) => {
        console.log("Ride accepted:", data);
        setAcceptedRide(data);
        // When a ride is accepted via socket, transition to WaitingForDriver
        setIsWaitingForDriverVisible(true);
        setIsLookingForDriverVisible(false);
        handleOtherCap();
        
        
      });
    }
    return () => {
      if(socket) {
        socket.off("rideAccepted");
      }
    };
  }, [socket, selectedRide]);

useEffect(() => {
    if(socket){
      socket.on("rideStarted", (data) => {
        console.log("Ride started:", data);
        setAcceptedRide(data);
        // When a ride is accepted via socket, transition to WaitingForDriver
        setIsWaitingForDriverVisible(true);
        setIsLookingForDriverVisible(false);
        navigate("/riding", {state: {ride: data}});
      });
    }
    return () => {
      if(socket) {
        socket.off("rideStarted");
      }
    };
  }, [socket, selectedRide]);
 

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map Background */}
      <div className="h-full w-full">
        {/* Logo */}
        <div className="bg-white rounded-full p-3 left-2 top-2 shadow-lg absolute z-10">
          <img className="w-16 h-16 object-contain rounded" src={logo} alt="logo" />
        </div>
        <LiveTracking/>
      </div>
      
      {/* Panel Container */}
      <div 
        className={`absolute w-full h-full transition-all duration-400 ease-in-out ${
          isPanelExpanded ? "bottom-0" : "bottom-[-66%]"
        }`}
      >
        {/* Dropdown arrow - only visible when panel is expanded */}
        {isPanelExpanded && (
          <div 
            className="bg-white rounded-full p-2 absolute top-3 right-5 cursor-pointer shadow-md z-20"
            onClick={handleCollapsePanel}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
        )}
        
        {/* White Panel */}
        <div className="bg-white h-full p-4  rounded-t-3xl shadow-lg">
          {/* Find Trip Section - Now with border */}
          <div className="border-2 border-gray-200 rounded-xl p-4 mb-4 shadow-sm bg-white">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-600 text-2xl">🚗</span>
              Find a Trip
            </h4>
            <form onSubmit={submitHandler}>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
                    <i className="ri-map-pin-fill text-lg"></i>
                  </div>
                  <input 
                    value={pickup}
                    onChange={(e) => handleInputChange(e, "Pickup")}
                    onFocus={() => {
                      handleInputFocus();
                      setActive("Pickup");
                    }}
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Add Pickup Location" 
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600">
                    <i className="ri-map-pin-fill text-lg"></i>
                  </div>
                  <input
                    value={dropoff}
                    onChange={(e) => handleInputChange(e, "Dropoff")}
                    onFocus={() => {
                      handleInputFocus();
                      setActive("Dropoff");
                    }}
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Add Destination" 
                  />
                </div>
              </div>
            </form>
          </div>
          
          {/* Location Panel */}
          {isPanelExpanded && (
            <div className="location-panel bg-white flex-grow rounded-lg">
              <LocationSearchPanel 
                suggestions={suggestions} 
                onLocationSelect={handleLocationSelect}
              />
            </div>
          )}
        </div>
        
        {/* Rides Panel - Only visible when a location is selected */}
        <div 
          ref={ridesPanelRef}
          className={`fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ${
            isRidesPanelVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <RidesPanel
            fare={fare}
            createRide={createRide} 
            isVisible={isRidesPanelVisible} 
            onOutsideClick={() => setIsRidesPanelVisible(false)}
            onBookRide={handleBookRide}
          />
        </div>
        
        {/* Looking For Driver Panel */}
        <div 
          ref={driverPanelRef}
          className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
            isLookingForDriverVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <LookingForDriver 
            isVisible={isLookingForDriverVisible}
            onCancelRide={handleCancelRide}
            selectedRide={selectedRide}
            pickup={pickup}
            dropoff={dropoff}
            fare={fare}
            onDriverFound={handleDriverFound}
          />
        </div>

        {/* Waiting For Driver Panel */}
        <div 
          ref={waitingPanelRef}
          className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
            isWaitingForDriverVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <WaitingForDriver 
            isVisible={isWaitingForDriverVisible}
            acceptedRide={acceptedRide}
            driverDetails={driverDetails}
            pickup={pickup}
            dropoff={dropoff}
            onClose={handleCancelRide}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;