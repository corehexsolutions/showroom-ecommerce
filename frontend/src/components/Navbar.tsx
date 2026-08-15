import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "@/stores/authStore";

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
  const [accountOpen, setAccountOpen] = useState(false);

  const navigate = useNavigate();

  // Zustand
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);

    on();

    window.addEventListener("scroll", on, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", on);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate({ to: "/login" });
  };

  return (
    <>
      {/* Top announcement */}
      <div className="bg-charcoal text-ivory text-[11px] tracking-[0.25em] uppercase py-2.5 text-center font-light">
        Complimentary white-glove delivery on orders above ₹75,000
      </div>

      {/* Navbar */}
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,1)",
          borderColor: scrolled
            ? "var(--color-line)"
            : "transparent",
          paddingTop: scrolled ? 12 : 20,
          paddingBottom: scrolled ? 12 : 20,
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 border-b backdrop-blur-lg"
      >
        <div className="container-luxury flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="Decor Den"
              className="h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                activeOptions={{
                  exact: l.to === "/",
                }}
                className="text-[12px] tracking-[0.2em] uppercase text-charcoal/80 hover:text-walnut transition-colors relative group"
              >
                {l.label}

                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[var(--brand-green-muted)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Search */}
            {/* 
            <IconBtn ariaLabel="Search">
              <Search className="h-[18px] w-[18px]" />
            </IconBtn>
            */}

            {/* Wishlist */}
            <IconBtn ariaLabel="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </IconBtn>

            {/* Account */}
            <div className="relative">
              <button
                type="button"
                aria-label="Account"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate({ to: "/login" });
                    return;
                  }

                  setAccountOpen((prev) => !prev);
                }}
                className="relative p-2.5 text-charcoal hover:text-walnut transition-colors"
              >
                <User className="h-[18px] w-[18px]" />

                {/* Logged-in indicator */}
                {isAuthenticated && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[var(--brand-green-muted)]" />
                )}
              </button>

              {/* Account Dropdown */}
              <AnimatePresence>
                {isAuthenticated && accountOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white border border-line shadow-xl z-[70]"
                  >
                    {/* User Information */}
                    <div className="px-5 py-4 border-b border-line">
                      <p className="text-sm font-medium text-charcoal">
                        {user?.name}
                      </p>

                      <p className="text-xs text-charcoal/60 mt-1 truncate">
                        {user?.email}
                      </p>

                      <span className="inline-block mt-3 text-[9px] uppercase tracking-[0.18em] px-2 py-1 bg-[var(--brand-green-muted)]/10 text-[var(--brand-green-muted)]">
                        {user?.role}
                      </span>
                    </div>

                    {/* Account Links */}
                    <div className="p-2">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm text-charcoal hover:bg-ivory transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-charcoal hover:bg-ivory transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <IconBtn
              ariaLabel="Cart"
              badge={2}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
            </IconBtn>

            {/* Mobile Menu */}
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

      {/* Mobile Menu */}
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
              transition={{
                type: "tween",
                ease: [0.2, 0.8, 0.2, 1],
                duration: 0.4,
              }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-ivory p-8 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-2xl">
                  Menu
                </span>

                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Account */}
              {isAuthenticated ? (
                <div className="mb-8 pb-6 border-b border-line">
                  <p className="text-lg font-display text-charcoal">
                    {user?.name}
                  </p>

                  <p className="text-xs text-charcoal/60 mt-1">
                    {user?.email}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-2 text-sm text-charcoal hover:text-walnut"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mb-8 pb-6 border-b border-line">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-display text-charcoal"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Navigation */}
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