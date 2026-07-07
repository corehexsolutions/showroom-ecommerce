import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import craft from "@/assets/craft.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Maison Vellora" },
      { name: "description", content: "Twenty-eight years of quietly obsessive sofa-making from our Mumbai atelier." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="py-20 md:py-28">
        <div className="container-luxury">
          <SectionHeader eyebrow="Our Story" title="Twenty-eight years of |quiet obsession|." subtitle="We began in a small workshop in Byculla with a single conviction — a sofa should be built the way it once was: patient hands, honest materials, and time." />
        </div>
      </section>
      <section className="pb-24">
        <div className="container-luxury">
          <img src={craft} alt="Artisan at work" className="w-full h-[520px] object-cover" />
        </div>
      </section>
    </>
  );
}
