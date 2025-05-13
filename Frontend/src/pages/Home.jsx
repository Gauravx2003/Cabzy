import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Cabzy_logo.png";
import mp from "../assets/images/map.jpg";
import { MdLocationPin } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import LocationSearchPanel from "../components/LocationSearchPanel";
import RidesPanel from "../components/RidesPanel";
import LookingForDriver from "../components/LookingForDriver";
import 'remixicon/fonts/remixicon.css';

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isRidesPanelVisible, setIsRidesPanelVisible] = useState(false);
  const [isLookingForDriverVisible, setIsLookingForDriverVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [active, setActive] = useState("");
  
  const ridesPanelRef = useRef(null);
  const driverPanelRef = useRef(null);
  
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleInputFocus = () => {
    setIsPanelExpanded(true);
    setIsRidesPanelVisible(false);
    setIsLookingForDriverVisible(false);
    console.log(active);
  };

  const handleCollapsePanel = () => {
    setIsPanelExpanded(false);
  };

  const handleLocationSelect = (location) => {
    // Update either pickup or dropoff based on which was last focused
    console.log("active::", active);
    if (active === "Dropoff") {
      setDropoff(location);
    } else {
      setPickup(location);
    }
    
    // Show rides panel
    setIsRidesPanelVisible(true);
    // Keep location panel open
    setIsPanelExpanded(true);
  };

  const handleBookRide = (ride) => {
    setSelectedRide(ride);
    setIsRidesPanelVisible(false);
    setIsLookingForDriverVisible(true);
  };

  const handleCancelRide = () => {
    setIsLookingForDriverVisible(false);
    setIsRidesPanelVisible(true);
  };

  const handleClickOutside = (event) => {
    // Close rides panel when clicking outside
    if (ridesPanelRef.current && !ridesPanelRef.current.contains(event.target) && 
        !event.target.closest('.location-panel')) {
      setIsRidesPanelVisible(false);
    }
    
    // We don't want to close the driver panel when clicking outside
    // as it's an active process
  };

  useEffect(() => {
    // Add click event listener to detect clicks outside the rides panel
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map Background */}
      <div className="h-full w-full">
        {/* Logo */}
        <div className="bg-white rounded-full p-3 left-2 top-2 shadow-lg absolute z-10">
          <img className="w-16 h-16 object-contain rounded" src={logo} alt="logo" />
        </div>
        <img className="h-full w-full object-cover" src={mp} alt="map_image" />
      </div>
      
      {/* Panel Container */}
      <div 
        className={`absolute w-full h-full transition-all duration-400 ease-in-out ${
          isPanelExpanded ? "bottom-0" : "bottom-[-70%]"
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
        <div className="bg-white h-full p-4 rounded-t-3xl shadow-lg">
          <h4 className="text-xl font-semibold mb-4">Find a Trip</h4>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col space-y-4">
              <input 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={()=>{
                    handleInputFocus();
                    setActive("Pickup");
                }}
                type="text" 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="📍Add Pickup" 
              />
              <input
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                onFocus={()=>{
                    handleInputFocus();
                    setActive("Dropoff");
                }}
                type="text" 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="📍Add Dropoff" 
              />
            </div>
          </form>
          
          {/* Location Panel */}
          {isPanelExpanded && (
            <div className="location-panel bg-white mt-4 flex-grow rounded-lg">
              <LocationSearchPanel onLocationSelect={handleLocationSelect} />
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
          />
        </div>
      </div>
    </div>
  );
};

export default Home;