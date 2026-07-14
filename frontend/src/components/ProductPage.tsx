import { useEffect, useState } from "react";
import ProductShowcase, { Product } from "@/components/Productshowcase";
import api from "@/lib/axios";
import { useParams } from "@tanstack/react-router";


async function fetchProduct(id: string): Promise<Product> {
    try {
        const res = await api.get(`/products/${id}`);

        return mapProduct(res.data);
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            `Product not found (status ${error.response?.status})`
        );
    }
}

// Adapt your backend's response shape to the Product type ProductShowcase expects.
function mapProduct(data: any): Product {
    const product = data.product;

    return {
        id: product._id,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency || "INR",

        images: product.images.map((img: any) => ({
            url: img.url,
            public_id: img.public_id,
        })),

        variantLabel: product.variantLabel || "Fabric",

        variants: (product.variants || []).map((v: any) => ({
            id: v.sku, // or v._id if you add one later
            label: v.label,
            price: v.price,
            inStock: v.inStock,
            stockQuantity: v.stockQuantity,
        })),

        badges: product.badges || [
            {
                icon: "🚚",
                title: "Free Delivery and Installation",
                subtitle: "No hidden cost",
            },
            {
                icon: "🛡️",
                title: "Manufacturing Warranty",
                subtitle: "5 yrs Manufacturing Warranty",
            },
            {
                icon: "🎯",
                title: "Made on Orders only",
                subtitle: "Customisable in every aspect",
            },
        ],

        accordion: product.accordion || [],

        inStock: product.inStock,
    };
}

export default function ProductPage() {
    const { id: productId } = useParams({
        from: "/product/$id/",
    });

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