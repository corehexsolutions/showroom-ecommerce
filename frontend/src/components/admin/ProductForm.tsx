import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
  Package,
  Tag,
  Images,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import type {
  Product,
  ProductAccordion,
  ProductBadge,
  ProductVariant,
} from "@/types/product";

import { createProduct, updateProduct } from "@/lib/adminApi";

type Props = {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  tags: string;
  price: string;
  compareAtPrice: string;
  currency: string;

  variantLabel: string;

  inStock: boolean;
  totalStock: string;

  rating: string;
  reviewCount: string;

  isActive: boolean;

  variants: ProductVariant[];
  badges: ProductBadge[];
  accordion: ProductAccordion[];
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  brand: "Decorden",
  category: "Sofas",
  tags: "",
  price: "",
  compareAtPrice: "",
  currency: "INR",

  variantLabel: "Size",

  inStock: true,
  totalStock: "0",

  rating: "0",
  reviewCount: "0",

  isActive: true,

  variants: [],
  badges: [],
  accordion: [],
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export default function ProductForm({
  product,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(
    product?.images || []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Important:
   *
   * false = slug is controlled automatically by product name
   * true  = admin has manually edited the slug
   */
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(product)
  );

  useEffect(() => {
    setError("");
    setNewImages([]);

    if (!product) {
      setForm(emptyForm);
      setExistingImages([]);
      setSlugManuallyEdited(false);
      return;
    }

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      brand: product.brand || "Decorden",
      category: product.category || "Sofas",
      tags: (product.tags || []).join(", "),

      price: String(product.price ?? ""),
      compareAtPrice: String(product.compareAtPrice ?? ""),
      currency: product.currency || "INR",

      variantLabel: product.variantLabel || "Size",

      inStock: product.inStock ?? true,
      totalStock: String(product.totalStock ?? 0),

      rating: String(product.rating ?? 0),
      reviewCount: String(product.reviewCount ?? 0),

      isActive: product.isActive ?? true,

      variants: product.variants || [],
      badges: product.badges || [],
      accordion: product.accordion || [],
    });

    setExistingImages(product.images || []);

    // Existing product already has a persisted slug.
    setSlugManuallyEdited(true);
  }, [product]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
   * Product name -> automatic slug
   *
   * Example:
   * Luxury Sofa
   *       ↓
   * luxury-sofa
   *
   * Once the admin manually changes the slug,
   * changing the name will no longer overwrite it.
   */
  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugManuallyEdited
        ? current.slug
        : generateSlug(value),
    }));
  }

  function handleSlugChange(value: string) {
    const normalized = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-{2,}/g, "-");

    setSlugManuallyEdited(true);

    setForm((current) => ({
      ...current,
      slug: normalized,
    }));
  }

  /*
   * Allows admin to return to automatic slug generation.
   */
  function resetSlugToAutomatic() {
    setSlugManuallyEdited(false);

    setForm((current) => ({
      ...current,
      slug: generateSlug(current.name),
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const currentCount =
      existingImages.length + newImages.length;

    const remainingSlots = 10 - currentCount;

    if (remainingSlots <= 0) {
      setError("Maximum 10 product images are allowed.");
      return;
    }

    const selectedFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    setNewImages((current) => [
      ...current,
      ...selectedFiles,
    ]);

    event.target.value = "";
  }

  function removeNewImage(index: number) {
    setNewImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function removeExistingImage(index: number) {
    setExistingImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function addVariant() {
    const hasEmptyVariant = form.variants.some(
      (variant) => !variant.label?.trim()
    );

    if (hasEmptyVariant) {
      setError(
        "Please complete the existing variant before adding another."
      );
      return;
    }

    setError("");

    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          label: "",
          sku: "",
          price: Number(current.price || 0),
          inStock: true,
          stockQuantity: 0,
        },
      ],
    }));
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string | number | boolean
  ) {
    setForm((current) => {
      const variants = [...current.variants];

      variants[index] = {
        ...variants[index],
        [field]: value,
      };

      return {
        ...current,
        variants,
      };
    });
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter(
        (_, variantIndex) => variantIndex !== index
      ),
    }));
  }

  function addBadge() {
    setForm((current) => ({
      ...current,
      badges: [
        ...current.badges,
        {
          icon: "",
          title: "",
          subtitle: "",
        },
      ],
    }));
  }

  function updateBadge(
    index: number,
    field: keyof ProductBadge,
    value: string
  ) {
    setForm((current) => {
      const badges = [...current.badges];

      badges[index] = {
        ...badges[index],
        [field]: value,
      };

      return {
        ...current,
        badges,
      };
    });
  }

  function removeBadge(index: number) {
    setForm((current) => ({
      ...current,
      badges: current.badges.filter(
        (_, badgeIndex) => badgeIndex !== index
      ),
    }));
  }

  function addAccordion() {
    setForm((current) => ({
      ...current,
      accordion: [
        ...current.accordion,
        {
          title: "",
          content: "",
        },
      ],
    }));
  }

  function updateAccordion(
    index: number,
    field: keyof ProductAccordion,
    value: string
  ) {
    setForm((current) => {
      const accordion = [...current.accordion];

      accordion[index] = {
        ...accordion[index],
        [field]: value,
      };

      return {
        ...current,
        accordion,
      };
    });
  }

  function removeAccordion(index: number) {
    setForm((current) => ({
      ...current,
      accordion: current.accordion.filter(
        (_, accordionIndex) => accordionIndex !== index
      ),
    }));
  }

  const totalImageCount =
    existingImages.length + newImages.length;

  const imageSlotsLeft = Math.max(0, 10 - totalImageCount);

  const slugStatus = useMemo(() => {
    if (!form.slug) {
      return "empty";
    }

    if (!isValidSlug(form.slug)) {
      return "invalid";
    }

    return slugManuallyEdited ? "manual" : "automatic";
  }, [form.slug, slugManuallyEdited]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const name = form.name.trim();
      const slug = form.slug.trim();
      const category = form.category.trim();

      if (!name) {
        throw new Error("Product name is required.");
      }

      if (!slug) {
        throw new Error("Product slug is required.");
      }

      if (!isValidSlug(slug)) {
        throw new Error(
          "Slug can only contain lowercase letters, numbers and hyphens."
        );
      }

      if (!category) {
        throw new Error("Category is required.");
      }

      const price = Number(form.price);

      if (!form.price || Number.isNaN(price) || price < 0) {
        throw new Error("Please enter a valid product price.");
      }

      if (
        form.compareAtPrice &&
        (Number.isNaN(Number(form.compareAtPrice)) ||
          Number(form.compareAtPrice) < 0)
      ) {
        throw new Error("Please enter a valid compare-at price.");
      }

      if (
        Number(form.rating) < 0 ||
        Number(form.rating) > 5
      ) {
        throw new Error("Rating must be between 0 and 5.");
      }

      if (!product && newImages.length === 0) {
        throw new Error(
          "Please upload at least one product image."
        );
      }

      if (totalImageCount > 10) {
        throw new Error(
          "A product can have a maximum of 10 images."
        );
      }

      /*
       * Validate variants before creating FormData.
       */
      const validVariants = form.variants
        .filter((variant) => variant.label?.trim())
        .map((variant) => ({
          label: variant.label.trim(),
          sku: variant.sku?.trim() || undefined,
          price:
            variant.price !== undefined &&
            variant.price !== null &&
            Number(variant.price) >= 0
              ? Number(variant.price)
              : price,
          inStock: Boolean(variant.inStock),
          stockQuantity: Math.max(
            0,
            Number(variant.stockQuantity || 0)
          ),
        }));

      const invalidVariant = validVariants.some(
        (variant) =>
          variant.price < 0 ||
          variant.stockQuantity < 0
      );

      if (invalidVariant) {
        throw new Error(
          "Please check the variant price and stock quantity."
        );
      }

      /*
       * Remove completely empty badges.
       */
      const validBadges = form.badges
        .map((badge) => ({
          icon: badge.icon?.trim() || "",
          title: badge.title?.trim() || "",
          subtitle: badge.subtitle?.trim() || "",
        }))
        .filter(
          (badge) =>
            badge.icon ||
            badge.title ||
            badge.subtitle
        );

      /*
       * Remove completely empty accordion sections.
       */
      const validAccordion = form.accordion
        .map((item) => ({
          title: item.title?.trim() || "",
          content: item.content?.trim() || "",
        }))
        .filter(
          (item) => item.title || item.content
        );

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", form.description.trim());
      formData.append("brand", form.brand.trim());
      formData.append("category", category);

      formData.append(
        "tags",
        JSON.stringify(tags)
      );

      formData.append(
        "price",
        String(price)
      );

      if (form.compareAtPrice) {
        formData.append(
          "compareAtPrice",
          String(Number(form.compareAtPrice))
        );
      }

      formData.append(
        "currency",
        form.currency.trim() || "INR"
      );

      formData.append(
        "variantLabel",
        form.variantLabel.trim() || "Size"
      );

      formData.append(
        "variants",
        JSON.stringify(validVariants)
      );

      formData.append(
        "badges",
        JSON.stringify(validBadges)
      );

      formData.append(
        "accordion",
        JSON.stringify(validAccordion)
      );

      formData.append(
        "inStock",
        String(form.inStock)
      );

      formData.append(
        "totalStock",
        String(
          Math.max(0, Number(form.totalStock || 0))
        )
      );

      formData.append(
        "rating",
        String(
          Math.min(
            5,
            Math.max(0, Number(form.rating || 0))
          )
        )
      );

      formData.append(
        "reviewCount",
        String(
          Math.max(0, Number(form.reviewCount || 0))
        )
      );

      formData.append(
        "isActive",
        String(form.isActive)
      );

      /*
       * Existing Cloudinary images that should remain.
       */
      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      /*
       * Newly selected files.
       */
      newImages.forEach((file) => {
        formData.append("images", file);
      });

      if (product) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[900px] flex-col overflow-hidden bg-[#F6F1EA] shadow-2xl">

        {/* HEADER */}
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-black/10 bg-[#F6F1EA]/95 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
              <span>
                {product ? "Edit product" : "New product"}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#9CAF88]" />

              <span>Decorden</span>
            </div>

            <h2 className="mt-1 truncate text-xl font-medium tracking-tight sm:text-2xl">
              {product ? product.name : "Add a new product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition hover:border-black/20 hover:bg-black hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        {/* CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-5 pb-32 sm:p-8">

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* BASIC INFORMATION */}
            <FormSection
              icon={<Package size={17} />}
              title="Basic information"
              description="The core information customers see throughout your store."
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Product name" required>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      handleNameChange(e.target.value)
                    }
                    placeholder="Luxury Chesterfield Sofa"
                    className="input"
                  />
                </Field>

                <Field
                  label="Slug"
                  required
                  hint={
                    slugStatus === "automatic"
                      ? "Automatically generated"
                      : slugStatus === "manual"
                        ? "Manually customized"
                        : undefined
                  }
                >
                  <div className="relative">
                    <input
                      value={form.slug}
                      onChange={(e) =>
                        handleSlugChange(e.target.value)
                      }
                      placeholder="luxury-chesterfield-sofa"
                      className="input pr-10"
                    />

                    {slugManuallyEdited && (
                      <button
                        type="button"
                        onClick={resetSlugToAutomatic}
                        title="Generate from product name"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#6E805D] hover:text-black"
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </Field>

                <Field label="Brand">
                  <input
                    value={form.brand}
                    onChange={(e) =>
                      updateField("brand", e.target.value)
                    }
                    placeholder="Decorden"
                    className="input"
                  />
                </Field>

                <Field label="Category" required>
                  <input
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value
                      )
                    }
                    placeholder="Sofas"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  rows={6}
                  className="input resize-none"
                  placeholder="Describe the product, materials, design, comfort and other important details..."
                />

                <p className="mt-2 text-[11px] text-black/35">
                  Write a clear description that helps customers
                  understand the product.
                </p>
              </Field>

              <Field
                label="Tags"
                hint="Comma separated"
              >
                <input
                  value={form.tags}
                  onChange={(e) =>
                    updateField("tags", e.target.value)
                  }
                  className="input"
                  placeholder="chesterfield, luxury, leather, sofa"
                />
              </Field>
            </FormSection>

            {/* PRICING */}
            <FormSection
              icon={<Tag size={17} />}
              title="Pricing & inventory"
              description="Set pricing, stock and product availability."
            >
              <div className="grid gap-5 sm:grid-cols-3">

                <Field label="Selling price" required>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/40">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        updateField(
                          "price",
                          e.target.value
                        )
                      }
                      className="input pl-8"
                      placeholder="89999"
                    />
                  </div>
                </Field>

                <Field label="Compare at price">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/40">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.compareAtPrice}
                      onChange={(e) =>
                        updateField(
                          "compareAtPrice",
                          e.target.value
                        )
                      }
                      className="input pl-8"
                      placeholder="109999"
                    />
                  </div>
                </Field>

                <Field label="Currency">
                  <input
                    value={form.currency}
                    onChange={(e) =>
                      updateField(
                        "currency",
                        e.target.value.toUpperCase()
                      )
                    }
                    className="input"
                    placeholder="INR"
                  />
                </Field>

                <Field label="Total stock">
                  <input
                    type="number"
                    min="0"
                    value={form.totalStock}
                    onChange={(e) =>
                      updateField(
                        "totalStock",
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="10"
                  />
                </Field>

                <Field label="Rating">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      updateField(
                        "rating",
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="4.8"
                  />
                </Field>

                <Field label="Review count">
                  <input
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={(e) =>
                      updateField(
                        "reviewCount",
                        e.target.value
                      )
                    }
                    className="input"
                    placeholder="24"
                  />
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <Toggle
                  checked={form.inStock}
                  onChange={(checked) =>
                    updateField("inStock", checked)
                  }
                  title="Available for purchase"
                  description="Customers can purchase this product."
                />

                <Toggle
                  checked={form.isActive}
                  onChange={(checked) =>
                    updateField("isActive", checked)
                  }
                  title="Product is active"
                  description="Show this product on the storefront."
                />

              </div>
            </FormSection>

            {/* IMAGES */}
            <FormSection
              icon={<Images size={17} />}
              title="Product images"
              description={`Add up to 10 images. ${imageSlotsLeft} slot${imageSlotsLeft === 1 ? "" : "s"} remaining.`}
            >
              {totalImageCount === 0 ? (
                <div className="rounded-3xl border border-dashed border-black/15 bg-[#F9F7F3] p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <ImagePlus
                      size={23}
                      className="text-black/40"
                    />
                  </div>

                  <h4 className="mt-4 text-sm font-medium">
                    Add product images
                  </h4>

                  <p className="mt-1 text-xs text-black/40">
                    High quality product images work best.
                  </p>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#20251F] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#9CAF88] hover:text-[#20251F]">
                    <ImagePlus size={15} />
                    Choose images

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <ImagePreview
                      key={
                        image.public_id ||
                        `${image.url}-${index}`
                      }
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      onRemove={() =>
                        removeExistingImage(index)
                      }
                      badge="Saved"
                    />
                  ))}

                  {newImages.map((file, index) => (
                    <ImagePreview
                      key={`${file.name}-${index}`}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      onRemove={() =>
                        removeNewImage(index)
                      }
                      badge="New"
                    />
                  ))}

                  {imageSlotsLeft > 0 && (
                    <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white transition hover:border-[#9CAF88] hover:bg-[#F9F7F3]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F1EA] transition group-hover:bg-[#9CAF88]">
                        <Plus
                          size={18}
                          className="text-black/45"
                        />
                      </div>

                      <span className="mt-2 text-xs font-medium text-black/50">
                        Add image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              )}

              <p className="text-[11px] text-black/35">
                Existing images stay on Cloudinary unless you remove
                them. Newly selected images will be uploaded when you
                save the product.
              </p>
            </FormSection>

            {/* VARIANTS */}
            <FormSection
              icon={<SlidersHorizontal size={17} />}
              title="Variants"
              description="Create different sizes, configurations or versions of this product."
            >
              <Field label="Variant label">
                <input
                  value={form.variantLabel}
                  onChange={(e) =>
                    updateField(
                      "variantLabel",
                      e.target.value
                    )
                  }
                  className="input"
                  placeholder="Size"
                />
              </Field>

              {form.variants.length === 0 ? (
                <EmptyState
                  title="No variants"
                  description="Add variants if this product comes in different sizes or configurations."
                />
              ) : (
                <div className="space-y-3">
                  {form.variants.map(
                    (variant, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-black/10 bg-[#F9F7F3] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                            Variant {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeVariant(index)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={variant.label}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                            placeholder="3 Seater"
                            className="input"
                          />

                          <input
                            value={variant.sku || ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="SKU-001"
                            className="input"
                          />

                          <input
                            type="number"
                            min="0"
                            value={
                              variant.price ?? ""
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                e.target.value === ""
                                  ? 0
                                  : Number(
                                      e.target.value
                                    )
                              )
                            }
                            placeholder="89999"
                            className="input"
                          />

                          <input
                            type="number"
                            min="0"
                            value={
                              variant.stockQuantity ?? 0
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stockQuantity",
                                e.target.value === ""
                                  ? 0
                                  : Number(
                                      e.target.value
                                    )
                              )
                            }
                            placeholder="10"
                            className="input"
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                          <label className="flex cursor-pointer items-center gap-2 text-xs text-black/60">
                            <input
                              type="checkbox"
                              checked={
                                variant.inStock
                              }
                              onChange={(e) =>
                                updateVariant(
                                  index,
                                  "inStock",
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 accent-[#20251F]"
                            />

                            Variant available
                          </label>

                          <span className="text-[11px] text-black/35">
                            Stock:{" "}
                            {variant.stockQuantity ?? 0}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-medium transition hover:border-[#9CAF88] hover:bg-[#F9F7F3]"
              >
                <Plus size={15} />
                Add variant
              </button>
            </FormSection>

            {/* BADGES */}
            <FormSection
              title="Badges"
              description="Small highlights displayed around the product."
            >
              {form.badges.length === 0 ? (
                <EmptyState
                  title="No badges"
                  description="Examples: Free Delivery, Premium Quality, Made in India."
                />
              ) : (
                <div className="space-y-3">
                  {form.badges.map(
                    (badge, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-black/10 bg-[#F9F7F3] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                            Badge {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeBadge(index)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <input
                            value={badge.icon || ""}
                            onChange={(e) =>
                              updateBadge(
                                index,
                                "icon",
                                e.target.value
                              )
                            }
                            placeholder="truck"
                            className="input"
                          />

                          <input
                            value={badge.title || ""}
                            onChange={(e) =>
                              updateBadge(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Free Delivery"
                            className="input"
                          />

                          <input
                            value={
                              badge.subtitle || ""
                            }
                            onChange={(e) =>
                              updateBadge(
                                index,
                                "subtitle",
                                e.target.value
                              )
                            }
                            placeholder="Across India"
                            className="input"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={addBadge}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-medium transition hover:border-[#9CAF88] hover:bg-[#F9F7F3]"
              >
                <Plus size={15} />
                Add badge
              </button>
            </FormSection>

            {/* ACCORDION */}
            <FormSection
              title="Product information"
              description="Expandable sections such as dimensions, materials, care instructions and delivery information."
            >
              {form.accordion.length === 0 ? (
                <EmptyState
                  title="No information sections"
                  description="Add useful product details that customers can expand."
                />
              ) : (
                <div className="space-y-3">
                  {form.accordion.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-black/10 bg-[#F9F7F3] p-4"
                      >
                        <div className="flex gap-3">
                          <input
                            value={item.title || ""}
                            onChange={(e) =>
                              updateAccordion(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Dimensions"
                            className="input flex-1"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeAccordion(index)
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <textarea
                          value={item.content || ""}
                          onChange={(e) =>
                            updateAccordion(
                              index,
                              "content",
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Product information..."
                          className="input mt-3 resize-none"
                        />
                      </div>
                    )
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={addAccordion}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-medium transition hover:border-[#9CAF88] hover:bg-[#F9F7F3]"
              >
                <Plus size={15} />
                Add information section
              </button>
            </FormSection>

          </div>

          {/* FOOTER */}
          <div className="fixed bottom-0 right-0 z-40 w-full max-w-[900px] border-t border-black/10 bg-[#F6F1EA]/95 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 rounded-full border border-black/10 bg-white py-3 text-sm font-medium transition hover:border-black/20 hover:bg-black/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#20251F] py-3 text-sm font-medium text-white transition hover:bg-[#9CAF88] hover:text-[#20251F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? product
                    ? "Updating..."
                    : "Creating..."
                  : product
                    ? "Update product"
                    : "Create product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UI COMPONENTS                                                              */
/* -------------------------------------------------------------------------- */

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="border-b border-black/5 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6F1EA] text-[#6E805D]">
              {icon}
            </div>
          )}

          <div>
            <h3 className="font-medium tracking-tight">
              {title}
            </h3>

            {description && (
              <p className="mt-1 max-w-2xl text-xs leading-5 text-black/40">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-black/60">
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </span>

        {hint && (
          <span className="text-[10px] text-black/30">
            {hint}
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-black/10 bg-[#F9F7F3] p-4">
      <div className="pr-4">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-4 text-black/40">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#6E805D]"
            : "bg-black/15"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function ImagePreview({
  src,
  alt,
  onRemove,
  badge,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
  badge: string;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F9F7F3]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
        {badge}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-50"
      >
        <X size={15} />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-[#F9F7F3] px-5 py-6 text-center">
      <ChevronDown
        size={18}
        className="mx-auto text-black/20"
      />

      <p className="mt-2 text-xs font-medium text-black/55">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-[11px] leading-4 text-black/35">
        {description}
      </p>
    </div>
  );
}