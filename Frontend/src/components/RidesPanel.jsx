import React, { useState } from "react";
import 'remixicon/fonts/remixicon.css';

const RidesPanel = ({ isVisible, onOutsideClick, onBookRide, fare, createRide }) => {
    const [selectedRideIndex, setSelectedRideIndex] = useState(null);

    // If panel is not visible, don't render anything
    if (!isVisible) return null;
    console.log("Rides Panel");

    const rides = [
        {
            name: "CabzyGo",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1548646935/assets/64/93c255-87c8-4e2e-9429-cf709bf1b838/original/3.png",
            capacity: 4,
            time: "2 min away",
            description: "Affordable, Compact Ride",
            price: "₹193",
            color: "blue",
            icon: "🚗"
        },
        {
            name: "Cabzy Moto",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
            capacity: 1,
            time: "5 min away",
            description: "Dhoom Machale ..!!🔥",
            price: "₹93",
            color: "green",
            icon: "🏍️"
        },
        {
            name: "Cabzy Auto",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
            capacity: 3,
            time: "5 min away",
            description: "Three Wheeled Chariot",
            price: "₹130",
            color: "purple",
            icon: "🛺"
        }
    ];

    const handleRideSelect = (index) => {
        setSelectedRideIndex(index);
    };

    const handleBookRide = () => {
        if (selectedRideIndex !== null && onBookRide) {
            onBookRide(rides[selectedRideIndex]);
        }
    };

    const getColorClasses = (color, isSelected) => {
        const colorMap = {
            blue: {
                bg: isSelected ? 'bg-blue-50' : 'bg-blue-25',
                border: isSelected ? 'border-blue-500' : 'border-blue-200',
                hover: 'hover:bg-blue-50 hover:border-blue-300',
                text: 'text-blue-600',
                icon: 'text-blue-600'
            },
            green: {
                bg: isSelected ? 'bg-green-50' : 'bg-green-25',
                border: isSelected ? 'border-green-500' : 'border-green-200',
                hover: 'hover:bg-green-50 hover:border-green-300',
                text: 'text-green-600',
                icon: 'text-green-600'
            },
            purple: {
                bg: isSelected ? 'bg-purple-50' : 'bg-purple-25',
                border: isSelected ? 'border-purple-500' : 'border-purple-200',
                hover: 'hover:bg-purple-50 hover:border-purple-300',
                text: 'text-purple-600',
                icon: 'text-purple-600'
            }
        };
        return colorMap[color];
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-t-3xl shadow-2xl p-6 animate-slide-up">
            {/* Header Section with colored background */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚖</span>
                        <h3 className="font-semibold text-xl text-gray-800">Choose Your Ride</h3>
                    </div>
                    <div 
                        className="bg-white p-2 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all"
                        onClick={onOutsideClick}
                    >
                        <i className="ri-close-line text-lg text-gray-600"></i>
                    </div>
                </div>
            </div>
            
            {/* Rides Grid */}
            <div className="space-y-4">
                {rides.map((ride, index) => {
                    const isSelected = selectedRideIndex === index;
                    const colors = getColorClasses(ride.color, isSelected);
                    
                    return (
                        <div 
                            key={index}
                            className={`flex w-full border-2 rounded-xl p-2 items-center justify-between cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                                isSelected 
                                    ? `${colors.border} ${colors.bg}` 
                                    : `border-gray-200 hover:border-gray-300 hover:bg-gray-50`
                            }`}
                            onClick={() => handleRideSelect(index)}
                        >
                            {/* Vehicle Image and Icon */}
                            <div className="flex items-center gap-1">
                                
                                <img className="h-14 w-20 object-contain" src={ride.image} alt={`${ride.name} logo`} />
                            </div>
                            
                            {/* Ride Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-base text-gray-800">{ride.name}</h4>
                                    <div className="flex items-center gap-1 bg-gray-100 px-1 py-1 rounded-full">
                                        <i className="ri-user-fill text-xs text-gray-600"></i>
                                        <span className="text-xs text-gray-600">{ride.capacity}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-xs">⏱️</span>
                                    <p className="font-medium text-sm text-green-600">{ride.time}</p>
                                </div>
                                <p className="font-normal text-xs text-gray-500 leading-relaxed">{ride.description}</p>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                                <h2 className={`font-bold text-base ${isSelected ? colors.text : 'text-gray-800'}`}>
                                    ₹{fare[
                                        ride.name === "CabzyGo"
                                        ? "car"
                                        : ride.name === "Cabzy Moto"
                                        ? "bike"
                                        : "auto"
                                    ]}
                                </h2>
                                {isSelected && (
                                    <div className="flex items-center justify-end mt-1">
                                        <i className="ri-check-line text-sm text-green-600"></i>
                                        <span className="text-xs text-green-600 ml-1">Selected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Book Button - Enhanced when ride is selected */}
            {selectedRideIndex !== null && (
                <div className="mt-6 border-t-2 border-gray-100 pt-4">
                    <button 
                        className="bg-gradient-to-r from-black to-gray-800 text-white w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={() => {
                            handleBookRide();
                            createRide(rides[selectedRideIndex].name === "CabzyGo"
                                ? "car"
                                : rides[selectedRideIndex].name === "Cabzy Moto"
                                ? "bike"
                                : "auto"
                            );
                        }}
                    >
                        <span className="text-xl">{rides[selectedRideIndex].icon}</span>
                        Book {rides[selectedRideIndex].name}
                        <i className="ri-arrow-right-line"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RidesPanel;