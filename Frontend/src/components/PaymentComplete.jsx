import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'remixicon/fonts/remixicon.css';

const PaymentComplete = ({ isVisible, onClose, onCompleteRide }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      // Delay the checkmark animation slightly for better effect
      const timer = setTimeout(() => {
        setShowCheckmark(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setShowCheckmark(false);
    }
  }, [isVisible]);

  const handleMoveToDeck = () => {
    onCompleteRide();
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full transform animate-scale-in">
        {/* Success Icon with Animation */}
        <div className="flex justify-center mb-6">
          <div className={`relative transition-all duration-700 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="bg-green-500 rounded-full p-4 shadow-lg animate-pulse-green">
              <svg 
                className="w-16 h-16 text-white animate-check-draw" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  className={showCheckmark ? 'animate-draw-check' : ''}
                />
              </svg>
            </div>
            
            {/* Animated circles around the checkmark */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-green-300 animate-ping" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in-up">
            Payment Completed!
          </h2>
          <p className="text-gray-600 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            The payment has been successfully processed. Your ride earnings have been updated.
          </p>
        </div>

        {/* Success Stats */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-green-600 text-xl mb-1">
                <i className="ri-money-rupee-circle-fill"></i>
              </div>
              <p className="text-xs text-gray-600">Payment</p>
              <p className="font-semibold text-green-600">Received</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 text-xl mb-1">
                <i className="ri-shield-check-fill"></i>
              </div>
              <p className="text-xs text-gray-600">Transaction</p>
              <p className="font-semibold text-green-600">Secured</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleMoveToDeck}
          className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:bg-gray-800 active:scale-95 animate-fade-in-up shadow-lg"
          style={{animationDelay: '0.6s'}}
        >
          <i className="ri-home-4-line mr-2"></i>
          Move to Deck
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw-check {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-draw-check {
          stroke-dasharray: 100;
          animation: draw-check 1s ease-in-out forwards;
        }

        .animate-pulse-green {
          animation: pulse-green 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentComplete;