import React from "react";
import 'remixicon/fonts/remixicon.css';

const LocationSearchPanel = ({ suggestions, onLocationSelect }) => {
  return (
    <div className="py-4">
      {suggestions.length > 0 ? (
        <>
          <div className="bg-blue-50 rounded-xl p-3 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <span className="text-blue-600 text-xl">🔍</span>
              Suggested Locations
            </h3>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((location, index) => (
              <div 
                key={index}
                className="flex gap-4 p-4 cursor-pointer hover:bg-blue-50 rounded-xl justify-start items-center transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200"
                onClick={() => onLocationSelect(location)}
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <i className="ri-map-pin-fill text-blue-600 text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {location}
                  </p>
                </div>
                <div className="text-gray-400">
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-gray-400 text-4xl mb-3">📍</div>
            <p className="text-gray-500 font-medium">Start typing to search locations</p>
            <p className="text-gray-400 text-sm mt-1">We'll help you find the perfect spot</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;