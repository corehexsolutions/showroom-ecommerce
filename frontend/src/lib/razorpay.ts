// src/lib/razorpay.ts

import {
  createRazorpayOrder,
  createBuyNowOrder,
  verifyRazorpayPayment,
} from "@/lib/payment";

type PaymentResult = {
  orderNumber: string;
};

type CheckoutOptions = {
  description: string;

  buyNow?: {
    productId: string;
    quantity: number;
    variant?: string | null;
  };

  onSuccess: (result: PaymentResult) => void;

  onError: (message: string) => void;
};

export async function openRazorpayCheckout({
  description,
  buyNow,
  onSuccess,
  onError,
}: CheckoutOptions) {
  try {
    const data = buyNow
      ? await createBuyNowOrder(buyNow)
      : await createRazorpayOrder();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: data.razorpay.amount,

      currency: data.razorpay.currency,

      name: "Decor Den",

      description,

      order_id: data.razorpay.orderId,

      prefill: {
        name: "",
        email: "",
        contact: "",
      },

      theme: {
        color: "#294536",
      },

      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const result =
            await verifyRazorpayPayment(response);

          if (!result.success || !result.order) {
            throw new Error(
              result.message ||
                "Payment verification failed"
            );
          }

          onSuccess({
            orderNumber:
              result.order.orderNumber,
          });
        } catch (error) {
          console.error(error);

          onError(
            error instanceof Error
              ? error.message
              : "Payment verification failed"
          );
        }
      },

      modal: {
        ondismiss: () => {
          onError("Payment was cancelled");
        },
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.error(error);

    onError(
      error instanceof Error
        ? error.message
        : "Unable to start payment"
    );
  }
}