import React, { useCallback, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Check,
  Loader2,
} from "lucide-react";

import Before from "../assets/Before.png";
import After from "../assets/After.png";

import { submitConsultation } from "@/lib/consultation";

interface SofaCompareSliderProps {
  luxuryImage?: string;
  nonLuxuryImage?: string;
}

interface Swatch {
  name: string;
  hex: string;
}

const swatches: Swatch[] = [
  { name: "Terracotta leather", hex: "#B4623A" },
  { name: "Ivory boucle", hex: "#EDE6D8" },
  { name: "Sage linen", hex: "#8A9678" },
  { name: "Charcoal velvet", hex: "#3A3A3C" },
];

export default function SofaCompareSlider({
  luxuryImage = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
  nonLuxuryImage = "https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=1200&auto=format&fit=crop",
}: SofaCompareSliderProps) {
  const [position, setPosition] = useState(50);
  const [active, setActive] = useState(0);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    sofaType: "",
    size: "",
    message: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const rafId = useRef<number | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, pct));

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setPosition(clamped);
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent) => {
    dragging.current = false;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear previous error when user edits the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // Send the form in the exact shape expected by consultation.ts
      await submitConsultation({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        sofaType: form.sofaType || undefined,
        approximateSize: form.size.trim() || undefined,
        description: form.message.trim(),
        selectedFinish: swatches[active].name,
      });

      setSubmitted(true);

      // Optional: reset form after successful submission
      setForm({
        name: "",
        phone: "",
        email: "",
        sofaType: "",
        size: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit consultation:", error);

      setError(
        "We couldn't submit your request right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (loading) return;

    setShowForm(false);
    setSubmitted(false);
    setError("");
  };

  return (
    <>
      <section className="w-full bg-[#f2ede6]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 md:px-12 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-16">
          {/* Text column */}
          <div className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:items-start lg:text-left">
            <h1 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              Bespoke Furniture
            </h1>

            <p className="max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
              Begin with inspiration, finish with a space that feels truly
              yours. From festive gatherings to quiet mornings, from playful
              kids to cozy evenings, every detail is made to live beautifully
              with you.
            </p>

            {/* Swatch picker */}
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <span className="text-xs uppercase tracking-wide text-stone-400">
                Pick a finish
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {swatches.map((swatch, i) => (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={swatch.name}
                    aria-pressed={active === i}
                    className={`h-8 w-8 rounded-full transition ${
                      active === i
                        ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-[#f2ede6]"
                        : "ring-1 ring-stone-300 hover:ring-stone-500"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>

              <span className="text-xs text-stone-500">
                {swatches[active].name}
              </span>
            </div>

            {/* Open form */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setError("");
                setShowForm(true);
              }}
              className="btn-primary-green"
            >
              Design yours in {swatches[active].name}
              <ArrowRight size={16} strokeWidth={2} className="text-white" />
            </button>
          </div>

          {/* Slider column */}
          <div
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="relative aspect-[4/3] w-full max-w-xl cursor-ew-resize touch-none select-none overflow-hidden rounded-lg shadow-md sm:aspect-[16/9] lg:mx-auto lg:max-w-none"
          >
            {/* Standard image */}
            <img
              src={Before}
              alt="Standard, non-luxury sofa"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />

            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white sm:bottom-4 sm:left-4 sm:px-3 sm:text-xs">
              Standard
            </span>

            {/* Bespoke image */}
            <div
              className="absolute inset-0 h-full w-full"
              style={{
                clipPath: `inset(0 ${100 - position}% 0 0)`,
              }}
            >
              <img
                src={After}
                alt="Luxury, handcrafted sofa"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />

              <span className="absolute bottom-3 left-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[10px] font-medium text-white sm:bottom-4 sm:left-4 sm:px-3 sm:text-xs">
                Bespoke
              </span>
            </div>

            {/* Divider + handle */}
            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[var(--brand-green-muted-dark)]/40"
              style={{ left: `${position}%` }}
            >
              <div className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
                <ChevronLeft
                  size={12}
                  strokeWidth={2.5}
                  className="text-[var(--brand-green-muted-dark)]"
                />
                <ChevronRight
                  size={12}
                  strokeWidth={2.5}
                  className="-ml-1 text-[var(--brand-green-muted-dark)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BESPOKE ENQUIRY MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loading) {
              closeModal();
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-[#f7f4ee] shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black/60 shadow-sm transition hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            {!submitted ? (
              <>
                {/* Modal header */}
                <div className="border-b border-black/10 px-6 py-8 sm:px-9">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                    Bespoke furniture
                  </p>

                  <h2 className="mt-3 pr-10 font-serif text-3xl sm:text-4xl">
                    Let's create your sofa.
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-black/55">
                    Tell us what you're looking for and our team will get in
                    touch with you to discuss your personalized sofa.
                  </p>

                  {/* Selected finish */}
                  <div className="mt-5 flex items-center gap-3">
                    <span
                      className="h-7 w-7 rounded-full ring-1 ring-black/10"
                      style={{
                        backgroundColor: swatches[active].hex,
                      }}
                    />

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-black/40">
                        Selected finish
                      </p>

                      <p className="mt-0.5 text-xs font-medium">
                        {swatches[active].name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-7 sm:px-9 sm:py-9"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-xs text-black/60">
                        Your name *
                      </label>

                      <input
                        required
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Enter your name"
                        className="h-12 w-full border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-xs text-black/60">
                        Phone number *
                      </label>

                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="+91 98765 43210"
                        className="h-12 w-full border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-black/60">
                        Email address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        placeholder="you@example.com"
                        className="h-12 w-full border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                      />
                    </div>

                    {/* Sofa type */}
                    <div>
                      <label className="mb-2 block text-xs text-black/60">
                        Sofa type
                      </label>

                      <select
                        name="sofaType"
                        value={form.sofaType}
                        onChange={handleFormChange}
                        className="h-12 w-full border border-black/10 bg-white/40 px-4 text-sm outline-none focus:border-[#3f6d25]"
                      >
                        <option value="">Select type</option>
                        <option value="2-seater">2 Seater</option>
                        <option value="3-seater">3 Seater</option>
                        <option value="4-seater">4 Seater</option>
                        <option value="l-shaped">L-Shaped</option>
                        <option value="sectional">Sectional</option>
                        <option value="sofa-set">Sofa Set</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="mb-2 block text-xs text-black/60">
                        Approximate size
                      </label>

                      <input
                        type="text"
                        name="size"
                        value={form.size}
                        onChange={handleFormChange}
                        placeholder="e.g. 8 ft × 3 ft"
                        className="h-12 w-full border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                      />
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-black/60">
                        Tell us about your sofa *
                      </label>

                      <textarea
                        required
                        name="message"
                        value={form.message}
                        onChange={handleFormChange}
                        rows={5}
                        placeholder="Tell us about the style, dimensions, room, colours, or any special requirements..."
                        className="w-full resize-none border border-black/10 bg-white/40 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                      />
                    </div>
                  </div>

                  {/* API Error */}
                  {error && (
                    <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-7 flex h-14 w-full items-center justify-center gap-3 bg-[#3f6d25] text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending enquiry...
                      </>
                    ) : (
                      <>
                        Request a consultation
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-[10px] leading-5 text-black/40">
                    Our team will contact you to discuss your design and
                    requirements.
                  </p>
                </form>
              </>
            ) : (
              /* SUCCESS STATE */
              <div className="px-6 py-16 text-center sm:px-10 sm:py-20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3f6d25]/10 text-[#3f6d25]">
                  <Check size={28} />
                </div>

                <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                  Consultation received
                </p>

                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Let's create something beautiful.
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/55">
                  Thank you for sharing your idea. Our team will get in touch
                  with you shortly to discuss your personalized sofa.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 inline-flex items-center gap-3 bg-[#3f6d25] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c]"
                >
                  Done
                  <Check size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}