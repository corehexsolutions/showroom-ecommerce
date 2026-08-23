const express = require("express");

const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/adminOrder.controller");

const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/admin.middleware");

const router = express.Router();

router.use(protect, admin);

router.get("/", getAllOrders);

router.get("/:id", getAdminOrderById);

router.patch("/:id/status", updateOrderStatus);

router.patch("/:id/payment-status", updatePaymentStatus);

module.exports = router;