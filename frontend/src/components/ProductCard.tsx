import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { addToCart } from "@/lib/cart";
import { openRazorpayCheckout } from "@/lib/razorpay";

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
  const handleBuyNow = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (buyingNow) return;


    try {
      setBuyingNow(true);

      await openRazorpayCheckout({
        description: product.name,

        buyNow: {
          productId: product.id,
          quantity: 1,
          variant: null,
        },

        onSuccess: async (result) => {
          setBuyingNow(false);

          await navigate({
            to: "/order-success",
            search: {
              orderNumber: result.orderNumber,
            },
          });
        },

        onError: (message) => {
          setBuyingNow(false);

          // Don't show cancellation as an error
          if (message !== "Payment was cancelled") {
            alert(message);
          }
        },
      });
    } catch (error) {
      console.error(
        "Buy now error:",
        error
      );

      setBuyingNow(false);
    }
  };

  return (
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Wishlist"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-ivory/95 backdrop-blur text-[var(--brand-green-muted)] grid place-items-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--brand-deep-forest-green)] hover:text-ivory"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Action buttons */}
          <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || buyingNow}
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
              disabled={buyingNow || addingToCart}
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
  );
}