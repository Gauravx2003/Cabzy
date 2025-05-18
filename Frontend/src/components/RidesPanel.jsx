import React, { useState } from "react";
import 'remixicon/fonts/remixicon.css';

const RidesPanel = ({ isVisible, onOutsideClick, onBookRide, fare, createRide }) => {
    const [selectedRideIndex, setSelectedRideIndex] = useState(null);

    // If panel is not visible, don't render anything
    if (!isVisible) return null;

    const rides = [
        {
            name: "CabzyGo",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1548646935/assets/64/93c255-87c8-4e2e-9429-cf709bf1b838/original/3.png",
            capacity: 4,
            time: "2 min away",
            description: "Affordable, Compact Ride",
            price: "₹193"
        },
        {
            name: "Cabzy Moto",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
            capacity: 1,
            time: "5 min away",
            description: "Slice through traffic with affordable bike rides.",
            price: "₹93"
        },
        {
            name: "Cabzy Auto",
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
            capacity: 3,
            time: "5 min away",
            description: "Reach there with affordable and comfortable auto rides",
            price: "₹130"
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

    return (
        <div className="bg-white rounded-t-3xl shadow-lg p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Choose Ride</h3>
                <div 
                    className="bg-gray-100 p-1 rounded-full cursor-pointer"
                    onClick={onOutsideClick}
                >
                    <i className="ri-close-line text-lg"></i>
                </div>
            </div>
            
            <div className="space-y-3">
                {rides.map((ride, index) => (
                    <div 
                        key={index}
                        className={`flex w-full border rounded-xl p-3 items-center justify-between cursor-pointer transition-all ${
                            selectedRideIndex === index 
                                ? 'border-2 border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRideSelect(index)}
                    >
                        <img className="h-12 w-16 object-contain" src={ride.image} alt={`${ride.name} logo`} />
                        <div className="w-1/2">
                            <h4 className="font-medium text-sm">
                                {ride.name} <span className="ml-1"><i className="ri-user-fill"></i>{ride.capacity}</span>
                            </h4>
                            <h5 className="font-medium text-sm text-gray-600">{ride.time}</h5>
                            <p className="font-normal text-xs text-gray-500">{ride.description}</p>
                        </div>
                        <h2 className="font-semibold">
                        ₹{fare[
                              ride.name === "CabzyGo"
                              ? "car"
                              : ride.name === "Cabzy Moto"
                              ? "bike"
                              : "auto"
                            ]}
                        </h2>
                    </div>
                ))}
            </div>
            
            {selectedRideIndex !== null && (
                <div className="mt-4">
                    <button 
                        className="bg-black text-white w-full py-3 rounded-lg font-medium"
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
                        Book {rides[selectedRideIndex].name}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RidesPanel;