import { ArrowRight } from "lucide-react";

export type CheckoutItem = {
  id: string;
  name: string;
  image?: string | null;
  price: number;
  quantity: number;
  variant?: string | null;
};

type OrderSummaryProps = {
  items: CheckoutItem[];
  shipping?: number;
  total?: number;
  showButton?: boolean;
  buttonText?: string;
  loading?: boolean;
  onContinue?: () => void;
};

export function OrderSummary({
  items,
  shipping = 0,
  total,
  showButton = false,
  buttonText = "Continue to Payment",
  loading = false,
  onContinue,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const finalTotal =
    total !== undefined
      ? total
      : subtotal + shipping;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="bg-[#F6F1EA] p-5 md:p-6">
      <h3 className="font-display text-2xl text-charcoal">
        Order Summary
      </h3>

      {/* ITEMS */}
      <div className="mt-5 max-h-60 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.variant || ""}`}
            className="flex gap-3"
          >
            {/* IMAGE */}
            {item.image && (
              <div className="h-16 w-14 shrink-0 overflow-hidden bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* DETAILS */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-charcoal">
                {item.name}
              </p>

              {item.variant && (
                <p className="mt-1 text-xs text-charcoal/50">
                  {item.variant}
                </p>
              )}

              <p className="mt-1 text-xs text-charcoal/50">
                Qty: {item.quantity}
              </p>
            </div>

            {/* PRICE */}
            <p className="shrink-0 text-sm text-charcoal">
              {formatPrice(
                item.price * item.quantity
              )}
            </p>
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div className="mt-6 space-y-3 border-t border-line pt-5">
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
            {shipping === 0
              ? "Complimentary"
              : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {/* FINAL TOTAL */}
      <div className="mt-5 flex justify-between border-t border-line pt-5">
        <span className="text-xs uppercase tracking-[0.15em] text-charcoal">
          Total
        </span>

        <span className="font-display text-2xl text-charcoal">
          {formatPrice(finalTotal)}
        </span>
      </div>

      {/* BUTTON */}
      {showButton && (
        <button
          type="button"
          disabled={loading}
          onClick={onContinue}
          className="mt-6 flex w-full items-center justify-center gap-3 bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : buttonText}

          {!loading && (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}