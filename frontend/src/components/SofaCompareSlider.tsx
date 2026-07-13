import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface SofaCompareSliderProps {
  luxuryImage?: string;
  nonLuxuryImage?: string;
}

export default function SofaCompareSlider({
  luxuryImage = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
  nonLuxuryImage = "https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=1200&auto=format&fit=crop",
}: SofaCompareSliderProps) {
  const [position, setPosition] = useState(50); // % from left, luxury side revealed up to here
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

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

  const [active, setActive] = useState(0);

  return (
    <section className="w-full bg-[#f2ede6] py-8 sm:py-10 lg:py-12 flex flex-col lg:flex-row items-center justify-center">
      <div className="flex w-full flex-col justify-center gap-5 sm:gap-6 px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 lg:py-16 text-center ">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-stone-900">
          Bespoke Furniture
        </h1>

        <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-stone-600">
          Begin with inspiration, finish with a space that feels truly yours.
          From festive gatherings to quiet mornings, from playful kids to cozy
          evenings, every detail is made to live beautifully with you.
        </p>

        {/* Live swatch picker — a small taste of customization, not just a claim */}
        <div className="mx-auto flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-stone-400">
            Pick a finish
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {swatches.map((swatch, i) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={swatch.name}
                aria-pressed={active === i}
                className={`h-8 w-8 rounded-full transition ${active === i
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

        {/* Single, purposeful CTA — carries the selected finish forward */}
        <button
          type="button"
          className="mx-auto mt-2 flex items-center gap-2 rounded-md bg-stone-900 px-5 sm:px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          Design yours in {swatches[active].name}
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>

      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative mx-auto mt-8 lg:mt-0 aspect-[16/9] w-[92%] sm:w-full max-w-3xl select-none overflow-hidden rounded-lg shadow-md lg:-left-20"
      >
        {/* Non-luxury (base layer, full width) */}
        <img
          src={nonLuxuryImage}
          alt="Standard, non-luxury sofa"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 rounded-full bg-black/60 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-white">
          Standard
        </span>

        {/* Luxury (clipped layer, revealed left of the handle) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={luxuryImage}
            alt="Luxury, handcrafted sofa"
            className="h-full object-cover"
            style={{
              width: containerWidth ? `${containerWidth}px` : "100%",
              maxWidth: "none",
            }}
            draggable={false}
          />

          <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 rounded-full bg-stone-900/80 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-white">
            Bespoke
          </span>
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white/90"
          style={{ left: `${position}%` }}
        >
          <div
            onPointerDown={onPointerDown}
            className="absolute top-1/2 flex h-8 w-8 sm:h-9 sm:w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-md"
          >
            <ChevronLeft
              size={12}
              strokeWidth={2.5}
              className="text-stone-700"
            />
            <ChevronRight
              size={12}
              strokeWidth={2.5}
              className="-ml-1 text-stone-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}