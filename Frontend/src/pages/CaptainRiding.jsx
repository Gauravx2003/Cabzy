import React,{useEffect, useRef, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
//import { useRef } from "react";
import mp from "../assets/images/map.jpg"; // Map image placeholder
import 'remixicon/fonts/remixicon.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {CaptainDataContext} from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import PaymentComplete from "../components/PaymentComplete"; // Import the PaymentComplete component
import LiveDistanceOverlay from "../components/LiveDistanceOverlay";
// Set default Axios settings
axios.defaults.withCredentials = true;

const CaptainRiding = ({ confirmedRide, pickup, dropoff, onCompleteRide }) => {
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);
  
  
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

  const [destinationCoord, setDestinationCoord] = React.useState({});
  const destinationRef = React.useRef({});
  const [LiveDistance, setLiveDistance] = React.useState({});
  const [isPaymentCompleteVisible, setIsPaymentCompleteVisible] = React.useState(false); // State for payment complete popup


  const location = useLocation();
  const navigate = useNavigate();
  const rideData= location.state?.ride || {};
  const distanceData=location.state?.distance || {};

  const { socket } = useContext(SocketContext); // Fetch Socket from Context 
  //const {captain} = useContext(CaptainDataContext);

  console.log("Ride Data:", rideData);
  console.log("Distance Data:", distanceData);

  async function onCompleteRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ride/end-ride`,
        {
          rideId: rideData.data._id,
          fare: rideData.data.fare,
          distance: parseFloat(distanceData.distanceAndTime.distance),
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
      alert(error.response.data.error);
    }
  }

  async function LiveUpdation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const pos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // console.log("Current position:", pos);
        // console.log("Destination coordinates:", destinationRef.current);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/maps/live-location`,
            {
              origin: pos,
              destination: destinationRef.current, // ✅ use ref, not state
              
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          
          if (response.status === 200) {
            console.log("Live Distance and Time:", response.data);
            setLiveDistance(response.data.distanceAndTime);
            // Optionally update state here
          } else {
            console.error("Error fetching distance and time:", response.data);
          }
        } catch (err) {
          console.error("Error in live location update:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser");
  }
}

 // Handler to close payment complete popup
  const handleClosePaymentComplete = () => {
    setIsPaymentCompleteVisible(false);
  };


  useEffect(() => {
  const interval = setInterval(() => {
    LiveUpdation(); // Call your function every 2 seconds
  }, 10000);

  return () => clearInterval(interval); // Cleanup on unmount
}, []); // Empty dependency array means run only once after mount
  
useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/maps/get-coordinates-cap`,
        {
          params: { address: rideData?.data?.destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        //console.log("Destination coordinates:", response.data.coordinates);
        setDestinationCoord(response.data.coordinates);
        destinationRef.current = response.data.coordinates; // ✅ sync to ref
      })
      .catch((error) => {
        console.error("Error fetching destination coordinates:", error);
      });
  }, [rideData.data.destination]);


useEffect(() => {
if(socket){
  socket.on("paymentComplete", (data) => {
     setIsPaymentCompleteVisible(true);
  });
}
return () => {
      if(socket) {
        socket.off("paymentComplete");
      }
    };
},[]);


  

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center">
          <div className="bg-green-500 h-3 w-3 rounded-full mr-3"></div>
          <span className="font-semibold text-gray-800">Trip in Progress</span>
        </div>
        
        <Link to="/captain-home" className="h-12 w-12 bg-white rounded-full flex justify-center items-center shadow-lg">
          <i className="ri-close-line text-xl text-gray-600"></i>
        </Link>
      </div>

      <LiveDistanceOverlay
        LiveDistance={LiveDistance}
      />
      
      {/* Trip Details Section */}
      <div className="h-1/2 bg-white rounded-t-3xl shadow-lg">
        <div className="p-4">
          {/* Passenger Info */}
          <div className="bg-gray-50 rounded-xl p-2 mb-4">
            {/* <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">Passenger Details</h3>
              
            </div> */}
            
            <div className="flex items-center">
              <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base">{rideData?.data?.user?.fullname?.firstname} {rideData?.data?.user?.fullname?.lastname}</h4>
                <p className="text-gray-600 text-sm">Passenger</p>
              </div>
            </div>
          </div>

          {/* Trip Summary Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-blue-600 text-2xl mb-2">📍</span>
              <p className="text-xs text-gray-500 font-medium">DISTANCE</p>
              <p className="font-bold text-sm">{distanceData.distanceAndTime?.distance}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-green-600 text-2xl mb-2">⏱️</span>
              <p className="text-xs text-gray-500 font-medium">DURATION</p>
              <p className="font-bold text-sm">{distanceData.distanceAndTime?.duration}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-2 flex flex-col items-center justify-center">
              <span className="text-purple-600 text-2xl mb-2">💰</span>
              <p className="text-xs text-gray-500 font-medium">FARE</p>
              <p className="font-bold text-sm text-green-600">₹{rideData.data?.fare}</p>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4 mb-6">
           

            <div className="flex items-center">
              <span className="mr-4 text-red-600 text-xl">🔴</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">DROP-OFF LOCATION</p>
                <p className="text-sm font-medium">{rideData.data?.destination}</p>
              </div>
            </div>
          </div>

          {/* Complete Ride Button */}
          <button 
            onClick={onCompleteRide}
            className="w-full bg-green-500 text-white py-3 -mt-2 rounded-xl font-semibold text-lg flex items-center justify-center shadow-md hover:bg-green-600 transition-colors"
          >
            <i className="ri-checkbox-circle-line mr-3 text-xl"></i>
            Complete Ride
          </button>
        </div>
      </div>

      {/* Payment Complete Popup */}
      <PaymentComplete 
        isVisible={isPaymentCompleteVisible}
        onClose={handleClosePaymentComplete}
        onCompleteRide={onCompleteRide}
      />
    </div>
  );
};

export default CaptainRiding;