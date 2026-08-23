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



export type AdminOrderItem = {
  product: {
    _id: string;
    name: string;
    slug?: string;
    images?: {
      url: string;
      public_id?: string;
    }[];
  } | null;

  name: string;
  image: string | null;
  price: number;
  quantity: number;
  variant: string | null;
};

export type AdminOrder = {
  _id: string;
  orderNumber: string;

  user: {
    _id: string;
    name?: string;
    email?: string;
  } | null;

  items: AdminOrderItem[];

  subtotal: number;
  shipping: number;
  total: number;
  currency: string;

  paymentMethod: "razorpay" | "cod";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "partially_refunded";

  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;

  shippingAddress: {
    name?: string;
    phone?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  createdAt: string;
  updatedAt: string;
};

export async function getAdminOrders(params?: {
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
}) {
  const response = await api.get("/admin/orders", {
    params,
  });

  return response.data.orders as AdminOrder[];
}

export async function getAdminOrder(orderId: string) {
  const response = await api.get(`/admin/orders/${orderId}`);

  return response.data.order as AdminOrder;
}

export async function updateAdminOrderStatus(
  orderId: string,
  orderStatus: AdminOrder["orderStatus"]
) {
  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    {
      orderStatus,
    }
  );

  return response.data.order as AdminOrder;
}

export async function updateAdminPaymentStatus(
  orderId: string,
  paymentStatus: AdminOrder["paymentStatus"]
) {
  const response = await api.patch(
    `/admin/orders/${orderId}/payment-status`,
    {
      paymentStatus,
    }
  );

  return response.data.order as AdminOrder;
}