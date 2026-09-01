const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

// --------------------------------------------------
// GET USER WISHLIST
// GET /api/wishlist
// --------------------------------------------------
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: [],
      });
    }

    return res.status(200).json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

// --------------------------------------------------
// ADD PRODUCT TO WISHLIST
// POST /api/wishlist/:productId
// --------------------------------------------------
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    // Create wishlist if user doesn't have one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        products: [product._id],
      });

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        wishlisted: true,
        wishlistId: wishlist._id,
      });
    }

    // Already exists
    const alreadyWishlisted = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyWishlisted) {
      return res.status(200).json({
        success: true,
        message: "Product is already in wishlist",
        wishlisted: true,
      });
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlisted: true,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};

// --------------------------------------------------
// REMOVE PRODUCT FROM WISHLIST
// DELETE /api/wishlist/:productId
// --------------------------------------------------
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const originalLength = wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    if (wishlist.products.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product is not in wishlist",
      });
    }

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlisted: false,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
};

// --------------------------------------------------
// CHECK PRODUCT WISHLIST STATUS
// GET /api/wishlist/:productId
// --------------------------------------------------
const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const wishlist = await Wishlist.findOne({
      user: req.user.ueserId,
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlisted: false,
      });
    }

    const wishlisted = wishlist.products.some(
      (id) => id.toString() === productId
    );

    return res.status(200).json({
      success: true,
      wishlisted,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};