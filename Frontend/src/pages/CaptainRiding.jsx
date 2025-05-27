import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import mp from "../assets/images/map.jpg";
import 'remixicon/fonts/remixicon.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import PaymentComplete from "../components/PaymentComplete";

const CaptainRiding = ({ confirmedRide, pickup, dropoff, onCompleteRide }) => {
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);
  const { socket } = React.useContext(SocketContext);
  
  const userInfo = {
    name: "Sarah Johnson",
    rating: 4.7,
    phone: "+91 98765 43210",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    otp: "2847"
  };

  const tripDetails = {
    distance: "3.8 km",
    duration: "15 mins",
    fare: "₹145",
    rideType: "UberGo",
    paymentMethod: "Cash"
  };

  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride || {};

  async function onCompleteRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ride/end-ride`,
        {
          rideId: rideData.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Ride completed successfully:", response.data);
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Error completing ride:", error.response?.data || error.message);
      alert(error.response?.data?.error || "An error occurred while completing the ride.");
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("paymentComplete", () => {
        setShowPaymentComplete(true);
      });
    }
    return () => {
      if (socket) {
        socket.off("paymentComplete");
      }
    };
  }, [socket]);

  return (
    <div className="relative h-screen flex flex-col">
      <PaymentComplete 
        isVisible={showPaymentComplete} 
        onClose={() => setShowPaymentComplete(false)} 
      />
      
      <Link to="/captain-home" className="fixed right-2 top-2 z-10 h-10 w-10 bg-white rounded-full flex justify-center items-center shadow-md">
        <i className="ri-home-5-line"></i>
      </Link>
      
      <div className="h-2/5">
        <img className="h-full w-full object-cover" src={mp} alt="map_image" />
      </div>
      
      <div className="flex-1">
        <div className="bg-white rounded-t-3xl shadow-lg p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Your Ride is in Progress</h3>
            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
              On the way
            </div>
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-3 mb-4">
            <div className="relative">
              <img 
                className="h-14 w-14 rounded-full object-cover" 
                src={userInfo.image} 
                alt="Driver" 
              />
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full"></div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-base">{rideData?.data?.user?.fullname?.firstname} {rideData?.data?.user?.fullname?.lastname}</h4>
                <div className="flex items-center">
                  <i className="ri-star-fill text-yellow-500 mr-1"></i>
                  <span className="text-sm font-medium">{userInfo.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{tripDetails.rideType}</p>
              <div className="mt-1 flex items-center text-blue-600">
                <i className="ri-time-line mr-1"></i>
                <span className="text-sm">Trip in progress</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex items-start">
              <div className="text-blue-500 text-xl mt-1 mr-3">
                <i className="ri-map-pin-fill"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">PICKUP</p>
                <p className="text-sm font-medium">{rideData?.data?.origin || "Loading..."}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-blue-500 text-xl mt-1 mr-3">
                <i className="ri-map-pin-line"></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">DROPOFF</p>
                <p className="text-sm font-medium">{rideData?.data?.destination || "Loading..."}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onCompleteRide}
            className="w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            <i className="ri-checkbox-circle-line mr-2"></i>
            Complete Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;