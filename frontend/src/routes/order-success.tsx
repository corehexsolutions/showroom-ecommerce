import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderId } = Route.useSearch();

  return (
    <section className="min-h-[70vh] bg-[#F6F1EA] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <span className="text-2xl">✓</span>
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-charcoal/50">
          Order Confirmed
        </p>

        <h1 className="mt-3 font-display text-4xl text-charcoal">
          Thank You
        </h1>

        <p className="mt-5 text-sm leading-7 text-charcoal/60">
          Your payment was successful and your order has been
          confirmed.
        </p>

        {orderId && (
          <p className="mt-4 text-xs text-charcoal/50">
            Order ID: {orderId}
          </p>
        )}

        <Link
          to="/sofas"
          className="mt-8 inline-flex bg-charcoal px-7 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)]"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}