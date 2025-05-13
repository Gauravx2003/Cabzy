import React from "react";
import { useState } from "react";
import 'remixicon/fonts/remixicon.css';

const LocationSearchPanel = ({ onLocationSelect }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const locations = [
        "B-403, Ratnam Lifestyle, Ankhol, Waghodia, Gujarat -390019.",
        "C-401, Shrrji Park, Akota, Vadodara, Gujarat -390029.",
        "B-403, Amardeep Homes, Ajwa, Vadodara, Gujarat -390348."
    ];

    const handleLocationSelect = (location, index) => {
        setSelectedIndex(index);
        if (onLocationSelect) {
            onLocationSelect(location);
        }
    };

    return (
        <div className="py-3">
            <h3 className="text-lg font-semibold mb-3">Saved Locations</h3>
            {locations.map((location, index) => (
                <div 
                    key={index}
                    className={`flex gap-3 p-4 mb-2 cursor-pointer hover:bg-gray-50 rounded-xl justify-start items-center transition-all ${
                        selectedIndex === index ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
                    }`}
                    onClick={() => handleLocationSelect(location, index)}
                >
                    <div className="text-blue-500 text-xl">
                        <i className="ri-map-pin-fill"></i>
                    </div>
                    <div className="text-sm">{location}</div>
                </div>
            ))}
        </div>
    );
};

export default LocationSearchPanel;