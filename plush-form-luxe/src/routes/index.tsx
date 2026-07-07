import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  Hammer,
  Wrench,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  Instagram,
} from "lucide-react";

import hero from "@/assets/hero-living.jpg";
import sofa1 from "@/assets/sofa-1.jpg";
import sofa2 from "@/assets/sofa-2.jpg";
import sofa3 from "@/assets/sofa-3.jpg";
import sofa4 from "@/assets/sofa-4.jpg";
import sofa5 from "@/assets/sofa-5.jpg";
import sofa6 from "@/assets/sofa-6.jpg";
import colL from "@/assets/col-lshape.jpg";
import colFabric from "@/assets/col-fabric.jpg";
import colLeather from "@/assets/col-leather.jpg";
import colWood from "@/assets/col-wooden.jpg";
import colRecliner from "@/assets/col-recliner.jpg";
import colSectional from "@/assets/col-sectional.jpg";
import banner from "@/assets/feature-banner.jpg";
import craft from "@/assets/craft.jpg";
import lifestyle from "@/assets/lifestyle-1.jpg";
import gal1 from "@/assets/gal-1.jpg";
import gal2 from "@/assets/gal-2.jpg";
import gal3 from "@/assets/gal-3.jpg";
import gal4 from "@/assets/gal-4.jpg";
import gal5 from "@/assets/gal-5.jpg";
import gal6 from "@/assets/gal-6.jpg";
import r1 from "@/assets/review-1.jpg";
import r2 from "@/assets/review-2.jpg";
import r3 from "@/assets/review-3.jpg";

import { ProductCard, type Product } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: hero, fetchpriority: "high" } as any],
  }),
  component: Home,
});

const bestSellers: Product[] = [
  { id: "1", name: "Aurelia Linen Sofa", category: "Fabric · 3 Seater", image: sofa1, price: 129000, original: 165000, rating: 4.9, reviews: 128 },
  { id: "2", name: "Regent Chesterfield", category: "Leather · 3 Seater", image: sofa2, price: 245000, original: 289000, rating: 4.8, reviews: 96 },
  { id: "3", name: "Cassia Sectional", category: "L-Shape · 6 Seater", image: sofa3, price: 189000, original: 225000, rating: 4.9, reviews: 74 },
  { id: "4", name: "Bianca Boucle Loveseat", category: "Curved · 2 Seater", image: sofa4, price: 98000, original: 118000, rating: 4.7, reviews: 210 },
  { id: "5", name: "Verdant Velvet Sofa", category: "Velvet · 2 Seater", image: sofa5, price: 172000, original: 199000, rating: 4.9, reviews: 58 },
  { id: "6", name: "Halden Leather Recliner", category: "Recliner · Single", image: sofa6, price: 89000, original: 112000, rating: 4.8, reviews: 143 },
];

const newArrivals: Product[] = [
  { id: "n1", name: "Solene Curved 3-Seater", category: "New · Boucle", image: sofa4, price: 152000, original: 178000, rating: 4.9, reviews: 12 },
  { id: "n2", name: "Aramis Modular", category: "New · Modular", image: sofa3, price: 219000, original: 259000, rating: 5.0, reviews: 8 },
  { id: "n3", name: "Noor Velvet Loveseat", category: "New · Velvet", image: sofa5, price: 138000, original: 165000, rating: 4.8, reviews: 15 },
  { id: "n4", name: "Cedar Wood Frame", category: "New · Walnut", image: sofa1, price: 118000, original: 139000, rating: 4.7, reviews: 9 },
];

const features = [
  { icon: Award, title: "Premium Quality", text: "Kiln-dried hardwood frames" },
  { icon: Truck, title: "White-Glove Delivery", text: "Complimentary across India" },
  { icon: RotateCcw, title: "30-Day Returns", text: "Try it in your space" },
  { icon: ShieldCheck, title: "10-Year Warranty", text: "On every frame we build" },
];

const whyUs = [
  { icon: Leaf, title: "Premium Materials", text: "Full-grain leathers, Belgian linens, FSC-certified walnut sourced from responsible growers." },
  { icon: Hammer, title: "Handcrafted", text: "Each sofa is built by a single artisan from frame to final stitch — never an assembly line." },
  { icon: ShieldCheck, title: "10-Year Warranty", text: "We stand behind every joint, spring and seam for a full decade." },
  { icon: Wrench, title: "Free Installation", text: "White-glove installation and room styling included with every delivery." },
  { icon: MapPin, title: "Nationwide Delivery", text: "Insured, tracked, temperature-controlled transit to every pin code." },
  { icon: Sparkles, title: "Custom Designs", text: "Reconfigure dimensions, fabrics and finishes to make it uniquely yours." },
];

