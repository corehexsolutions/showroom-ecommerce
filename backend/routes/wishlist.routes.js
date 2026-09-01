const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlist.controller");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get logged-in user's wishlist
router.get("/", protect, getWishlist);

// Check if a particular product is wishlisted
router.get("/:productId", protect, checkWishlist);

// Add product to wishlist
router.post("/:productId", protect, addToWishlist);

// Remove product from wishlist
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;