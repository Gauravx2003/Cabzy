const paymentService = require('../services/payments.service');
const rideModel = require('../db/models/ride.model');
const captainModel = require('../db/models/captain.model'); // Import the captain model
const {sendMessageToSocketId} = require('../socket');

module.exports.createPaymentOrder = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const order = await paymentService.createOrder(ride.fare);
    
    await rideModel.findByIdAndUpdate(rideId, {
      orderId: order.id
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { rideId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    
    const isValid = paymentService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const ride = await rideModel.findByIdAndUpdate(rideId, {
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    }).populate('captain');

  
   console.log("Sending to: ", ride.captain._id);
   sendMessageToSocketId(ride.captain._id.toString(), "paymentComplete", {
            type: "paymentComplete",
            data: ride,
    }); // Send a message to the user's socket ID

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};