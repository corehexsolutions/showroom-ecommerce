import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard, type Product } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getAllProducts } from "@/lib/product";

export const Route = createFileRoute("/curtains")({
  head: () => ({
    meta: [
      {
        title: "Curtains — Decorden",
      },
      {
        name: "description",
        content:
          "Explore Decorden's collection of elegant curtains designed to bring warmth, privacy and timeless style to your home.",
      },
    ],
  }),
  component: CurtainsPage,
});

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  category: string;
  tags?: string[];

  price: number;
  compareAtPrice?: number;
  currency?: string;

  images?: {
    url: string;
    public_id: string;
  }[];

  variants?: {
    label: string;
    sku?: string;
    price?: number;
    inStock?: boolean;
    stockQuantity?: number;
  }[];

  rating?: number;
  reviewCount?: number;

  inStock?: boolean;
  totalStock?: number;
  isActive?: boolean;
};

function mapProduct(product: ApiProduct): Product {
  return {
    id: product._id,
    slug: product.slug,

    name: product.name,

    // Example:
    // tags: ["Linen", "Blackout"]
    // => "Linen · Blackout"
    category:
      product.tags && product.tags.length > 0
        ? product.tags.join(" · ")
        : product.category,

    image:
      product.images?.[0]?.url ||
      "/placeholder-product.jpg",

    price: product.price,

    original:
      product.compareAtPrice ?? product.price,

    rating: product.rating ?? 0,

    reviews: product.reviewCount ?? 0,
  };
}

function CurtainsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurtains = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllProducts();

        console.log("Curtains API response:", response);

        /*
         * Supports:
         *
         * [...]
         *
         * OR
         *
         * { products: [...] }
         *
         * OR
         *
         * { data: [...] }
         */

        const apiProducts: ApiProduct[] = Array.isArray(response)
          ? response
          : response?.products ||
            response?.data ||
            [];

        const curtainProducts = apiProducts
          .filter(
            (product) =>
              product.isActive !== false
          )
          .filter(
            (product) =>
              product.category?.toLowerCase() ===
              "curtains"
          )
          .map(mapProduct);

        setProducts(curtainProducts);
      } catch (err) {
        console.error(
          "Failed to fetch curtains:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load curtains."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurtains();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container-luxury">

        <SectionHeader
          eyebrow="Curtains"
          title="Windows dressed in |elegance|."
          subtitle="Discover refined curtains crafted to soften your spaces, frame your windows and elevate your interiors."
        />

        {/* Loading */}
        {loading && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />

                <div className="mt-5 h-3 w-28 bg-gray-200 rounded" />

                <div className="mt-3 h-5 w-48 bg-gray-200 rounded" />

                <div className="mt-4 h-5 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-16 text-center">
            <p className="text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-gray-500">
                No curtains are currently available.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}