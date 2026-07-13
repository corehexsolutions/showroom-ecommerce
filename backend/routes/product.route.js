const express = require("express");

const {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
} = require("../controllers/product.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.post(
    "/",
    upload.array("images", 10),
    createProduct
);
router.put(
    "/:id",
    upload.array("images", 10),
    updateProduct
);
router.delete("/:id", deleteProduct);

// Soft Delete
router.patch("/:id/archive", softDeleteProduct);

module.exports = router;