// src/lib/cart.ts

import api from "@/lib/axios";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCart(
  productId: string,
  quantity = 1,
  variant?: string | null
) {
  const response = await api.post("/cart/items", {
    productId,
    quantity,
    variant: variant ?? null,
  });

  return response.data;
}

export async function updateCartItem(
  itemId: string,
  quantity: number
) {
  const response = await api.patch(
    `/cart/items/${itemId}`,
    {
      quantity,
    }
  );

  return response.data;
}

export async function removeCartItem(itemId: string) {
  const response = await api.delete(
    `/cart/items/${itemId}`
  );

  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/cart");
  return response.data;
}