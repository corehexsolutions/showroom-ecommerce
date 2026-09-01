import { motion } from "framer-motion";
import {
  Sparkles,
  Sofa,
  Droplets,
  Sun,
  Wind,
  ShieldCheck,
} from "lucide-react";

const CareGuidePage = () => {
  return (
    <main className="min-h-screen bg-[#11171d] text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs tracking-[0.35em] text-[#7bbd3f]">
              CUSTOMER CARE
            </p>

            <h1 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
              Care Guide
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              A little care goes a long way. Follow these simple guidelines
              to keep your Decorden furniture looking beautiful for years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Care */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-[#7bbd3f]">
            EVERYDAY CARE
          </p>

          <h2 className="mt-4 text-3xl font-light md:text-4xl">
            Simple habits. Lasting beauty.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <CareCard
            icon={<Sofa size={22} />}
            title="Regular Cleaning"
            text="Gently vacuum your sofa regularly using a soft upholstery attachment to remove dust and debris."
          />

          <CareCard
            icon={<Droplets size={22} />}
            title="Handle Spills Quickly"
            text="Blot liquid spills immediately using a clean, dry cloth. Avoid rubbing as it may push the liquid deeper into the fabric."
          />

          <CareCard
            icon={<Sun size={22} />}
            title="Avoid Direct Sunlight"
            text="Keep furniture away from prolonged direct sunlight to help prevent fading and discoloration."
          />

          <CareCard
            icon={<Wind size={22} />}
            title="Allow Airflow"
            text="Keep your furniture in a well-ventilated environment and avoid placing it directly against damp walls."
          />

          <CareCard
            icon={<Sparkles size={22} />}
            title="Use Suitable Products"
            text="Always use cleaning products recommended for your specific upholstery or furniture material."
          />

          <CareCard
            icon={<ShieldCheck size={22} />}
            title="Professional Cleaning"
            text="For deep cleaning or delicate materials, we recommend using a professional upholstery cleaning service."
          />
        </div>
      </section>

      {/* Sofa Care */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="text-xs tracking-[0.3em] text-[#7bbd3f]">
            SOFA CARE
          </p>

          <h2 className="mt-4 text-3xl font-light md:text-4xl">
            Looking after your sofa
          </h2>

          <div className="mt-10 space-y-8">
            <CareSection
              number="01"
              title="Vacuum gently"
              text="Remove loose dust and dirt regularly using a soft upholstery attachment."
            />

            <CareSection
              number="02"
              title="Fluff the cushions"
              text="Regularly adjust and fluff loose cushions to help maintain their shape and comfort."
            />

            <CareSection
              number="03"
              title="Treat stains carefully"
              text="Never scrub aggressively. Blot spills gently and follow the recommended cleaning method for your upholstery."
            />

            <CareSection
              number="04"
              title="Protect the fabric"
              text="Avoid sharp objects, excessive friction, and prolonged exposure to heat or direct sunlight."
            />

            <CareSection
              number="05"
              title="Rotate cushions"
              text="Where possible, rotate reversible cushions periodically to help distribute everyday wear evenly."
            />
          </div>
        </div>
      </section>

      {/* Important */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-white/10 p-7 md:p-10">
          <h3 className="text-xl">Important</h3>

          <p className="mt-4 leading-8 text-white/55">
            Cleaning and maintenance requirements vary depending on the
            upholstery, wood, finish, and other materials used in your
            furniture. Always follow the specific care instructions provided
            with your product.
          </p>
        </div>
      </section>
    </main>
  );
};

const CareCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-[#7bbd3f]/30">
    <div className="mb-5 text-[#7bbd3f]">{icon}</div>

    <h3 className="text-lg">{title}</h3>

    <p className="mt-3 text-sm leading-7 text-white/50">{text}</p>
  </div>
);

const CareSection = ({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) => (
  <div className="flex gap-6 border-b border-white/10 pb-8">
    <span className="text-sm text-[#7bbd3f]">{number}</span>

    <div>
      <h3 className="text-lg">{title}</h3>
      <p className="mt-3 leading-7 text-white/50">{text}</p>
    </div>
  </div>
);

export default CareGuidePage;