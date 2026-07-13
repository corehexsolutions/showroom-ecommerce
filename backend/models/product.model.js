const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const VariantSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    sku: String,
    price: Number,
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const BadgeSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    subtitle: String,
  },
  { _id: false }
);

const AccordionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    tags: [String],

    price: {
      type: Number,
      required: true,
    },

    compareAtPrice: Number,

    currency: {
      type: String,
      default: "INR",
    },

    images: [ImageSchema],

    variantLabel: {
      type: String,
      default: "Size",
    },

    variants: [VariantSchema],

    badges: [BadgeSchema],

    accordion: [AccordionSchema],

    inStock: {
      type: Boolean,
      default: true,
    },

    totalStock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);