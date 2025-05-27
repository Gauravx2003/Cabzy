import React, { useEffect } from 'react';

const PaymentComplete = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="bg-white rounded-2xl p-8 relative z-10 transform transition-all duration-300 animate-bounce-in">
        <div className="flex flex-col items-center">
          {/* Success Circle Animation */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
              <span className="text-white text-3xl">✓</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Received!</h3>
          <p className="text-gray-600 text-center">
            The customer has completed the payment successfully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;