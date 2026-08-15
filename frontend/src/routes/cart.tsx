import { createFileRoute } from '@tanstack/react-router'

import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/cart")({
    head: () => ({
        meta: [
            { title: "Shopping Cart — Decor Den" },
            {
                name: "description",
                content:
                    "Review your selected furniture and complete your purchase at Decor Den.",
            },
        ],
    }),
    component: CartPage,
});


function CartPage() {
    const items = useCartStore((state) => state.items);
    const increaseQuantity = useCartStore(
        (state) => state.increaseQuantity
    );
    const decreaseQuantity = useCartStore(
        (state) => state.decreaseQuantity
    );
    const removeItem = useCartStore((state) => state.removeItem);
    const subtotal = useCartStore((state) => state.getSubtotal());

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                        <ShoppingBag className="h-8 w-8 text-charcoal/60" />
                    </div>

                    <h1 className="font-display text-4xl text-charcoal">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-charcoal/60">
                        Discover our curated collection of furniture and find
                        something beautiful for your home.
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

    return (
        <section className="bg-[#F6F1EA] min-h-screen">
            {/* Header */}
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
                                (total, item) => total + item.quantity,
                                0
                            )}{" "}
                            items
                        </p>
                    </div>
                </div>
            </div>

            {/* Cart */}
            <div className="container-luxury py-10 md:py-16">
                <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

                    {/* Items */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <motion.div
                                layout
                                key={`${item.id}-${item.variant ?? ""}`}
                                className="bg-white p-4 md:p-6"
                            >
                                <div className="flex gap-5 md:gap-7">

                                    {/* Image */}
                                    <Link
                                        to="/product/$id"
                                        params={{ id: item.id }}
                                        className="block h-32 w-28 shrink-0 overflow-hidden bg-[#eee8df] md:h-44 md:w-36"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </Link>

                                    {/* Details */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                                        <div>
                                            <div className="flex justify-between gap-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
                                                        Decorden
                                                    </p>

                                                    <h2 className="mt-1 font-display text-xl text-charcoal md:text-2xl">
                                                        {item.name}
                                                    </h2>

                                                    {item.variant && (
                                                        <p className="mt-2 text-xs text-charcoal/50">
                                                            {item.variant}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label={`Remove ${item.name}`}
                                                    className="shrink-0 text-charcoal/40 transition-colors hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-end justify-between gap-4">

                                            {/* Quantity */}
                                            <div className="flex items-center border border-line">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decreaseQuantity(item.id)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:bg-[#F6F1EA]"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>

                                                <span className="flex h-9 w-10 items-center justify-center border-x border-line text-xs">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(item.id)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:bg-[#F6F1EA]"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="font-display text-lg text-charcoal">
                                                {formatPrice(
                                                    item.price * item.quantity
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
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
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <Link
                                to="/checkout"
                                className="mt-8 flex w-full items-center justify-center gap-3 bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)]"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>

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