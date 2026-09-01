import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Ready-to-ship products generally take around 7–15 business days depending on your location. Made-to-order and customized furniture may require additional production time.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "Yes. We deliver to locations across India. Delivery availability and charges may vary depending on your location.",
  },
  {
    question: "Can I customize a sofa?",
    answer:
      "Yes. Decorden offers customization options for selected products, including upholstery, size, finish, and other design details. You can contact our team for a custom consultation.",
  },
  {
    question: "How do I place a custom order?",
    answer:
      "You can submit a custom order or consultation request through our website. Our team will contact you to understand your requirements and discuss available options.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We support secure online payments through the payment options available during checkout.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Cancellation eligibility depends on the status of your order. Customized or production-stage orders may have different cancellation conditions. Please contact customer care as soon as possible.",
  },
  {
    question: "What should I do if my furniture arrives damaged?",
    answer:
      "Please document the damage with clear photographs or videos and contact our customer care team as soon as possible. We will review the issue and guide you through the next steps.",
  },
  {
    question: "Do your products come with a warranty?",
    answer:
      "Warranty coverage depends on the specific product. Please refer to the warranty information provided with your product or contact our team for details.",
  },
  {
    question: "How should I clean my sofa?",
    answer:
      "Regularly vacuum your sofa using a soft upholstery attachment. For spills, gently blot the area with a clean cloth and follow the care instructions specific to your upholstery material.",
  },
  {
    question: "Can I request fabric or finish samples?",
    answer:
      "Sample availability depends on the product and material selected. Please contact our team and we will help you with the available options.",
  },
  {
    question: "How can I contact Decorden?",
    answer:
      "You can reach our customer care team through the contact information provided on our website. We will be happy to assist you with products, orders, customization, and delivery.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
              Frequently Asked Questions
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              Find answers to some of the most common questions about Decorden
              products, orders, delivery, and customization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/[0.03] md:px-7"
                >
                  <span className="text-sm md:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#7bbd3f] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="border-t border-white/10 px-6 pb-6 pt-5 text-sm leading-7 text-white/50 md:px-7">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl border border-[#7bbd3f]/20 bg-[#7bbd3f]/5 p-8 text-center md:p-10">
          <p className="text-xs tracking-[0.25em] text-[#7bbd3f]">
            STILL HAVE QUESTIONS?
          </p>

          <h2 className="mt-4 text-2xl font-light">
            We're here to help.
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/50">
            Our customer care team can help you with products, customization,
            orders, delivery, and anything else you need.
          </p>

          <a
            href="/contact"
            className="mt-7 inline-flex rounded-full bg-[#7bbd3f] px-7 py-3 text-sm font-medium text-[#11171d] transition hover:opacity-90"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;