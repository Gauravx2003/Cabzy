const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

const verifyPayment = (razorpayOrderId, razorpayPaymentId, signature) => {
  const crypto = require('crypto');
  const text = razorpayOrderId + "|" + razorpayPaymentId;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");
  
  return generated_signature === signature;
};

module.exports = {
  createOrder,
  verifyPayment
};