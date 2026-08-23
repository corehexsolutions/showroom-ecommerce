const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.userId,
    }).populate({
      path: "items.product",
      select: "name slug price images stock variants",
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// POST /api/cart/items
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant = null } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: req.user.userId,
      },
      {
        $setOnInsert: {
          user: req.user.userId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant === variant
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        variant,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name slug price images stock variants",
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// PATCH /api/cart/items/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name slug price images stock variants",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// DELETE /api/cart/items/:itemId
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.deleteOne();

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name slug price images stock variants",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      {
        user: req.user.userId,
      },
      {
        $set: {
          items: [],
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};