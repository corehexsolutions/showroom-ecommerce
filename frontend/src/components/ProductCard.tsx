import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { addToCart } from "@/lib/cart";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import type { ShippingAddress } from "@/components/checkout/ShippingForm";
import {
  createBuyNowOrder,
  verifyRazorpayPayment,
} from "@/lib/payment";

import {
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
} from "@/lib/wishlist";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  original: number;
  rating: number;
  reviews: number;
};

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [buyingNow, setBuyingNow] =
    useState(false);

  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  // -----------------------------
  // WISHLIST
  // -----------------------------

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  // Check wishlist status when card loads
  useEffect(() => {
    let mounted = true;

    const loadWishlistStatus = async () => {
      try {
        const wishlisted = await checkWishlist(product.id);

        if (mounted) {
          setIsWishlisted(wishlisted);
        }
      } catch (error) {
        console.error(
          "Failed to check wishlist status:",
          error
        );
      }
    };

    loadWishlistStatus();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  // -----------------------------
  // WISHLIST TOGGLE
  // -----------------------------

  const handleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const off = Math.round(
    ((product.original - product.price) /
      product.original) *
      100
  );

  // -----------------------------
  // ADD TO CART
  // -----------------------------

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart) return;

    try {
      setAddingToCart(true);

      await addToCart(
        product.id,
        1,
        null
      );

      alert("Added to cart");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // -----------------------------
  // BUY NOW
  // -----------------------------

  const handleBuyNow = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (buyingNow) return;

    setCheckoutOpen(true);
  };

  const handleCheckout = async (
    shippingAddress: ShippingAddress
  ) => {
    try {
      setBuyingNow(true);

      const data = await createBuyNowOrder({
        productId: product.id,
        quantity: 1,
        variant: null,
        shippingAddress,
      });

      if (!data.success) {
        throw new Error(
          "Unable to create payment order"
        );
      }

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

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

      const options = {
        key: razorpayKey,

        amount: data.razorpay.amount,

        currency: data.razorpay.currency,

        name: "Decor Den",

        description: product.name,

        order_id: data.razorpay.orderId,

        theme: {
          color: "#183C2D",
        },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse =
              await verifyRazorpayPayment({
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

            setCheckoutOpen(false);

            await navigate({
              to: "/order-success",
              search: {
                orderNumber:
                  verifyResponse.order?.orderNumber ||
                  data.order.orderNumber,
              },
            });
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error instanceof Error
                ? error.message
                : "Payment verification failed"
            );
          } finally {
            setBuyingNow(false);
          }
        },

        modal: {
          ondismiss: () => {
            setBuyingNow(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Buy now checkout error:",
        error
      );

      setBuyingNow(false);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment"
      );
    }
  };

  return (
    <>
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block"
      >
        <motion.article>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="block"
          >
            <motion.article
              initial={{
                opacity: 0,
                y: 32,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-beige aspect-[4/5] rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />

                {off > 0 && (
                  <span className="absolute top-4 left-4 bg-[var(--brand-deep-forest-green)] text-ivory text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
                    −{off}%
                  </span>
                )}

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={isWishlisted}
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-ivory/95 backdrop-blur grid place-items-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--brand-deep-forest-green)] hover:text-ivory disabled:opacity-60 disabled:cursor-not-allowed ${
                    isWishlisted
                      ? "text-[var(--brand-deep-forest-green)] opacity-100 translate-y-0"
                      : "text-[var(--brand-green-muted)]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-all ${
                      isWishlisted
                        ? "fill-current scale-110"
                        : ""
                    }`}
                  />
                </button>

                {/* Action buttons */}
                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {/* ADD TO CART */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={
                      addingToCart ||
                      buyingNow
                    }
                    className="flex-1 bg-ivory/95 backdrop-blur text-charcoal py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium flex items-center justify-center gap-2 hover:bg-[var(--brand-green-muted)] hover:text-ivory transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />

                    {addingToCart
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>

                  {/* BUY NOW */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={
                      buyingNow ||
                      addingToCart
                    }
                    className="flex-1 bg-[var(--brand-deep-forest-green)] text-ivory py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium flex items-center justify-center gap-2 hover:bg-[var(--brand-green-muted)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-3.5 w-3.5" />

                    {buyingNow
                      ? "Processing..."
                      : "Buy Now"}
                  </button>
                </div>
              </div>

              {/* Product details */}
              <div className="pt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-walnut mb-1.5">
                      {product.category}
                    </p>

                    <h3 className="font-display text-xl text-charcoal truncate">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-charcoal">
                    <Star className="h-3.5 w-3.5 fill-walnut text-walnut" />

                    <span className="text-xs">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-lg text-charcoal font-medium">
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  {product.original >
                    product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹
                      {product.original.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          </Link>
        </motion.article>
      </Link>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => {
          if (!buyingNow) {
            setCheckoutOpen(false);
          }
        }}
        items={[
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
          },
        ]}
        subtotal={product.price}
        shipping={0}
        total={product.price}
        onSubmit={handleCheckout}
        loading={buyingNow}
      />
    </>
  );
}