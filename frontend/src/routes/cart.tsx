import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/lib/cart";

import {
  createCartPaymentOrder,
  verifyPayment,
} from "@/lib/payment";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      {
        title: "Shopping Cart — Decor Den",
      },
      {
        name: "description",
        content:
          "Review your selected furniture and complete your purchase at Decor Den.",
      },
    ],
  }),

  component: CartPage,
});

type Product = {
  _id: string;
  name: string;
  slug?: string;
  price: number;

  images?: Array<
    | string
    | {
        url: string;
        public_id?: string;
      }
  >;

  stock?: number;
};

type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
  variant?: string | null;
};

type CartResponse = {
  success: boolean;

  cart: {
    _id: string;
    items: CartItem[];
  };
};

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [updatingItem, setUpdatingItem] =
    useState<string | null>(null);

  const [removingItem, setRemovingItem] =
    useState<string | null>(null);

  const [paying, setPaying] = useState(false);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  // ------------------------------------
  // LOAD CART
  // ------------------------------------

  const loadCart = async () => {
    try {
      setLoading(true);

      const response =
        (await getCart()) as CartResponse;

      if (response.success) {
        setItems(response.cart.items || []);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);

      setPaymentError(
        "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ------------------------------------
  // PRICE
  // ------------------------------------

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) *
          item.quantity,
      0
    );
  }, [items]);

  const shipping = 0;

  const total = subtotal + shipping;

  // ------------------------------------
  // FORMAT PRICE
  // ------------------------------------

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ------------------------------------
  // PRODUCT IMAGE
  // ------------------------------------

  const getProductImage = (
    product: Product
  ) => {
    const image = product.images?.[0];

    if (!image) {
      return "/placeholder-product.jpg";
    }

    if (typeof image === "string") {
      return image;
    }

    return image.url;
  };

  // ------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------

  const changeQuantity = async (
    item: CartItem,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    if (
      item.product.stock !== undefined &&
      newQuantity > item.product.stock
    ) {
      alert(
        `Only ${item.product.stock} item(s) available.`
      );

      return;
    }

    try {
      setUpdatingItem(item._id);

      const response =
        await updateCartItem(
          item._id,
          newQuantity
        );

      if (response.success) {
        setItems(
          response.cart.items
        );
      }
    } catch (error) {
      console.error(
        "Update cart error:",
        error
      );

      alert(
        "Unable to update cart quantity."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ------------------------------------
  // REMOVE ITEM
  // ------------------------------------

  const handleRemove = async (
    item: CartItem
  ) => {
    try {
      setRemovingItem(item._id);

      const response =
        await removeCartItem(item._id);

      if (response.success) {
        setItems(
          response.cart.items
        );
      }
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );

      alert(
        "Unable to remove item."
      );
    } finally {
      setRemovingItem(null);
    }
  };

  // ------------------------------------
  // RAZORPAY PAYMENT
  // ------------------------------------

  const handlePayment = async () => {
    if (items.length === 0) {
      return;
    }

    try {
      setPaying(true);
      setPaymentError(null);

      // ----------------------------------
      // CREATE BACKEND ORDER
      // ----------------------------------

      const data =
        await createCartPaymentOrder();

      if (!data.success) {
        throw new Error(
          "Unable to create payment order"
        );
      }

      const razorpayKey =
        import.meta.env
          .VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key is not configured."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout failed to load."
        );
      }

      // ----------------------------------
      // OPEN RAZORPAY
      // ----------------------------------

      const options = {
        key: razorpayKey,

        amount:
          data.razorpay.amount,

        currency:
          data.razorpay.currency,

        name: "Decor Den",

        description:
          `Order ${data.order.orderNumber}`,

        order_id:
          data.razorpay.orderId,

        theme: {
          color:
            "#183C2D",
        },

        handler: async (
          response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }
        ) => {
          try {
            setPaying(true);
            setPaymentError(null);

            // ------------------------------
            // VERIFY PAYMENT ON BACKEND
            // ------------------------------

            const verifyResponse =
              await verifyPayment({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              });

            if (!verifyResponse.success) {
              throw new Error(
                verifyResponse.message ||
                  "Payment verification failed"
              );
            }

            // ------------------------------
            // SUCCESS
            // ------------------------------

            setPaymentSuccess(true);

            setItems([]);
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setPaymentError(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setPaying(false);
    }
  };

  // ------------------------------------
  // CLEAR CART
  // ------------------------------------

  const handleClearCart = async () => {
    try {
      await clearCart();

      setItems([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      alert(
        "Unable to clear cart."
      );
    }
  };

  // ------------------------------------
  // LOADING
  // ------------------------------------

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-charcoal/60" />
      </section>
    );
  }

  // ------------------------------------
  // PAYMENT SUCCESS
  // ------------------------------------

  if (paymentSuccess) {
    return (
      <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <CheckCircle2 className="h-10 w-10 text-[var(--brand-green-muted)]" />
          </div>

          <h1 className="font-display text-4xl text-charcoal">
            Order Confirmed
          </h1>

          <p className="mt-4 text-sm leading-6 text-charcoal/60">
            Thank you for your purchase.
            Your payment was successful and
            your order has been confirmed.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-charcoal px-7 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)]"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  // ------------------------------------
  // EMPTY CART
  // ------------------------------------

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <ShoppingBag className="h-8 w-8 text-charcoal/60" />
          </div>

          <h1 className="font-display text-4xl text-charcoal">
            Your Cart is Empty
          </h1>

          <p className="mt-4 text-sm leading-6 text-charcoal/60">
            Discover our curated collection
            of furniture and find something
            beautiful for your home.
          </p>

          <Link
            to="/sofas"
            className="mt-8 inline-flex items-center gap-3 bg-charcoal px-7 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)]"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    );
  }

  // ------------------------------------
  // CART PAGE
  // ------------------------------------

  return (
    <section className="bg-[#F6F1EA] min-h-screen">

      {/* HEADER */}

      <div className="border-b border-line bg-white">
        <div className="container-luxury py-14 md:py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/50">
            Your Selection
          </p>

          <div className="mt-3 flex items-end justify-between gap-6">
            <h1 className="font-display text-4xl md:text-5xl text-charcoal">
              Shopping Cart
            </h1>

            <p className="hidden text-sm text-charcoal/50 sm:block">
              {items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}{" "}
              items
            </p>
          </div>
        </div>
      </div>

      {/* CART */}

      <div className="container-luxury py-10 md:py-16">

        {/* PAYMENT ERROR */}

        {paymentError && (
          <div className="mb-6 flex items-center justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span>{paymentError}</span>

            <button
              onClick={() =>
                setPaymentError(null)
              }
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* ITEMS */}

          <div className="space-y-4">

            {items.map((item) => (
              <motion.div
                layout
                key={item._id}
                className="bg-white p-4 md:p-6"
              >
                <div className="flex gap-5 md:gap-7">

                  {/* IMAGE */}

                  <Link
                    to="/product/$slug"
                    params={{
                      slug:
                        item.product.slug ||
                        "",
                    }}
                    className="block h-32 w-28 shrink-0 overflow-hidden bg-[#eee8df] md:h-44 md:w-36"
                  >
                    <img
                      src={getProductImage(
                        item.product
                      )}
                      alt={
                        item.product.name
                      }
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>

                  {/* DETAILS */}

                  <div className="flex min-w-0 flex-1 flex-col justify-between">

                    <div>
                      <div className="flex justify-between gap-4">

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
                            Decor Den
                          </p>

                          <h2 className="mt-1 font-display text-xl text-charcoal md:text-2xl">
                            {item.product.name}
                          </h2>

                          {item.variant && (
                            <p className="mt-2 text-xs text-charcoal/50">
                              {item.variant}
                            </p>
                          )}
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          disabled={
                            removingItem ===
                            item._id
                          }
                          onClick={() =>
                            handleRemove(item)
                          }
                          aria-label={`Remove ${item.product.name}`}
                          className="shrink-0 text-charcoal/40 transition-colors hover:text-red-700 disabled:opacity-50"
                        >
                          {removingItem ===
                          item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">

                      {/* QUANTITY */}

                      <div className="flex items-center border border-line">

                        <button
                          type="button"
                          disabled={
                            updatingItem ===
                            item._id ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            changeQuantity(
                              item,
                              item.quantity - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:bg-[#F6F1EA] disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>

                        <span className="flex h-9 w-10 items-center justify-center border-x border-line text-xs">
                          {updatingItem ===
                          item._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        <button
                          type="button"
                          disabled={
                            updatingItem ===
                            item._id ||
                            (item.product.stock !==
                              undefined &&
                              item.quantity >=
                                item.product.stock)
                          }
                          onClick={() =>
                            changeQuantity(
                              item,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:bg-[#F6F1EA] disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>

                      </div>

                      {/* PRICE */}

                      <p className="font-display text-lg text-charcoal">
                        {formatPrice(
                          item.product.price *
                            item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CLEAR CART */}

            <button
              type="button"
              onClick={handleClearCart}
              className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>

          {/* SUMMARY */}

          <aside className="lg:sticky lg:top-28 lg:self-start">

            <div className="bg-white p-6 md:p-8">

              <h2 className="font-display text-2xl text-charcoal">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 border-b border-line pb-6">

                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">
                    Subtotal
                  </span>

                  <span className="text-charcoal">
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

                <span className="text-sm uppercase tracking-[0.15em] text-charcoal">
                  Total
                </span>

                <span className="font-display text-2xl text-charcoal">
                  {formatPrice(total)}
                </span>

              </div>

              {/* PAY */}

              <button
                type="button"
                disabled={paying || items.length === 0}
                onClick={handlePayment}
                className="mt-8 flex w-full items-center justify-center gap-3 bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatPrice(total)}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <Link
                to="/sofas"
                className="mt-4 flex w-full items-center justify-center px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-charcoal"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-4 bg-white/60 p-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/50">
                Complimentary white-glove delivery
              </p>

              <p className="mt-2 text-xs text-charcoal/60">
                On orders above ₹75,000
              </p>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}