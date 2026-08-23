import { useState } from "react";
import { X, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShippingForm,
  ShippingAddress,
} from "./ShippingForm";

import {
  OrderSummary,
  CheckoutItem,
} from "./OrderSummary";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;

  items: CheckoutItem[];

  subtotal: number;
  shipping?: number;
  total: number;

  onSubmit: (
    shippingAddress: ShippingAddress
  ) => Promise<void>;

  loading?: boolean;
};

export function CheckoutModal({
  open,
  onClose,
  items,
  subtotal,
  shipping = 0,
  total,
  onSubmit,
  loading = false,
}: CheckoutModalProps) {
  const [step, setStep] = useState<
    "shipping" | "summary"
  >("shipping");

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  const handleShippingSubmit = (
    address: ShippingAddress
  ) => {
    setShippingAddress(address);
    setStep("summary");
  };

  const handleBack = () => {
    if (loading) return;

    setStep("shipping");
  };

  const handlePayment = async () => {
    if (!shippingAddress || loading) return;

    await onSubmit(shippingAddress);
  };

  const handleClose = () => {
    if (loading) return;

    setStep("shipping");
    setShippingAddress(null);

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6"
          >
            <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">
              {/* HEADER */}
              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4 md:px-8 md:py-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal/45">
                    Decor Den
                  </p>

                  <h2 className="mt-1 font-display text-2xl text-charcoal md:text-3xl">
                    Checkout
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center text-charcoal/50 transition-colors hover:bg-[#F6F1EA] hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Close checkout"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* STEP INDICATOR */}
              <div className="flex shrink-0 border-b border-line px-5 md:px-8">
                <div
                  className={`flex flex-1 items-center gap-3 border-b-2 py-4 ${
                    step === "shipping"
                      ? "border-[var(--brand-deep-forest-green)]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      step === "shipping"
                        ? "bg-[var(--brand-deep-forest-green)] text-ivory"
                        : "bg-[#F6F1EA] text-charcoal/50"
                    }`}
                  >
                    1
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.18em]">
                    Shipping
                  </span>
                </div>

                <div
                  className={`flex flex-1 items-center gap-3 border-b-2 py-4 ${
                    step === "summary"
                      ? "border-[var(--brand-deep-forest-green)]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      step === "summary"
                        ? "bg-[var(--brand-deep-forest-green)] text-ivory"
                        : "bg-[#F6F1EA] text-charcoal/50"
                    }`}
                  >
                    2
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.18em]">
                    Review
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-[1fr_360px]">
                  {/* LEFT */}
                  <div className="p-5 md:p-8">
                    {step === "shipping" ? (
                      <>
                        <div className="mb-7">
                          <h3 className="font-display text-2xl text-charcoal">
                            Shipping Address
                          </h3>

                          <p className="mt-2 text-xs leading-5 text-charcoal/50">
                            Enter the address where you'd
                            like your order delivered.
                          </p>
                        </div>

                        <ShippingForm
                          onSubmit={
                            handleShippingSubmit
                          }
                          loading={loading}
                        />
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={loading}
                          className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-charcoal/50 transition-colors hover:text-charcoal disabled:opacity-40"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Edit Shipping Details
                        </button>

                        <h3 className="font-display text-2xl text-charcoal">
                          Delivery Details
                        </h3>

                        {shippingAddress && (
                          <div className="mt-5 border border-line bg-white p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-charcoal">
                                  {
                                    shippingAddress.name
                                  }
                                </p>

                                <p className="mt-2 text-sm leading-6 text-charcoal/60">
                                  {
                                    shippingAddress.addressLine1
                                  }
                                  <br />

                                  {shippingAddress.addressLine2 && (
                                    <>
                                      {
                                        shippingAddress.addressLine2
                                      }
                                      <br />
                                    </>
                                  )}

                                  {
                                    shippingAddress.city
                                  }
                                  ,{" "}
                                  {
                                    shippingAddress.state
                                  }{" "}
                                  {
                                    shippingAddress.postalCode
                                  }
                                  <br />

                                  {
                                    shippingAddress.country
                                  }
                                </p>
                              </div>

                              <div className="text-right text-xs text-charcoal/50">
                                <p>
                                  {
                                    shippingAddress.phone
                                  }
                                </p>

                                <p className="mt-1 break-all">
                                  {
                                    shippingAddress.email
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* MOBILE PAYMENT BUTTON */}
                        <button
                          type="button"
                          onClick={handlePayment}
                          disabled={loading}
                          className="mt-7 flex w-full items-center justify-center bg-[var(--brand-deep-forest-green)] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
                        >
                          {loading
                            ? "Processing..."
                            : "Continue to Payment"}
                        </button>
                      </>
                    )}
                  </div>

                  {/* RIGHT SUMMARY */}
                  <div className="border-t border-line bg-[#F6F1EA] p-5 md:p-8 lg:border-l lg:border-t-0">
                    <OrderSummary
                      items={items}
                      shipping={shipping}
                      total={total}
                    />

                    {step === "summary" && (
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={loading}
                        className="mt-4 hidden w-full items-center justify-center bg-[var(--brand-deep-forest-green)] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                      >
                        {loading
                          ? "Processing..."
                          : "Continue to Payment"}
                      </button>
                    )}

                    <div className="mt-5 flex items-start gap-3 border-t border-line pt-5">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-green-muted)]" />

                      <p className="text-[10px] leading-5 text-charcoal/50">
                        Your payment is securely processed
                        through Razorpay. Your card and payment
                        information is never stored by Decor Den.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}