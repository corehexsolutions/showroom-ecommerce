import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  Phone,
  X,
} from "lucide-react";

import { submitConsultation } from "@/lib/consultation";

type CustomizationType = "sofa" | "furniture" | "curtains" | "other";

interface BespokeSofaFormProps {
  selectedFinish?: string;
}

const customizationOptions: {
  id: CustomizationType;
  label: string;
}[] = [
  { id: "sofa", label: "Sofa" },
  { id: "furniture", label: "Furniture" },
  { id: "curtains", label: "Curtains" },
  { id: "other", label: "Something else" },
];

const sofaTypes = [
  "2 Seater",
  "3 Seater",
  "4 Seater",
  "L-Shaped Sofa",
  "Sectional Sofa",
  "Sofa Set",
];

const furnitureTypes = [
  "Armchair",
  "Ottoman",
  "Coffee Table",
  "TV Unit",
  "Bed",
  "Dining Table",
  "Dining Chair",
  "Other Furniture",
];

const curtainTypes = [
  "Full Length Curtains",
  "Window Curtains",
  "Sheer Curtains",
  "Blackout Curtains",
  "Curtain Set",
  "Custom Curtains",
];

export default function BespokeSofaForm({
  selectedFinish = "Terracotta Leather",
}: BespokeSofaFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customizationType, setCustomizationType] =
    useState<CustomizationType>("sofa");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    productType: "",
    finish: selectedFinish,
    size: "",
    budget: "",
    message: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type: CustomizationType) => {
    setCustomizationType(type);

    setForm((prev) => ({
      ...prev,
      productType: "",
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Optional client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    // Optional 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getTypeLabel = () => {
    switch (customizationType) {
      case "sofa":
        return "Sofa type";

      case "furniture":
        return "Furniture type";

      case "curtains":
        return "Curtain type";

      default:
        return "What would you like?";
    }
  };

  const getTypeOptions = () => {
    switch (customizationType) {
      case "sofa":
        return sofaTypes;

      case "furniture":
        return furnitureTypes;

      case "curtains":
        return curtainTypes;

      default:
        return [];
    }
  };

  const getFinishLabel = () => {
    if (customizationType === "curtains") {
      return "Preferred fabric / finish";
    }

    return "Preferred finish";
  };

  /**
   * IMPORTANT:
   * This handler belongs to the FORM, not the submit button.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("🔥 HANDLE SUBMIT FIRED");

  if (loading) {
    console.log("Already submitting...");
    return;
  }

  // Manual validation because noValidate is enabled
  if (!form.name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!form.phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  if (!form.message.trim()) {
    alert("Please tell us about your idea.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,

      customizationType,

      productType: form.productType.trim() || undefined,

      sofaType:
        customizationType === "sofa"
          ? form.productType.trim() || undefined
          : undefined,

      approximateSize: form.size.trim() || undefined,
      budget: form.budget || undefined,
      description: form.message.trim(),
      selectedFinish: form.finish.trim() || undefined,

      image: image || undefined,
    };

    console.log("📦 PAYLOAD:", payload);
    console.log("🚀 CALLING submitConsultation...");

    const response = await submitConsultation(payload);

    console.log("✅ API RESPONSE:", response);

    setSubmitted(true);
  } catch (error) {
    console.error("❌ API ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't submit your enquiry right now.";

    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const resetForm = () => {
    removeImage();

    setSubmitted(false);
    setCustomizationType("sofa");

    setForm({
      name: "",
      phone: "",
      email: "",
      productType: "",
      finish: selectedFinish,
      size: "",
      budget: "",
      message: "",
    });
  };

  if (submitted) {
    return (
      <section className="bg-[#f7f4ee] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3f6d25]/10 text-[#3f6d25]">
            <Check size={28} />
          </div>

          <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
            Enquiry received
          </p>

          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
            Let's create something beautiful.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-black/55">
            Thank you for sharing your idea with us. Our team will review your
            requirements and get in touch with you shortly.
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="mt-8 inline-flex items-center gap-3 bg-[#3f6d25] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c]"
          >
            Send another enquiry
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    );
  }

  const typeOptions = getTypeOptions();

  return (
    <section className="bg-[#f7f4ee] px-5 py-12 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#3f6d25]">
            Bespoke & Personalized
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Create something made for you.
          </h1>

          <p className="mt-5 text-sm leading-7 text-black/55">
            Have a specific piece in mind? Whether it's a sofa, custom
            furniture or curtains, tell us what you're looking for and our
            team will help bring your idea to life.
          </p>
        </div>

        {/* Contact options */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          <a
            href="tel:+919999999999"
            className="flex items-center justify-center gap-3 border border-black/10 bg-white/30 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition hover:border-[#3f6d25]"
          >
            <Phone size={15} className="text-[#3f6d25]" />
            Call our design team
          </a>

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 border border-black/10 bg-white/30 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition hover:border-[#3f6d25]"
          >
            <span className="text-[#3f6d25]">WhatsApp</span>
            Chat with us
          </a>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-4xl border border-black/10 bg-white/30 p-6 sm:p-8 lg:p-10"
        >
          {/* What are you looking for? */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
              What are you looking for?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {customizationOptions.map((option) => {
                const active = customizationType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleTypeChange(option.id)}
                    className={`flex min-h-[52px] items-center justify-center border px-3 text-xs transition ${
                      active
                        ? "border-[#3f6d25] bg-[#3f6d25]/5 text-[#3f6d25]"
                        : "border-black/10 bg-[#f7f4ee] text-black/55 hover:border-black/25"
                    }`}
                  >
                    {active && <Check size={13} className="mr-2" />}

                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal details */}
          <div className="mt-10 border-t border-black/10 pt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
              Your details
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-black/60">
                  Your name *
                </label>

                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-black/60">
                  Phone number *
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs text-black/60">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mt-10 border-t border-black/10 pt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
              Your requirements
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Type */}
              {customizationType !== "other" && (
                <div>
                  <label className="mb-2 block text-xs text-black/60">
                    {getTypeLabel()}
                  </label>

                  <select
                    name="productType"
                    value={form.productType}
                    onChange={handleChange}
                    className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none focus:border-[#3f6d25]"
                  >
                    <option value="">Select an option</option>

                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Finish / Fabric */}
              {customizationType !== "other" && (
                <div>
                  <label className="mb-2 block text-xs text-black/60">
                    {getFinishLabel()}
                  </label>

                  {customizationType === "curtains" ? (
                    <select
                      name="finish"
                      value={form.finish}
                      onChange={handleChange}
                      className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none focus:border-[#3f6d25]"
                    >
                      <option value={selectedFinish}>
                        {selectedFinish}
                      </option>
                      <option value="Linen">Linen</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Velvet">Velvet</option>
                      <option value="Sheer">Sheer</option>
                      <option value="Blackout">Blackout</option>
                      <option value="Custom">Something else</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="finish"
                      value={form.finish}
                      onChange={handleChange}
                      placeholder="e.g. Terracotta leather"
                      className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                    />
                  )}
                </div>
              )}

              {/* Size */}
              <div>
                <label className="mb-2 block text-xs text-black/60">
                  Approximate dimensions
                </label>

                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder={
                    customizationType === "curtains"
                      ? "e.g. 8 ft × 7 ft"
                      : "e.g. 8 ft × 3 ft"
                  }
                  className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="mb-2 block text-xs text-black/60">
                  Approximate budget
                </label>

                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none focus:border-[#3f6d25]"
                >
                  <option value="">Select budget</option>
                  <option value="under-25000">Under ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value="50000-100000">₹50,000 – ₹1,00,000</option>
                  <option value="100000-200000">
                    ₹1,00,000 – ₹2,00,000
                  </option>
                  <option value="200000-plus">₹2,00,000+</option>
                </select>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs text-black/60">
                  Tell us about your idea *
                </label>

                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us about the style, dimensions, room, colours, fabric, or any special requirements..."
                  className="w-full resize-none border border-black/10 bg-[#f7f4ee] px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                />
              </div>
            </div>
          </div>

          {/* Inspiration */}
          <div className="mt-10 border-t border-black/10 pt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
              Inspiration
            </p>

            <p className="mt-2 text-xs leading-5 text-black/45">
              Have a reference image? Upload it so our team can better
              understand what you're looking for.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              className="hidden"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex w-full flex-col items-center justify-center border border-dashed border-black/15 bg-[#f7f4ee] px-6 py-9 text-center transition hover:border-[#3f6d25]"
              >
                <ImagePlus size={24} className="text-black/35" />

                <p className="mt-3 text-xs font-medium">
                  Upload an inspiration image
                </p>

                <p className="mt-1 text-[10px] text-black/40">
                  JPG, PNG or WEBP
                </p>
              </button>
            ) : (
              <div className="relative mt-5 overflow-hidden border border-black/10 bg-[#f7f4ee]">
                <img
                  src={imagePreview}
                  alt="Inspiration"
                  className="h-64 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black hover:text-white"
                  aria-label="Remove image"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-10 border-t border-black/10 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 bg-[#3f6d25] text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-[#31591c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending enquiry...
                </>
              ) : (
                <>
                  Request a consultation
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[10px] leading-5 text-black/40">
              Our team will contact you to discuss your requirements and help
              create the right piece for your space.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
