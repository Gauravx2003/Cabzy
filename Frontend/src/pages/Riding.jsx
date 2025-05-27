import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mp from "../assets/images/map.jpg";
import 'remixicon/fonts/remixicon.css';
import { useContext, useEffect } from "react";
import {SocketContext} from "../context/SocketContext";
import axios from "axios";

const Riding = ({ selectedRide, pickup, dropoff }) => {
  const driverInfo = {
    name: "Captain Alex",
    rating: 4.8,
    vehicle: "Honda Activa",
    vehicleNumber: "DL 5S AB 1234",
    eta: "5 mins",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const location = useLocation();
  const rideData = location.state?.ride || {};
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/create-order`,
        { rideId: rideData.data._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Cabzy",
        description: "Ride Payment",
        order_id: response.data.orderId,
        handler: async (response) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/verify`,
              {
                rideId: rideData.data._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            );
            
            // Emit payment completion event to captain
            socket.emit("paymentComplete", {
              rideId: rideData.data._id,
              captainId: rideData.data.captain._id
            });
            
            alert("Payment successful!");
            navigate("/home");
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : "",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert("Error creating payment order");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("rideEnded", (data) => {
        console.log("Ride completed:", data);
        navigate("/home");
      });
    }

    return () => {
      if (socket) {
        socket.off("rideEnded");
      }
    };  
  }, [socket, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <Link to="/home" className="fixed right-2 top-2 z-10 h-10 w-10 bg-white rounded-full flex justify-center items-center shadow-md">
        <i className="ri-home-5-line"></i>
      </Link>
      
      <div className="h-1/2">
        <img className="h-full w-full object-cover" src={mp} alt="map_image" />
      </div>
      
      <div className="h-1/2">
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
                src={driverInfo.image} 
                alt="Driver" 
              />
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full"></div>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-base">{driverInfo.name}</h4>
                <div className="flex items-center">
                  <i className="ri-star-fill text-yellow-500 mr-1"></i>
                  <span className="text-sm font-medium">{driverInfo.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{driverInfo.vehicle} • {driverInfo.vehicleNumber}</p>
              <div className="mt-1 flex items-center text-blue-600">
                <i className="ri-time-line mr-1"></i>
                <span className="text-sm">Arriving in {driverInfo.eta}</span>
              </div>
            </div>
          </div>

          {selectedRide && (
            <div className="flex items-center border border-gray-200 rounded-xl p-3 mb-4">
              <img 
                className="h-12 w-16 object-contain" 
                src={selectedRide.image} 
                alt={`${selectedRide.name} logo`} 
              />
              <div className="ml-3">
                <h4 className="font-medium text-sm">
                  {selectedRide.name} <span className="ml-1"><i className="ri-user-fill"></i>{selectedRide.capacity}</span>
                </h4>
                <p className="font-normal text-xs text-gray-500">{selectedRide.description}</p>
              </div>
              <h2 className="font-semibold ml-auto">{selectedRide.price}</h2>
            </div>
          )}

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

          <div className="flex top-5">
            <button 
              onClick={handlePayment}
              className="bg-black text-white w-full py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Pay ₹{rideData.data?.fare || "0"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;