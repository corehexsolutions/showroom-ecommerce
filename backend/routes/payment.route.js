const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createBuyNowOrder
} = require("../controllers/payment.controller");

const protect  = require("../middlewares/authMiddleware");



router.post(
  "/razorpay/create-order",
  protect,
  createRazorpayOrder
);

router.post(
  "/razorpay/buy-now",
  protect,
  createBuyNowOrder
);

router.post(
  "/razorpay/verify",
  protect,
  verifyRazorpayPayment
);

module.exports = router;