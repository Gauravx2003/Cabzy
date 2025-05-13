import React, { useState } from "react";

const OTPpanel = ({ onVerify }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    // You can add validation logic here if needed
    onVerify();
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