const reviews = [
  { name: "Anaya Kapoor", role: "Designed her Bandra apartment", img: r1, text: "The Aurelia sofa completely transformed our living room. The linen has aged beautifully after two years, and the frame feels solid as ever. Worth every rupee." },
  { name: "Rajiv Menon", role: "Homeowner, Bengaluru", img: r2, text: "From the swatch consultation to installation, every touchpoint felt considered. Their craftsmen came in, assembled it in under an hour, and even styled the room." },
  { name: "Priya Shenoy", role: "Interior Architect", img: r3, text: "I specify DecorDen for nearly every residential project now. Nothing else in India comes close on materials, silhouette and quiet elegance." },
];

const gallery = [
  { src: gal1, h: "row-span-2" },
  { src: gal2, h: "" },
  { src: gal3, h: "row-span-2" },
  { src: gal4, h: "" },
  { src: gal5, h: "row-span-2" },
  { src: gal6, h: "" },
];

const insta = [sofa1, gal2, sofa5, gal4, sofa4, gal6, sofa3, gal1];

function Home() {
  return (
    <>
      {/* HERO */}
      {/* HERO */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="relative h-[92vh] min-h-[640px] max-h-[900px] w-full">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0"
          >
            <video
              src="/decorden-hero.mp4"
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Luxury living room with cream boucle sofa"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/45 via-charcoal/20 to-transparent" />
          </motion.div>

          <div className="relative z-10 h-full container-luxury flex items-center">
            <div className="max-w-2xl text-ivory">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[11px] tracking-[0.4em] uppercase text-ivory/80"
              >
                The Autumn Atelier · 2026
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-6 font-display text-5xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-tight"
              >
                Sofas made
                <br />
                <span className="italic text-beige-warm">to be lived in</span>
                <br />
                for decades.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-7 text-lg text-ivory/85 max-w-lg leading-relaxed font-light"
              >
                Heirloom silhouettes handcrafted in our Mumbai atelier — kiln-dried
                walnut frames, hand-tied springs, natural fibres you can feel.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a href="#bestsellers" className="btn-primary bg-ivory text-charcoal border-ivory hover:bg-beige-warm hover:border-beige-warm hover:text-charcoal">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#collections" className="btn-ghost-light">
                  Explore Collection
                </a>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 text-ivory/80 text-xs tracking-[0.3em] uppercase"
          >
            <div className="h-px w-12 bg-ivory/40" />
            Scroll to discover
          </motion.div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="border-b border-line bg-ivory">
        <div className="container-luxury grid grid-cols-2 lg:grid-cols-4 divide-x divide-line">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="py-8 px-5 md:px-8 flex items-center gap-4"
            >
              <f.icon className="h-6 w-6 text-walnut shrink-0" strokeWidth={1.4} />
              <div className="min-w-0">
                <div className="font-display text-lg text-charcoal">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section id="bestsellers" className="py-24 md:py-32">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-xl">
              <p className="eyebrow">Most Loved</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
                Best-selling <span className="italic text-walnut">sofas</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A hand-picked selection of the silhouettes our clients return to season after season.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="py-24 md:py-32 bg-ivory">
        <div className="container-luxury">
          <SectionHeader
            eyebrow="Curated Collections"
            title="Six worlds to |sink into|."
            subtitle="From compact loveseats to sprawling sectionals, each collection is designed around a way of living."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CollectionCard title="L-Shape Sofas" count="24 Designs" image={colL} index={0} />
            <CollectionCard title="Fabric Sofas" count="42 Designs" image={colFabric} index={1} />
            <CollectionCard title="Leather Sofas" count="28 Designs" image={colLeather} index={2} />
            <CollectionCard title="Wooden Sofas" count="18 Designs" image={colWood} index={3} />
            <CollectionCard title="Recliners" count="21 Designs" image={colRecliner} index={4} />
            <CollectionCard title="Sectionals" count="16 Designs" image={colSectional} index={5} />
          </div>
        </div>
      </section>

      {/* FEATURED BANNER */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <motion.img
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
            src={banner}
            alt="Handcrafted luxury sofa in sunlit gallery"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
          <div className="relative h-full container-luxury flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-xl text-ivory"
            >
              <p className="text-[11px] tracking-[0.4em] uppercase text-beige-warm">The Signature Edit</p>
              <h2 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-tight">
                Heirloom sofas,<br />
                <span className="italic">honestly made.</span>
              </h2>
              <p className="mt-6 text-lg text-ivory/85 leading-relaxed font-light max-w-md">
                Ninety-two joinery steps. Zero shortcuts. A sofa built to outlive its trends.
              </p>
              <div className="mt-9">
                <a href="/sofas" className="btn-ghost-light">Discover the Craft</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <SectionHeader
            eyebrow="Why DecorDen"
            title="Six reasons our clients |never look back|."
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {whyUs.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative p-8 md:p-10 bg-ivory border border-line hover:border-walnut/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-luxury)]"
              >
                <w.icon className="h-8 w-8 text-walnut mb-6" strokeWidth={1.2} />
                <h3 className="font-display text-2xl text-charcoal">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-walnut group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT STORY */}
      <section className="bg-charcoal text-ivory py-24 md:py-32">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <img src={craft} alt="Artisan handcrafting a sofa" loading="lazy" className="w-full h-[560px] object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-beige-warm">Our Atelier</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Twenty-eight years<br />
              of quiet <span className="italic text-beige-warm">obsession</span>.
            </h2>
            <p className="mt-6 text-ivory/75 leading-relaxed">
              We began in a small workshop in Byculla with a single conviction — a sofa
              should be built the way it once was: patient hands, honest materials, and
              time. Nothing has changed since, except the size of our door.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ivory/15 pt-8">
              {[
                { k: "28", l: "Years of craft" },
                { k: "14K+", l: "Sofas delivered" },
                { k: "92", l: "Joinery steps" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl md:text-5xl text-beige-warm">{s.k}</div>
                  <div className="text-xs tracking-[0.2em] uppercase text-ivory/60 mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container-luxury">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <div>
              <p className="eyebrow">Just In</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
                New <span className="italic text-walnut">arrivals</span>
              </h2>
            </div>
            <a href="/sofas" className="text-[11px] tracking-[0.3em] uppercase text-charcoal hover:text-walnut transition-colors flex items-center gap-2">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* LIFESTYLE INLINE */}
      <section className="relative">
        <div className="grid lg:grid-cols-2">
          <div className="bg-beige py-20 md:py-28 px-8 md:px-16 flex items-center">
            <div className="max-w-md">
              <p className="eyebrow">Custom Design Studio</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl text-charcoal leading-[1.05]">
                Design a sofa <span className="italic text-walnut">only you</span> can own.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Book a free consultation with our senior designer. Bring your floor
                plan and a coffee — we'll bring 400 fabric swatches and thirty years
                of instinct.
              </p>
              <div className="mt-8">
                <a href="/contact" className="btn-primary">Book Consultation</a>
              </div>
            </div>
          </div>
          <div className="relative min-h-[400px]">
            <img src={lifestyle} alt="Warm sofa detail" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32">
        <div className="container-luxury">
          <SectionHeader eyebrow="Kind Words" title="From homes we've had the |privilege| to furnish." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.figure
                key={r.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="p-8 md:p-10 bg-ivory border border-line flex flex-col"
              >
                <div className="flex gap-1 text-walnut">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-walnut" />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-xl md:text-2xl text-charcoal leading-snug flex-1">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 pt-6 border-t border-line">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-medium text-charcoal">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* INSPIRATION GALLERY (masonry) */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container-luxury">
          <SectionHeader eyebrow="Inspiration Gallery" title="Rooms that made us |pause|." />

          <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 auto-rows-[200px] md:auto-rows-[260px] gap-4">
            {gallery.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
                className={`relative overflow-hidden group ${g.h}`}
              >
                <img
                  src={g.src}
                  alt="Interior inspiration"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-20">
        <div className="container-luxury text-center">
          <p className="eyebrow">@decorden</p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl text-charcoal">
            Follow our <span className="italic text-walnut">journal</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-4 lg:grid-cols-8 gap-1">
          {insta.map((src, i) => (
            <a key={i} href="#" className="relative aspect-square overflow-hidden group block">
              <img src={src} alt="Instagram post" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-300 grid place-items-center">
                <Instagram className="h-6 w-6 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 md:py-32 bg-beige">
        <div className="container-luxury max-w-2xl text-center">
          <p className="eyebrow">The DecorDen Letter</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
            Considered pieces, <span className="italic text-walnut">delivered slowly</span>.
          </h2>
          <p className="mt-5 text-muted-foreground">
            A quiet dispatch once a month — new silhouettes, atelier stories,
            and private previews for subscribers.
          </p>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 bg-ivory border border-line text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-walnut transition-colors"
              required
            />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">We respect your inbox. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
