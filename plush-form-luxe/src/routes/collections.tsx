import { createFileRoute } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { SectionHeader } from "@/components/SectionHeader";
import colL from "@/assets/col-lshape.jpg";
import colFabric from "@/assets/col-fabric.jpg";
import colLeather from "@/assets/col-leather.jpg";
import colWood from "@/assets/col-wooden.jpg";
import colRecliner from "@/assets/col-recliner.jpg";
import colSectional from "@/assets/col-sectional.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Maison Vellora" },
      { name: "description", content: "Six curated sofa collections — from L-shape sectionals to walnut-framed daybeds." },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="container-luxury">
        <SectionHeader eyebrow="Collections" title="Six worlds to |sink into|." />
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
  );
}
