import React from "react";
import 'remixicon/fonts/remixicon.css';

const LocationSearchPanel = ({ suggestions, onLocationSelect }) => {
  return (
    <div className="py-3">
      {suggestions.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold mb-3">You Mean ?</h3>
          {suggestions.map((location, index) => (
            <div 
              key={index}
              className="flex gap-3 p-4 mb-2 cursor-pointer hover:bg-gray-50 rounded-xl justify-start items-center transition-all border border-gray-200"
              onClick={() => onLocationSelect(location)}
            >
              <div className="text-blue-500 text-xl">
                <i className="ri-map-pin-fill"></i>
              </div>
              <div className="text-sm">{location}</div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center text-gray-500 py-4">
          
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;