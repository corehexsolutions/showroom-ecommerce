import { createFileRoute } from "@tanstack/react-router";
import { ProductCard, type Product } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import sofa1 from "@/assets/sofa-1.jpg";
import sofa2 from "@/assets/sofa-2.jpg";
import sofa3 from "@/assets/sofa-3.jpg";
import sofa4 from "@/assets/sofa-4.jpg";
import sofa5 from "@/assets/sofa-5.jpg";
import sofa6 from "@/assets/sofa-6.jpg";

export const Route = createFileRoute("/sofas")({
  head: () => ({
    meta: [
      { title: "Sofas — Maison Vellora" },
      { name: "description", content: "Explore our full range of handcrafted luxury sofas — fabric, leather, sectional, curved and wooden frame silhouettes." },
    ],
  }),
  component: SofasPage,
});

const products: Product[] = [
  { id: "1", name: "Aurelia Linen Sofa", category: "Fabric · 3 Seater", image: sofa1, price: 129000, original: 165000, rating: 4.9, reviews: 128 },
  { id: "2", name: "Regent Chesterfield", category: "Leather · 3 Seater", image: sofa2, price: 245000, original: 289000, rating: 4.8, reviews: 96 },
  { id: "3", name: "Cassia Sectional", category: "L-Shape · 6 Seater", image: sofa3, price: 189000, original: 225000, rating: 4.9, reviews: 74 },
  { id: "4", name: "Bianca Boucle Loveseat", category: "Curved · 2 Seater", image: sofa4, price: 98000, original: 118000, rating: 4.7, reviews: 210 },
  { id: "5", name: "Verdant Velvet Sofa", category: "Velvet · 2 Seater", image: sofa5, price: 172000, original: 199000, rating: 4.9, reviews: 58 },
  { id: "6", name: "Halden Leather Recliner", category: "Recliner · Single", image: sofa6, price: 89000, original: 112000, rating: 4.8, reviews: 143 },
];

function SofasPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxury">
        <SectionHeader eyebrow="All Sofas" title="The full |atelier| collection." subtitle="Every silhouette we currently make, built to order in our Mumbai workshop." />
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
