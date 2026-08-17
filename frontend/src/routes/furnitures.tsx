import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard, type Product } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getAllProducts } from "@/lib/product";

export const Route = createFileRoute("/furnitures")({
  head: () => ({
    meta: [
      {
        title: "Furniture — Decorden",
      },
      {
        name: "description",
        content:
          "Explore Decorden's collection of luxury furniture crafted for elegant and timeless interiors.",
      },
    ],
  }),
  component: FurniturePage,
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
    // tags: ["Wooden", "Dining"]
    // => "Wooden · Dining"
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

function FurniturePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllProducts();

        console.log("Furniture API response:", response);

        /*
         * Your API may return:
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

        const furnitureProducts = apiProducts
          .filter(
            (product) =>
              product.isActive !== false
          )
          .filter(
            (product) =>
              product.category?.toLowerCase() ===
              "furniture"
          )
          .map(mapProduct);

        setProducts(furnitureProducts);
      } catch (err) {
        console.error(
          "Failed to fetch furniture:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load furniture."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container-luxury">

        <SectionHeader
          eyebrow="Furniture"
          title="Furniture for |refined| living."
          subtitle="Discover timeless furniture pieces designed to bring warmth, character and elegance to your home."
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
                No furniture is currently available.
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