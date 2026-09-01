import { motion } from "framer-motion";
import {
  Truck,
  PackageCheck,
  MapPin,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const ShippingDeliveryPage = () => {
  return (
    <main className="min-h-screen bg-[#11171d] text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="mb-4 text-xs font-medium tracking-[0.35em] text-[#7bbd3f]">
              CUSTOMER CARE
            </p>

            <h1 className="max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
              Shipping & Delivery
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              We take great care in delivering every Decorden piece safely,
              securely, and on time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#7bbd3f]">
              OUR DELIVERY PROMISE
            </p>

            <h2 className="mt-4 text-3xl font-light md:text-4xl">
              Designed with care.
              <br />
              Delivered with care.
            </h2>
          </div>

          <p className="leading-8 text-white/60">
            Every sofa and furniture piece is carefully inspected and prepared
            before it leaves our facility. Because our products are often
            larger and made with premium materials, delivery is handled with
            special attention to ensure your furniture reaches you in perfect
            condition.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-px md:grid-cols-3">
          <InfoCard
            icon={<Truck size={22} />}
            title="Safe Delivery"
            text="Your furniture is securely packed and handled by our delivery partners."
          />

          <InfoCard
            icon={<Clock3 size={22} />}
            title="Delivery Timeline"
            text="Delivery times vary depending on your location and whether your piece is made to order."
          />

          <InfoCard
            icon={<MapPin size={22} />}
            title="Delivery Areas"
            text="We deliver to locations across India. Availability is confirmed before dispatch."
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <DeliverySection
          title="When will my order arrive?"
          text="For ready-to-ship products, delivery generally takes between 7–15 business days depending on your location. Made-to-order and customized furniture may require additional production time."
        />

        <DeliverySection
          title="Will I receive a delivery update?"
          text="Yes. Once your order is dispatched, our team will provide the relevant delivery or tracking information so you can stay updated."
        />

        <DeliverySection
          title="What happens when my furniture arrives?"
          text="Our delivery team will carefully bring your furniture to the designated delivery area. For eligible products, installation or assembly assistance may also be provided."
        />

        <DeliverySection
          title="What if my product arrives damaged?"
          text="Please inspect the furniture at the time of delivery. If you notice any visible damage, immediately inform the delivery team and contact our customer care team with photographs or videos."
        />

        <DeliverySection
          title="Delivery charges"
          text="Delivery charges, if applicable, are displayed during checkout or communicated by our team before confirming your order."
        />

        <div className="mt-12 flex gap-4 rounded-2xl border border-[#7bbd3f]/20 bg-[#7bbd3f]/5 p-6">
          <ShieldCheck className="mt-1 shrink-0 text-[#7bbd3f]" size={22} />

          <div>
            <h3 className="font-medium">Need help with your delivery?</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Our customer care team is happy to assist you with delivery
              questions, order updates, or special delivery requirements.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="p-8 md:p-10">
    <div className="mb-5 text-[#7bbd3f]">{icon}</div>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-white/50">{text}</p>
  </div>
);

const DeliverySection = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => (
  <div className="border-b border-white/10 py-8 first:pt-0">
    <h3 className="text-xl font-normal">{title}</h3>
    <p className="mt-4 leading-8 text-white/55">{text}</p>
  </div>
);

export default ShippingDeliveryPage;