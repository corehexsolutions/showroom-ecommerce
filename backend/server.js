const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const dns = require("dns");
dns.setServers(['1.1.1.1','8.8.8.8']);
dotenv.config();

const connectDB = require("./config/db");
const cloudinary = require("./config/cloudinary");
const productRoutes = require("./routes/product.route");
const userRoutes = require("./routes/user.route");
const cartRoutes = require("./routes/cart.route");
const paymentRoutes = require("./routes/payment.route");
const orderRoutes = require("./routes/order.route");
const adminOrderRoutes = require("./routes/adminOrder.routes");
const consultationRoutes = require("./routes/consultation.route");
const wishlistRoutes = require("./routes/wishlist.routes");

connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_DEV,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});