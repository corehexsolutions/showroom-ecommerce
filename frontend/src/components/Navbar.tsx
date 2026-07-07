import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "Sofas", to: "/sofas" },
  { label: "Furniture", to: "/sofas" },
  { label: "Curtains", to: "/sofas" },
  { label: "Clothes", to: "/sofas" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <div className="bg-charcoal text-ivory text-[11px] tracking-[0.25em] uppercase py-2.5 text-center font-light">
        Complimentary white-glove delivery on orders above ₹75,000
      </div>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
          borderColor: scrolled ? "var(--color-line)" : "transparent",
          paddingTop: scrolled ? 12 : 20,
          paddingBottom: scrolled ? 12 : 20,
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 border-b backdrop-blur-lg"
      >
        <div className="container-luxury flex items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <div className="font-display text-2xl md:text-[26px] tracking-tight text-charcoal leading-none">
              Decor<span className="italic text-walnut"> Den</span>
            </div>
            <div className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground mt-1">
              Sofa Atelier
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="text-[12px] tracking-[0.2em] uppercase text-charcoal/80 hover:text-walnut transition-colors relative group"
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-walnut transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <IconBtn ariaLabel="Search"><Search className="h-[18px] w-[18px]" /></IconBtn>
            <IconBtn ariaLabel="Wishlist"><Heart className="h-[18px] w-[18px]" /></IconBtn>
            <IconBtn ariaLabel="Account"><User className="h-[18px] w-[18px]" /></IconBtn>
            <IconBtn ariaLabel="Cart" badge={2}><ShoppingBag className="h-[18px] w-[18px]" /></IconBtn>
            <button
              className="lg:hidden ml-1 p-2 text-charcoal"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.4 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-ivory p-8 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-2xl">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-display py-3 border-b border-line text-charcoal hover:text-walnut transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  children,
  ariaLabel,
  badge,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  badge?: number;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="relative p-2.5 text-charcoal hover:text-walnut transition-colors"
    >
      {children}
      {badge != null && (
        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-walnut text-ivory text-[9px] font-medium flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
