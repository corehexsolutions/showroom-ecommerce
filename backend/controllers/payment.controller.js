const crypto = require("crypto");

const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");

const createRazorpayOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let subtotal = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart no longer exists",
        });
      }

      // If you have stock management
      if (
        product.stock !== undefined &&
        product.stock < item.quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      const price = product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || null,
        price,
        quantity: item.quantity,
        variant: item.variant,
      });
    }

    // Your business rule
    const shipping = subtotal >= 75000 ? 0 : 0;

    const total = subtotal + shipping;

    // Razorpay uses paise
    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",

      receipt: `receipt_${Date.now()}`,

      notes: {
        userId: req.user.userId.toString(),
      },
    });

    const orderNumber = `DD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,

      user: req.user.userId,

      items: orderItems,

      subtotal,

      shipping,

      total,

      currency: "INR",

      paymentMethod: "razorpay",

      paymentStatus: "pending",

      orderStatus: "pending",

      razorpayOrderId: razorpayOrder.id,

      shippingAddress: {
        name: req.user.name,
        email: req.user.email,
      },
    });

    res.status(201).json({
      success: true,

      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        currency: order.currency,
      },

      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }

};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment information is incomplete",
      });
    }

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    const isValid =
      expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate verification
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    order.paymentStatus = "paid";

    order.orderStatus = "confirmed";

    await order.save();

    // Clear cart ONLY after successful verification
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
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Verify Razorpay payment error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

const createBuyNowOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      variant = null,
    } = req.body;

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

    const Product = require("../models/product.model");

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (
      product.stock !== undefined &&
      product.stock < quantity
    ) {
      return res.status(400).json({
        success: false,
        message: `${product.name} does not have enough stock`,
      });
    }

    const price = product.price;

    const subtotal = price * quantity;

    const shipping = subtotal >= 75000 ? 0 : 0;

    const total = subtotal + shipping;

    const amountInPaise = Math.round(total * 100);

    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `buy_now_${Date.now()}`,
        notes: {
          userId: req.user.userId.toString(),
          productId: product._id.toString(),
          type: "buy_now",
        },
      });

    const orderNumber = `DD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,

      user: req.user.userId,

      items: [
        {
          product: product._id,
          name: product.name,
          image: product.images?.[0] || null,
          price: product.price,
          quantity,
          variant,
        },
      ],

      subtotal,

      shipping,

      total,

      currency: "INR",

      paymentMethod: "razorpay",

      paymentStatus: "pending",

      orderStatus: "pending",

      razorpayOrderId: razorpayOrder.id,

      shippingAddress: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
    });

    return res.status(201).json({
      success: true,

      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        currency: order.currency,
      },

      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error(
      "Buy now order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Buy Now order",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createBuyNowOrder
};