const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");


// Get all active products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {

    const exists = await Product.findOne({
      slug: req.body.slug,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const result = await uploadToCloudinary(file);

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

      }

    }

    const product = await Product.create({

      ...req.body,

      images: uploadedImages,

    });

    res.status(201).json({

      success: true,

      product,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

// Update product
const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found",

      });

    }

    let images = product.images;

    if (req.files && req.files.length > 0) {

      for (const image of product.images) {

        await cloudinary.uploader.destroy(image.public_id);

      }

      images = [];

      for (const file of req.files) {

        const result = await uploadToCloudinary(file);

        images.push({

          url: result.secure_url,

          public_id: result.public_id,

        });

      }

    }

    const updated = await Product.findByIdAndUpdate(

      req.params.id,

      {

        ...req.body,

        images,

      },

      {

        new: true,

        runValidators: true,

      }

    );

    res.json({

      success: true,

      product: updated,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

// Delete product (Hard Delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Soft Delete (Recommended)
const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product archived successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
};