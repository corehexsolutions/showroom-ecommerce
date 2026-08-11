require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
dns.setServers(['1.1.1.1','8.8.8.8']);

const User = require("../models/user.model");

const createAdmin = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@decorden.com";
    const password = "Admin@123654789";
    const name = "Admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();