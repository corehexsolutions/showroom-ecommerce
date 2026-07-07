import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-luxury py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-display text-3xl leading-none">
              Decor<span className="italic text-beige-warm"> Den</span>
            </div>
            <p className="mt-5 text-sm text-ivory/70 leading-relaxed max-w-sm">
              A quiet atelier crafting heirloom sofas from responsibly sourced walnut,
              Italian leather and hand-loomed linens. Made slowly, meant for generations.
            </p>
            <div className="flex gap-3 mt-8">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="h-10 w-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-ivory hover:text-charcoal transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Collections"
            items={["L-Shape Sofas", "Fabric Sofas", "Leather Sofas", "Wooden Sofas", "Recliners", "Sectionals"]}
          />
          <FooterCol
            title="Customer Care"
            items={["Shipping & Delivery", "Returns", "Warranty", "Custom Orders", "Care Guide", "FAQ"]}
          />
          <FooterCol
            title="Atelier"
            items={["Our Story", "Craftsmanship", "Sustainability", "Press", "Trade Program", "Contact"]}
          />

          <div className="lg:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.3em] text-beige-warm mb-4">Visit</div>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Vellora Flagship<br />
              Vadodara,<br />
              Gujarat<br />
              390007
            </p>
            <a href="tel:+911234567890" className="mt-4 inline-block text-sm text-ivory hover:text-beige-warm transition-colors">
              +91 12345 67890
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} DecorDen. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-ivory transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-ivory transition-colors">Terms</Link>
            <Link to="/" className="hover:text-ivory transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="lg:col-span-2">
      <div className="text-[11px] uppercase tracking-[0.3em] text-beige-warm mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-sm text-ivory/70 hover:text-ivory transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
