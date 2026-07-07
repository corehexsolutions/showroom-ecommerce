import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  original: number;
  rating: number;
  reviews: number;
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const off = Math.round(((product.original - product.price) / product.original) * 100);
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden bg-beige aspect-[4/5] rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />

        {off > 0 && (
          <span className="absolute top-4 left-4 bg-charcoal text-ivory text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            −{off}%
          </span>
        )}

        <button
          aria-label="Wishlist"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-ivory/95 backdrop-blur text-charcoal grid place-items-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-charcoal hover:text-ivory"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button className="w-full bg-ivory/95 backdrop-blur text-charcoal py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium flex items-center justify-center gap-2 hover:bg-charcoal hover:text-ivory transition-colors">
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-walnut mb-1.5">{product.category}</p>
            <h3 className="font-display text-xl text-charcoal truncate">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-charcoal">
            <Star className="h-3.5 w-3.5 fill-walnut text-walnut" />
            <span className="text-xs">{product.rating}</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-lg text-charcoal font-medium">₹{product.price.toLocaleString("en-IN")}</span>
          {product.original > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.original.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
