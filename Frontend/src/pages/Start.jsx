import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/images/Cabzy_bg.png";
import logo from "../assets/images/Cabzy_logo.png";

const Start = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${bg})`,
          filter: "brightness(0.8)",
        }}
      />
      
      {/* Content container */}
      <div className="relative h-full flex flex-col justify-between z-10">
        {/* Header with logo */}
        <header className="p-3 flex items-center">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <img className="w-16 h-16 object-contain" src={logo} alt="Cabzy logo" />
          </div>
          
        </header>

       
        
        {/* Bottom card */}
        <div className="w-full">
          <div className="bg-white rounded-t-3xl shadow-lg px-8 py-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Started With Cabzy</h2>
            <p className="text-gray-600 mb-6">Book your first ride and experience the difference</p>
            <Link 
              to="/login" 
              className="flex items-center justify-center w-full bg-black text-white py-4 rounded-lg font-medium text-lg transition-transform hover:transform hover:scale-105"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;