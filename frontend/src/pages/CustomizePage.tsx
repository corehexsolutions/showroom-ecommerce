import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Ruler,
  Sofa,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

type Finish = {
  id: string;
  name: string;
  color: string;
};

const finishes: Finish[] = [
  {
    id: "terracotta",
    name: "Terracotta Leather",
    color: "#B76538",
  },
  {
    id: "cream",
    name: "Natural Cream",
    color: "#E8E0D0",
  },
  {
    id: "olive",
    name: "Soft Olive",
    color: "#8C987B",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    color: "#34363A",
  },
];

const sizes = [
  {
    id: "2-seater",
    title: "2 Seater",
    description: "Compact & intimate",
    price: 85000,
  },
  {
    id: "3-seater",
    title: "3 Seater",
    description: "Perfect for everyday living",
    price: 110000,
  },
  {
    id: "4-seater",
    title: "4 Seater",
    description: "Made for larger spaces",
    price: 145000,
  },
];

const legOptions = [
  {
    id: "wood",
    name: "Natural Wood",
    color: "#9A6D47",
  },
  {
    id: "dark-wood",
    name: "Dark Walnut",
    color: "#493528",
  },
  {
    id: "black",
    name: "Matte Black",
    color: "#242424",
  },
];

export default function CustomizePage() {
  const [finish, setFinish] = useState("terracotta");
  const [size, setSize] = useState("3-seater");
  const [leg, setLeg] = useState("wood");
  const [quantity, setQuantity] = useState(1);

  const selectedFinish = finishes.find((item) => item.id === finish)!;
  const selectedSize = sizes.find((item) => item.id === size)!;

  const total = useMemo(() => {
    return selectedSize.price * quantity;
  }, [selectedSize, quantity]);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f4ee]/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-black/60 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to collection
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="font-serif text-2xl tracking-tight">
              Decorden
            </span>
          </div>

          <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/45 sm:flex">
            <Sparkles size={15} />
            Bespoke Collection
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-black/10 bg-[#f7f4ee]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-black/45">
          <span className="font-medium text-[#3f6d25]">01 Customize</span>
          <span className="h-px w-8 bg-black/15" />
          <span>02 Review</span>
          <span className="h-px w-8 bg-black/15" />
          <span>03 Checkout</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* LEFT — Product Preview */}
          <section className="lg:sticky lg:top-[110px] lg:self-start">
            <div className="relative overflow-hidden rounded-[4px] bg-[#ded7ca]">
              {/* Product image area */}
              <div
                className="relative aspect-[1/0.82] overflow-hidden"
                style={{
                  background: `linear-gradient(
                    145deg,
                    ${selectedFinish.color}22 0%,
                    #e8e1d5 48%,
                    #d4c9ba 100%
                  )`,
                }}
              >
                {/* Decorative room */}
                <div className="absolute inset-0">
                  <div className="absolute left-[7%] top-[10%] h-[55%] w-[32%] border border-black/5 bg-[#ebe5da]" />
                  <div className="absolute left-[13%] top-[16%] h-[40%] w-[20%] bg-[#f4f0e8]" />
                  <div className="absolute right-[8%] top-0 h-full w-[2px] bg-black/5" />
                  <div className="absolute right-[27%] top-0 h-full w-[1px] bg-black/5" />
                </div>

                {/* Sofa */}
                <div className="absolute bottom-[17%] left-[12%] right-[10%]">
                  {/* Back */}
                  <div
                    className="mx-auto h-[100px] w-[83%] rounded-[35px_35px_12px_12px] shadow-[0_20px_35px_rgba(0,0,0,0.14)] sm:h-[125px]"
                    style={{ backgroundColor: selectedFinish.color }}
                  />

                  {/* Seat */}
                  <div
                    className="relative mx-auto -mt-3 h-[80px] w-[90%] rounded-[18px] shadow-[0_20px_30px_rgba(0,0,0,0.18)] sm:h-[100px]"
                    style={{
                      backgroundColor: selectedFinish.color,
                    }}
                  >
                    <div className="absolute inset-x-[8%] top-[10%] h-px bg-white/20" />

                    {/* Cushions */}
                    <div className="absolute left-[8%] top-[12%] h-[58%] w-[25%] rounded-[15px] bg-white/10" />
                    <div className="absolute left-[37%] top-[12%] h-[58%] w-[25%] rounded-[15px] bg-white/10" />
                    <div className="absolute right-[8%] top-[12%] h-[58%] w-[25%] rounded-[15px] bg-white/10" />
                  </div>

                  {/* Legs */}
                  <div
                    className="absolute bottom-[-23px] left-[13%] h-[32px] w-[10px] rotate-[8deg] rounded-full"
                    style={{
                      backgroundColor:
                        leg === "wood"
                          ? "#9A6D47"
                          : leg === "dark-wood"
                            ? "#493528"
                            : "#242424",
                    }}
                  />
                  <div
                    className="absolute bottom-[-23px] right-[13%] h-[32px] w-[10px] -rotate-[8deg] rounded-full"
                    style={{
                      backgroundColor:
                        leg === "wood"
                          ? "#9A6D47"
                          : leg === "dark-wood"
                            ? "#493528"
                            : "#242424",
                    }}
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] shadow-sm backdrop-blur">
                  Bespoke
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                  Your creation
                </p>
                <h2 className="mt-1 font-serif text-3xl">
                  The Bespoke Sofa
                </h2>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                  From
                </p>
                <p className="mt-1 text-lg font-medium">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT — Configuration */}
          <section>
            <div className="max-w-[620px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                Design your own
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">
                Make it uniquely yours.
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-black/60">
                Choose the details that make your furniture feel at home.
                Every piece is crafted to order with carefully selected
                materials and finishes.
              </p>

              {/* Finish */}
              <div className="mt-10 border-t border-black/10 pt-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
                      01 — Choose a finish
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {selectedFinish.name}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-5">
                  {finishes.map((item) => {
                    const active = finish === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFinish(item.id)}
                        className="group flex flex-col items-center gap-2"
                        aria-label={item.name}
                      >
                        <span
                          className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                            active
                              ? "border-[#171717]"
                              : "border-transparent"
                          }`}
                        >
                          <span
                            className="h-9 w-9 rounded-full shadow-inner"
                            style={{ backgroundColor: item.color }}
                          />

                          {active && (
                            <span className="absolute inset-0 m-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/90">
                              <Check size={11} />
                            </span>
                          )}
                        </span>

                        <span className="text-[10px] text-black/55">
                          {item.name.replace(" Leather", "")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div className="mt-8 border-t border-black/10 pt-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
                  02 — Choose your size
                </p>

                <div className="mt-5 grid gap-3">
                  {sizes.map((item) => {
                    const active = size === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSize(item.id)}
                        className={`flex items-center justify-between rounded-sm border p-4 text-left transition ${
                          active
                            ? "border-[#3f6d25] bg-[#3f6d25]/5"
                            : "border-black/10 bg-white/30 hover:border-black/25"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              active
                                ? "border-[#3f6d25] bg-[#3f6d25] text-white"
                                : "border-black/20"
                            }`}
                          >
                            {active && <Check size={11} />}
                          </span>

                          <div>
                            <p className="text-sm font-medium">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-black/45">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-medium">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legs */}
              <div className="mt-8 border-t border-black/10 pt-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
                  03 — Choose the legs
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {legOptions.map((item) => {
                    const active = leg === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLeg(item.id)}
                        className={`rounded-sm border p-4 text-center transition ${
                          active
                            ? "border-[#3f6d25] bg-[#3f6d25]/5"
                            : "border-black/10 bg-white/30 hover:border-black/25"
                        }`}
                      >
                        <span
                          className="mx-auto block h-8 w-8 rounded-full shadow-inner"
                          style={{ backgroundColor: item.color }}
                        />

                        <span className="mt-3 block text-xs text-black/65">
                          {item.name}
                        </span>

                        {active && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#3f6d25]">
                            <Check size={10} />
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-8 border-t border-black/10 pt-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
                      04 — Quantity
                    </p>
                  </div>

                  <div className="flex items-center border border-black/15 bg-white/30">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      className="p-3 transition hover:bg-black/5"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-10 text-center text-sm">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQuantity((value) => value + 1)}
                      className="p-3 transition hover:bg-black/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom dimensions */}
              <div className="mt-8 flex items-start gap-4 border border-black/10 bg-white/30 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3f6d25]/10 text-[#3f6d25]">
                  <Ruler size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Need custom dimensions?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-black/50">
                    Tell us the exact dimensions of your space and our design
                    team will create the perfect fit.
                  </p>

                  <button
                    type="button"
                    className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#3f6d25] underline underline-offset-4"
                  >
                    Request custom dimensions
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 border-t border-black/15 pt-7">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/45">
                      Estimated total
                    </p>
                    <p className="mt-2 font-serif text-3xl">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right text-xs text-black/45">
                    <p>{selectedSize.title}</p>
                    <p className="mt-1">{selectedFinish.name}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 flex h-14 w-full items-center justify-center gap-3 bg-[#3f6d25] text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c]"
                >
                  Continue to review
                  <ArrowRight size={16} />
                </button>

                <p className="mt-4 text-center text-[10px] leading-5 text-black/40">
                  Your piece is made to order. Final pricing may vary for
                  custom dimensions or special materials.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom reassurance */}
      <div className="border-t border-black/10 bg-[#eee9df]">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-6 py-8 sm:grid-cols-3 lg:px-10">
          <div className="flex gap-4">
            <Sofa size={19} className="mt-0.5 shrink-0 text-[#3f6d25]" />
            <div>
              <p className="text-xs font-medium">Made to order</p>
              <p className="mt-1 text-[11px] leading-5 text-black/45">
                Crafted specifically for your space.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Sparkles
              size={19}
              className="mt-0.5 shrink-0 text-[#3f6d25]"
            />
            <div>
              <p className="text-xs font-medium">Premium materials</p>
              <p className="mt-1 text-[11px] leading-5 text-black/45">
                Carefully selected fabrics and finishes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Ruler size={19} className="mt-0.5 shrink-0 text-[#3f6d25]" />
            <div>
              <p className="text-xs font-medium">Designed around you</p>
              <p className="mt-1 text-[11px] leading-5 text-black/45">
                Custom dimensions available on request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}