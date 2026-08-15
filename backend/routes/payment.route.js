const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/payment.controller");

const protect  = require("../middlewares/authMiddleware");



router.post(
  "/razorpay/order",
  protect,
  createRazorpayOrder
);

router.post(
  "/razorpay/verify",
  protect,
  verifyRazorpayPayment
);

module.exports = router;