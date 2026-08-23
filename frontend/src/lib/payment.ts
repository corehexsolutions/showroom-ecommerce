// src/lib/payment.ts

import api from "@/lib/axios";

export type RazorpayOrderResponse = {
  success: boolean;

  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
  };

  razorpay: {
    orderId: string;
    amount: number;
    currency: string;
  };
};

export type VerifyPaymentResponse = {
  success: boolean;
  message: string;

  order?: {
    _id: string;
    orderNumber: string;
    paymentStatus: string;
    orderStatus: string;
  };
};

export async function createRazorpayOrder() {
  const response =
    await api.post<RazorpayOrderResponse>(
      "/payments/razorpay/create-order"
    );

  return response.data;
}

export async function createBuyNowOrder(data: {
  productId: string;
  quantity: number;
  variant?: string | null;
}) {
  const response =
    await api.post<RazorpayOrderResponse>(
      "/payments/razorpay/buy-now",
      data
    );

  return response.data;
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const response =
    await api.post<VerifyPaymentResponse>(
      "/payments/razorpay/verify",
      data
    );

  return response.data;
}

export type CreateCartPaymentResponse = {
  success: boolean;

  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
  };

  razorpay: {
    orderId: string;
    amount: number;
    currency: string;
  };
};

export async function createCartPaymentOrder() {
  const response =
    await api.post<CreateCartPaymentResponse>(
      "/payments/razorpay/create-order"
    );

  return response.data;
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const response =
    await api.post<VerifyPaymentResponse>(
      "/payments/razorpay/verify",
      data
    );

  return response.data;
}