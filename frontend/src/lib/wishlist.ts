import api from "@/lib/axios";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  category: string;
  tags?: string[];

  price: number;
  compareAtPrice?: number;
  currency?: string;

  images?: {
    url: string;
    public_id: string;
  }[];

  variantLabel?: string;

  variants?: {
    label: string;
    sku?: string;
    price?: number;
    inStock?: boolean;
    stockQuantity?: number;
  }[];

  badges?: {
    icon?: string;
    title?: string;
    subtitle?: string;
  }[];

  inStock?: boolean;
  totalStock?: number;
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export const getWishlist = async (): Promise<WishlistProduct[]> => {
  const response = await api.get("/wishlist");

  return response.data.wishlist || [];
};

export const addToWishlist = async (
  productId: string
) => {
  const response = await api.post(
    `/wishlist/${productId}`
  );

  return response.data;
};

export const removeFromWishlist = async (
  productId: string
) => {
  const response = await api.delete(
    `/wishlist/${productId}`
  );

  return response.data;
};

export const checkWishlist = async (
  productId: string
): Promise<boolean> => {
  const response = await api.get(
    `/wishlist/${productId}`
  );

  return response.data.wishlisted ?? false;
};