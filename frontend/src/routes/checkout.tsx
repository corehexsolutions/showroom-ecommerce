import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import {
  createPaymentOrder,
  verifyPayment,
} from "@/lib/payment";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      {
        title: "Checkout — Decor Den",
      },
      {
        name: "description",
        content:
          "Complete your Decor Den furniture purchase.",
      },
    ],
  }),

  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  async function handlePayment() {
    try {
      setLoading(true);
      setError("");

      if (!items.length) {
        setError("Your cart is empty.");
        return;
      }

      // 1. Create Razorpay order on backend
      const data = await createPaymentOrder();

      // 2. Open Razorpay
      const options = {
        key: data.keyId,

        amount: data.amount,

        currency: data.currency,

        name: "Decor Den",

        description: "Furniture Purchase",

        order_id: data.razorpayOrderId,

        theme: {
          color: "#6f8068",
        },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setLoading(true);

            // 3. Verify payment on backend
            const result = await verifyPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            });

            if (!result.success) {
              throw new Error(
                result.message || "Payment verification failed"
              );
            }

            // 4. Payment verified
            await navigate({
              to: "/order-success",
              search: {
                orderId: result.order?.id || "",
              },
            });
          } catch (err) {
            console.error(err);

            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment"
      );

      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-charcoal">
            Your cart is empty
          </h1>

          <Link
            to="/sofas"
            className="mt-8 inline-flex bg-charcoal px-7 py-4 text-xs uppercase tracking-[0.2em] text-ivory"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F6F1EA]">
      <div className="border-b border-line bg-white">
        <div className="container-luxury py-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/50">
            Complete Your Purchase
          </p>

          <h1 className="mt-3 font-display text-4xl text-charcoal">
            Checkout
          </h1>
        </div>
      </div>

      <div className="container-luxury py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-4">
            <div className="bg-white p-6 md:p-8">
              <h2 className="font-display text-2xl">
                Your Items
              </h2>

              <div className="mt-6 divide-y divide-line">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant ?? ""}`}
                    className="flex gap-4 py-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-display text-lg">
                        {item.name}
                      </h3>

                      {item.variant && (
                        <p className="mt-1 text-xs text-charcoal/50">
                          {item.variant}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-charcoal/60">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-display">
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white p-6 md:p-8">
              <h2 className="font-display text-2xl">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 border-b border-line pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">
                    Delivery
                  </span>

                  <span className="text-[var(--brand-green-muted)]">
                    Complimentary
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <span className="text-sm uppercase tracking-[0.15em]">
                  Total
                </span>

                <span className="font-display text-2xl">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {error && (
                <div className="mt-5 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-3 bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatPrice(subtotal)}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[10px] leading-5 text-charcoal/50">
                Secure payment powered by Razorpay
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}