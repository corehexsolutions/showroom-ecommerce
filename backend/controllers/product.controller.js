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
    const exists = await Product.findOne({
      slug: productData.slug,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // Create temporary product for validation
    const tempProduct = new Product(productData);

    // Validate before uploading images
    try {
      await tempProduct.validate();
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message,
        errors: validationError.errors,
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

    // Add uploaded images
    tempProduct.images = uploadedImages;

    // Save product
    await tempProduct.save();

    return res.status(201).json({
      success: true,
      product: tempProduct,
    });
  } catch (err) {
    console.error("Create product error:", err);

    return res.status(500).json({
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

    /*
     * ---------------------------------------------------------
     * Parse JSON fields coming from multipart/form-data
     * ---------------------------------------------------------
     *
     * FormData sends these as strings:
     *
     * variants
     * badges
     * accordion
     * tags
     * existingImages
     */

    let variants = product.variants || [];
    let badges = product.badges || [];
    let accordion = product.accordion || [];
    let tags = product.tags || [];
    let existingImages = product.images || [];

    if (req.body.variants !== undefined) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variants JSON",
        });
      }
    }

    if (req.body.badges !== undefined) {
      try {
        badges = JSON.parse(req.body.badges);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid badges JSON",
        });
      }
    }

    if (req.body.accordion !== undefined) {
      try {
        accordion = JSON.parse(req.body.accordion);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid accordion JSON",
        });
      }
    }

    if (req.body.tags !== undefined) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid tags JSON",
        });
      }
    }

    if (req.body.existingImages !== undefined) {
      try {
        existingImages = JSON.parse(
          req.body.existingImages
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid existingImages JSON",
        });
      }
    }

    /*
     * ---------------------------------------------------------
     * Handle images
     * ---------------------------------------------------------
     *
     * existingImages = images the admin wants to KEEP
     *
     * req.files = newly uploaded images
     */

    let images = existingImages;

    /*
     * Find images that were removed from the product.
     *
     * Example:
     *
     * Old:
     * [image1, image2, image3]
     *
     * Admin removes image2
     *
     * existingImages:
     * [image1, image3]
     *
     * image2 needs to be deleted from Cloudinary.
     */

    const existingPublicIds = new Set(
      existingImages.map(
        (image) => image.public_id
      )
    );

    const removedImages = (product.images || []).filter(
      (oldImage) =>
        oldImage.public_id &&
        !existingPublicIds.has(oldImage.public_id)
    );

    /*
     * Delete removed images from Cloudinary
     */
    for (const image of removedImages) {
      try {
        await cloudinary.uploader.destroy(
          image.public_id
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete Cloudinary image:",
          image.public_id,
          cloudinaryError
        );
      }
    }

    /*
     * Upload newly selected images
     */
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result =
          await uploadToCloudinary(file);

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    /*
     * Maximum 10 images
     */
    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        message: "A product can have a maximum of 10 images",
      });
    }

    /*
     * ---------------------------------------------------------
     * Build clean update object
     * ---------------------------------------------------------
     *
     * Do NOT simply spread req.body.
     *
     * req.body contains strings because this is multipart/form-data.
     */

    const updateData = {
      name: req.body.name?.trim(),
      slug: req.body.slug?.trim().toLowerCase(),
      description: req.body.description || "",
      brand: req.body.brand || "",
      category: req.body.category?.trim(),

      tags,

      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : product.price,

      currency:
        req.body.currency || "INR",

      variantLabel:
        req.body.variantLabel || "Size",

      variants,
      badges,
      accordion,

      images,

      inStock:
        req.body.inStock !== undefined
          ? req.body.inStock === "true"
          : product.inStock,

      totalStock:
        req.body.totalStock !== undefined
          ? Number(req.body.totalStock)
          : product.totalStock,

      rating:
        req.body.rating !== undefined
          ? Number(req.body.rating)
          : product.rating,

      reviewCount:
        req.body.reviewCount !== undefined
          ? Number(req.body.reviewCount)
          : product.reviewCount,

      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === "true"
          : product.isActive,
    };

    /*
     * Only include compareAtPrice when supplied.
     *
     * This also prevents an empty string from being sent
     * to the Number field.
     */
    if (
      req.body.compareAtPrice !== undefined &&
      req.body.compareAtPrice !== ""
    ) {
      updateData.compareAtPrice = Number(
        req.body.compareAtPrice
      );
    } else {
      updateData.compareAtPrice = undefined;
    }

    /*
     * ---------------------------------------------------------
     * Update product
     * ---------------------------------------------------------
     */

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      product: updated,
    });
  } catch (err) {
    console.error(
      "Update product error:",
      err
    );

    return res.status(500).json({
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