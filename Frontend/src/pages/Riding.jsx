import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mp from "../assets/images/map.jpg";
import 'remixicon/fonts/remixicon.css';
import { useContext, useEffect } from "react";
import {SocketContext} from "../context/SocketContext";
import axios from "axios";
import LiveDistanceOverlay from "../components/LiveDistanceOverlay";

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
  const [LiveDistance, setLiveDistance] = React.useState({});
  const destinationRef = React.useRef({});
  const [destinationCoord, setDestinationCoord] = React.useState({});

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

  async function LiveUpdationUser() {
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
              `${import.meta.env.VITE_BACKEND_URL}/maps/live-location-user`,
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

   useEffect(() => {
    const interval = setInterval(() => {
      LiveUpdationUser(); // Call your function every 2 seconds
    }, 10000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means run only once after mount

  useEffect(() => {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/maps/get-coordinates`,
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

  console.log(rideData);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50">
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center">
          <div className="bg-blue-500 h-3 w-3 rounded-full mr-3"></div>
          <span className="font-semibold text-gray-800">Ride in Progress</span>
        </div>
        
        <Link to="/home" className="h-12 w-12 bg-white rounded-full flex justify-center items-center shadow-lg">
          <i className="ri-home-5-line text-xl text-gray-600"></i>
        </Link>
      </div>
      
       <LiveDistanceOverlay
        LiveDistance={LiveDistance}
      />

      
      
      {/* Trip Details Section */}
      <div className="h-1/2 bg-white rounded-t-3xl shadow-lg">
        <div className="p-6">
          {/* Status Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-800">Your Ride is in Progress</h3>
            
          </div>

          {/* Driver Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="bg-gray-200 h-14 w-14 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-base">{rideData?.data?.captain?.fullname.firstname} {rideData?.data?.captain?.fullname.lastname}</h4>
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-500 mr-1"></i>
                    <span className="text-sm font-medium">{driverInfo.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rideData?.data?.captain?.vehicle.vehicleType} • {rideData?.data?.captain?.vehicle.plate}</p>
                
              </div>
            </div>
          </div>

          {/* Ride Details */}
          {selectedRide && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-2 mr-4">
                  <img 
                    className="h-8 w-12 object-contain" 
                    src={selectedRide.image} 
                    alt={`${selectedRide.name} logo`} 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm flex items-center">
                    {selectedRide.name} 
                    <span className="ml-2 text-gray-600">
                      <i className="ri-user-fill mr-1"></i>{selectedRide.capacity}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-600">{selectedRide.description}</p>
                </div>
                <h2 className="font-bold text-lg text-green-600">{selectedRide.price}</h2>
              </div>
            </div>
          )}

          {/* Route Details */}
          <div className="space-y-4 mb-3">
            

            <div className="flex items-center">
              <span className="mr-4 text-red-600 text-xl">🔴</span>
              <div className="-mt-3">
                <p className="text-xs text-gray-500 font-medium">DROP-OFF LOCATION</p>
                <p className="text-sm font-medium">{rideData?.data?.destination || "Loading..."}</p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button 
            onClick={handlePayment}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors"
          >
            <i className="ri-secure-payment-line mr-3 text-xl"></i>
            Pay ₹{rideData.data?.fare || "0"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;