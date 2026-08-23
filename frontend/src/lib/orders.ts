import api from "@/lib/axios";

export type OrderItem = {
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

export type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];

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

export async function getMyOrders(): Promise<Order[]> {
  const response = await api.get("/orders");

  return response.data.orders;
}

export async function getMyOrder(orderId: string): Promise<Order> {
  const response = await api.get(`/orders/${orderId}`);

  return response.data.order;
}