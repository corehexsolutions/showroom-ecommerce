const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
dns.setServers(['1.1.1.1','8.8.8.8']);
dotenv.config();

const connectDB = require("./config/db");
const cloudinary = require("./config/cloudinary");
const productRoutes = require("./routes/product.route");


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

app.use("/api/products", productRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});