"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductShowcase, { Product } from "@/components/ProductShowcase";

// ---------------------------------------------------------------------------
// Route: /product/[id]  ->  app/product/[id]/page.tsx
// Fetches the product by the id in the URL and renders the showcase.
// Swap the fetch URL / mapProduct() below to match your actual API shape.
// ---------------------------------------------------------------------------

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);

  if (!res.ok) {
    throw new Error(`Product not found (status ${res.status})`);
  }

  const data = await res.json();
  return mapProduct(data);
}

// Adapt your backend's response shape to the Product type ProductShowcase expects.
function mapProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    compareAtPrice: data.compare_at_price ?? undefined,
    currency: data.currency ?? "INR",
    images: data.images ?? [],
    variantLabel: data.variant_label ?? "Size",
    variants: (data.variants ?? []).map((v: any) => ({
      id: v.id,
      label: v.label,
      price: v.price ?? undefined,
      inStock: v.in_stock ?? true,
    })),
    badges: data.badges ?? [
      { icon: "🚚", title: "Free Delivery and Installation", subtitle: "No hidden cost" },
      { icon: "🛡", title: "Manufacturing Warranty", subtitle: "5 yrs Manufacturing Warranty" },
      { icon: "🎯", title: "Made on Orders only", subtitle: "Customisable in every aspect" },
    ],
    accordion: data.accordion ?? [],
    inStock: data.in_stock ?? true,
  };
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProduct(productId)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = async (payload: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // e.g. toast.success("Added to cart") / open cart drawer
    } catch {
      // e.g. toast.error("Couldn't add to cart, try again")
    }
  };

  const handleBuyNow = async (payload: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) => {
    await handleAddToCart(payload);
    window.location.href = "/checkout";
  };

  return (
    <ProductShowcase
      product={product}
      loading={loading}
      error={error}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  );
}