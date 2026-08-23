const express = require("express");

const {
  getMyOrders,
  getMyOrderById,
} = require("../controllers/order.controller");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getMyOrderById);

module.exports = router;