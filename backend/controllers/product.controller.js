const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");


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
    // Parse multipart JSON fields
    const productData = {
      ...req.body,
      tags: Array.isArray(req.body.tags)
        ? req.body.tags
        : JSON.parse(req.body.tags || "[]"),
      variants: JSON.parse(req.body.variants || "[]"),
      badges: JSON.parse(req.body.badges || "[]"),
      accordion: JSON.parse(req.body.accordion || "[]"),
    };

    // Check slug first
    const exists = await Product.findOne({ slug: productData.slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // Validate required fields BEFORE uploading images
    const tempProduct = new Product(productData);
    const validationError = tempProduct.validateSync();

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message,
      });
    }

    // Upload images only after validation passes
    const uploadedImages = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    tempProduct.images = uploadedImages;

    await tempProduct.save();

    return res.status(201).json({
      success: true,
      product: tempProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {

    console.log("ID from params:", req.params.id);


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