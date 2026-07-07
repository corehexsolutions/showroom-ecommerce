import { motion } from "framer-motion";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.05]">
        {title.split("|").map((part, i) => (
          <span key={i} className={i % 2 === 1 ? "italic text-walnut" : ""}>
            {part}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
