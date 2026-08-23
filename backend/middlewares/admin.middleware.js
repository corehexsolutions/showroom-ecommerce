const User = require("../models/user.model");

const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // req.user is the JWT payload
    // { userId, iat, exp }
    const user = await User.findById(req.user.userId).select("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }


    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = admin;