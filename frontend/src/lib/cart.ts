// src/lib/cart.ts

import api from "@/lib/axios";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCart(
  productId: string,
  quantity = 1,
  variantId?: string
) {
  const response = await api.post("/cart", {
    productId,
    quantity,
    variantId,
  });

  return response.data;
}

export async function updateCartItem(
  productId: string,
  quantity: number,
  variantId?: string
) {
  const response = await api.patch("/cart/item", {
    productId,
    quantity,
    variantId,
  });

  return response.data;
}

export async function removeCartItem(
  productId: string,
  variantId?: string
) {
  const response = await api.delete("/cart/item", {
    data: {
      productId,
      variantId,
    },
  });

  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/cart");

  return response.data;
}