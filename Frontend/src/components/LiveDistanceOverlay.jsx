import React, { useState, useEffect } from "react";
import mp from "../assets/images/map.jpg"; // Map image placeholder
import 'remixicon/fonts/remixicon.css';
import axios from "axios";

const LiveDistanceOverlay =({LiveDistance})=>{
    return(
        <>
        {/* Map Section */}
              <div className="h-1/2 relative">
                <img className="h-full w-full object-cover" src={mp} alt="map_image" />
                
                {/* Live Distance Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white rounded-xl shadow-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-50 rounded-full p-2 mr-3">
                          <i className="ri-navigation-line text-blue-500 text-lg"></i>
                        </div>
                        <div>
                          <span className="font-semibold text-lg">{ LiveDistance?.distance || "Calculating..."}</span>
                          <p className="text-gray-500 text-sm">{ LiveDistance?.duration || "ETA calculating..."}</p>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:bg-blue-600 transition-colors">
                        Navigate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
        </>
    );
};

export default LiveDistanceOverlay;