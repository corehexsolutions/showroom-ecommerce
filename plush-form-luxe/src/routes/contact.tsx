import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { MapPin, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Decor Den" },
      { name: "description", content: "Visit our flagship showroom or book a private design consultation." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxury">
        <SectionHeader eyebrow="Contact" title="Come |sit awhile|." subtitle="Visit the flagship, book a private consultation, or send us a note." />
        <div className="mt-16 grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: MapPin, title: "Flagship", text: "Vadodara, Gujarat" },
            { icon: Phone, title: "Call", text: "+91 12345 67890\nMon–Sat, 10am–8pm" },
            { icon: Mail, title: "Write", text: "atelier@decorden.in\nWe reply within a day" },
          ].map((c) => (
            <div key={c.title} className="p-10 bg-ivory border border-line text-center">
              <c.icon className="h-7 w-7 text-walnut mx-auto" strokeWidth={1.3} />
              <h3 className="mt-5 font-display text-2xl text-charcoal">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
