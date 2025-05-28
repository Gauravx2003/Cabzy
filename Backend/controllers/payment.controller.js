const paymentService = require('../services/payment.service');
const rideModel = require('../db/models/ride.model');

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

    await rideModel.findByIdAndUpdate(rideId, {
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};