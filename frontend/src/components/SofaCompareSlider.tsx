import React, { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
  const [position, setPosition] = useState(50); // % from left, luxury side revealed up to here
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const rafId = useRef<number | null>(null);

  // clamp + update from a clientX, using rAF so we never fall behind the finger/pointer
  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, pct));

    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => setPosition(clamped));
  }, []);

  // Drag can start ANYWHERE on the image, not just on the tiny handle.
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

  return (
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

          {/* Live swatch picker */}
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

          <button
            type="button"
            className="btn-primary-green"
          >
            Design yours in {swatches[active].name}
            <ArrowRight size={16} strokeWidth={2} className="text-ivory]"/>
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
          {/* Non-luxury base layer, always fills the box */}
          <img
            src={nonLuxuryImage}
            alt="Standard, non-luxury sofa"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white sm:bottom-4 sm:left-4 sm:px-3 sm:text-xs">
            Standard
          </span>

          {/* Luxury layer, revealed via clip-path. Compositor-only, so it
              tracks the pointer smoothly even on lower-powered devices. */}
          <div
            className="absolute inset-0 h-full w-full"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src={luxuryImage}
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
              <ChevronLeft size={12} strokeWidth={2.5} className="text-[var(--brand-green-muted-dark)]" />
              <ChevronRight size={12} strokeWidth={2.5} className="-ml-1 text-[var(--brand-green-muted-dark)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}