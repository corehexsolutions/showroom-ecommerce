export type ProductImage = {
  url: string;
  public_id: string;
};

export type ProductVariant = {
  label: string;
  sku?: string;
  price?: number;
  inStock: boolean;
  stockQuantity: number;
};

export type ProductBadge = {
  icon?: string;
  title?: string;
  subtitle?: string;
};

export type ProductAccordion = {
  title?: string;
  content?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  tags: string[];

  price: number;
  compareAtPrice?: number;
  currency: string;

  images: ProductImage[];

  variantLabel: string;
  variants: ProductVariant[];

  badges: ProductBadge[];
  accordion: ProductAccordion[];

  inStock: boolean;
  totalStock: number;

  rating: number;
  reviewCount: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};