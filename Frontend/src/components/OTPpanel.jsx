import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const OTPpanel = ({ onVerify, ride }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
    
  };

  

  const handleVerify = async () => {
    // You can add validation logic here if needed
    //console.log("DATA is: ",ride);

    console.log("otp id is : ", otp);

    try{
    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ride/start-ride`, 
      {
        rideId: ride.data._id,
        otp: otp,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    
      if(response.status === 200) {
        console.log("OTP verified successfully:", response.data);
        //alert("OTP verified successfully");
        navigate("/captain-riding", {state: {ride: ride}});
      }
      // Handle successful OTP verification
    
   } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      alert(error.response?.data?.error || "An error occurred while verifying OTP.");
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="otp-panel my-4">
      <h3 className="font-semibold text-lg mb-2">OTP Verification</h3>
      <p className="text-gray-600 text-sm mb-4">
        Please enter the OTP shared by the passenger.
      </p>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          maxLength={6}
        />
        <button
          onClick={handleVerify}
          className="bg-green-500 text-white py-3 rounded-lg font-medium shadow-md"
        >
          Good To Go
        </button>
      </div>
    </div>
  );
};

export default OTPpanel;