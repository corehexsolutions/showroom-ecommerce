import api from "./axios";

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};