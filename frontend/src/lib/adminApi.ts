import api from "./axios";
import type { Product } from "@/types/product";

export async function getAdminProducts(): Promise<Product[]> {
  const response = await api.get<{
    success: boolean;
    products: Product[];
  }>("/products");

  return response.data.products || [];
}

export async function createProduct(formData: FormData) {
  const response = await api.post("/products", formData);

  return response.data;
}

export async function updateProduct(id: string, formData: FormData) {
  const response = await api.put(`/products/${id}`, formData);

  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);

  return response.data;
}

export async function archiveProduct(id: string) {
  const response = await api.patch(`/products/${id}/archive`);

  return response.data;
}