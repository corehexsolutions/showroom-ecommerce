const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/user.controller");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;