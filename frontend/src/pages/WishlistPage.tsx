import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Loader2,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";

import {
  getWishlist,
  removeFromWishlist,
  type WishlistProduct,
} from "@/lib/wishlist";

import { addToCart } from "@/lib/cart";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState<string | null>(
    null
  );

  const [addingToCartId, setAddingToCartId] =
    useState<string | null>(null);

  // --------------------------------------------------
  // LOAD WISHLIST
  // --------------------------------------------------

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const products = await getWishlist();

      setWishlist(products);
    } catch (error) {
      console.error("Wishlist loading error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // --------------------------------------------------
  // REMOVE FROM WISHLIST
  // --------------------------------------------------

  const handleRemove = async (productId: string) => {
    if (removingId) return;

    try {
      setRemovingId(productId);

      await removeFromWishlist(productId);

      setWishlist((current) =>
        current.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove product from wishlist."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAddToCart = async (
    productId: string
  ) => {
    if (addingToCartId) return;

    try {
      setAddingToCartId(productId);

      await addToCart(productId, 1, null);

      alert("Added to cart");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add product to cart."
      );
    } finally {
      setAddingToCartId(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[var(--ivory)]">
        <div className="container-luxury py-24">
          <div className="flex min-h-[45vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-deep-forest-green)]" />

              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Loading your wishlist
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[var(--ivory)]">
        <div className="container-luxury py-24">
          <div className="mx-auto max-w-xl text-center">
            <Heart className="mx-auto mb-6 h-8 w-8 text-[var(--brand-deep-forest-green)]" />

            <p className="eyebrow mb-4">
              Wishlist
            </p>

            <h1 className="font-display text-4xl text-charcoal">
              Something went wrong
            </h1>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={loadWishlist}
              className="btn-primary-green mt-8"
            >
              Try Again
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // EMPTY WISHLIST
  // --------------------------------------------------

  if (wishlist.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[var(--ivory)]">
        <div className="container-luxury">
          <section className="flex min-h-[70vh] items-center justify-center py-20">
            <div className="max-w-xl text-center">
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--line)] bg-white">
                <Heart
                  className="h-7 w-7 text-[var(--brand-deep-forest-green)]"
                  strokeWidth={1.4}
                />
              </div>

              <p className="eyebrow mb-4">
                Your collection
              </p>

              <h1 className="font-display text-5xl text-charcoal">
                Your wishlist is waiting
              </h1>

              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Save the pieces you love and keep them
                close. Your favourite furniture will appear
                here.
              </p>

              <Link
                to="/"
                className="btn-primary-green mt-9"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // WISHLIST
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[var(--ivory)]">
      {/* Header */}
      <section className="border-b border-[var(--line)] bg-white">
        <div className="container-luxury py-12 md:py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">
                Saved pieces
              </p>

              <h1 className="font-display text-4xl md:text-5xl text-charcoal">
                My Wishlist
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "piece"
                  : "pieces"}{" "}
                saved for later
              </p>
            </div>

            <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)]">
              <Heart
                className="h-4 w-4 text-[var(--brand-deep-forest-green)]"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-luxury py-12 md:py-16">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => {
            const image =
              product.images?.[0]?.url;

            const discounted =
              typeof product.compareAtPrice ===
                "number" &&
              product.compareAtPrice >
                product.price;

            const discount = discounted
              ? Math.round(
                  ((product.compareAtPrice! -
                    product.price) /
                    product.compareAtPrice!) *
                    100
                )
              : 0;

            const isRemoving =
              removingId === product._id;

            const isAdding =
              addingToCartId === product._id;

            return (
              <article
                key={product._id}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-beige">
                  <Link
                    to="/product/$slug"
                    params={{
                      slug: product.slug,
                    }}
                    className="block h-full"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-stone" />
                      </div>
                    )}
                  </Link>

                  {/* Discount */}
                  {discount > 0 && (
                    <span className="absolute left-4 top-4 bg-[var(--brand-deep-forest-green)] px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-ivory">
                      −{discount}%
                    </span>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(product._id)
                    }
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-[var(--brand-deep-forest-green)] backdrop-blur transition-all duration-300 hover:bg-[var(--brand-deep-forest-green)] hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart
                        className="h-4 w-4"
                        fill="currentColor"
                      />
                    )}
                  </button>

                  {/* Add to cart */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          product._id
                        )
                      }
                      disabled={
                        isAdding ||
                        !product.inStock
                      }
                      className="flex w-full items-center justify-center gap-2 bg-[var(--brand-deep-forest-green)] py-3.5 text-[11px] font-medium tracking-[0.25em] uppercase text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Adding...
                        </>
                      ) : product.inStock ? (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add to Cart
                        </>
                      ) : (
                        "Out of Stock"
                      )}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      to="/product/$slug"
                      params={{
                        slug: product.slug,
                      }}
                      className="min-w-0"
                    >
                      <p className="mb-1.5 text-[10px] tracking-[0.3em] uppercase text-walnut">
                        {product.category}
                      </p>

                      <h2 className="font-display text-xl text-charcoal transition-colors hover:text-[var(--brand-deep-forest-green)]">
                        {product.name}
                      </h2>
                    </Link>

                    {typeof product.rating ===
                      "number" &&
                      product.rating > 0 && (
                        <div className="flex shrink-0 items-center gap-1 text-charcoal">
                          <Star
                            className="h-3.5 w-3.5 fill-walnut text-walnut"
                          />

                          <span className="text-xs">
                            {product.rating}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-lg font-medium text-charcoal">
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {discounted && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹
                        {product.compareAtPrice!.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}