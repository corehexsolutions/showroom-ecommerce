import { useState } from "react";

export type ShippingAddress = {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type ShippingFormProps = {
  initialValues?: Partial<ShippingAddress>;
  onSubmit: (address: ShippingAddress) => void;
  loading?: boolean;
};

const defaultValues: ShippingAddress = {
  name: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export function ShippingForm({
  initialValues,
  onSubmit,
  loading = false,
}: ShippingFormProps) {
  const [form, setForm] = useState<ShippingAddress>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const updateField = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<
      Record<keyof ShippingAddress, string>
    > = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.postalCode.trim()) {
      newErrors.postalCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.postalCode.trim())) {
      newErrors.postalCode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
    });
  };

  const inputClass = (field: keyof ShippingAddress) =>
    `mt-2 w-full border bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-line focus:border-[var(--brand-green-muted)]"
    }`;

  const labelClass =
    "text-[10px] uppercase tracking-[0.18em] text-charcoal/55";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NAME */}
      <div>
        <label className={labelClass}>
          Full Name *
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
          placeholder="Enter your full name"
          className={inputClass("name")}
          autoComplete="name"
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* PHONE + EMAIL */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            Phone Number *
          </label>

          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              updateField(
                "phone",
                e.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            placeholder="10-digit mobile number"
            className={inputClass("phone")}
            autoComplete="tel"
            inputMode="numeric"
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Email Address *
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
            placeholder="you@example.com"
            className={inputClass("email")}
            autoComplete="email"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* ADDRESS */}
      <div>
        <label className={labelClass}>
          Address *
        </label>

        <textarea
          value={form.addressLine1}
          onChange={(e) =>
            updateField(
              "addressLine1",
              e.target.value
            )
          }
          placeholder="House number, street, area"
          rows={3}
          className={`${inputClass(
            "addressLine1"
          )} resize-none`}
          autoComplete="street-address"
        />

        {errors.addressLine1 && (
          <p className="mt-1 text-xs text-red-600">
            {errors.addressLine1}
          </p>
        )}
      </div>

      {/* LANDMARK */}
      <div>
        <label className={labelClass}>
          Apartment / Landmark
          <span className="ml-1 normal-case tracking-normal">
            (optional)
          </span>
        </label>

        <input
          type="text"
          value={form.addressLine2}
          onChange={(e) =>
            updateField(
              "addressLine2",
              e.target.value
            )
          }
          placeholder="Apartment, floor, landmark"
          className={inputClass("addressLine2")}
        />
      </div>

      {/* CITY / STATE */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            City *
          </label>

          <input
            type="text"
            value={form.city}
            onChange={(e) =>
              updateField("city", e.target.value)
            }
            placeholder="City"
            className={inputClass("city")}
            autoComplete="address-level2"
          />

          {errors.city && (
            <p className="mt-1 text-xs text-red-600">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            State *
          </label>

          <input
            type="text"
            value={form.state}
            onChange={(e) =>
              updateField("state", e.target.value)
            }
            placeholder="State"
            className={inputClass("state")}
            autoComplete="address-level1"
          />

          {errors.state && (
            <p className="mt-1 text-xs text-red-600">
              {errors.state}
            </p>
          )}
        </div>
      </div>

      {/* PINCODE / COUNTRY */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            Pincode *
          </label>

          <input
            type="text"
            value={form.postalCode}
            onChange={(e) =>
              updateField(
                "postalCode",
                e.target.value.replace(/\D/g, "").slice(0, 6)
              )
            }
            placeholder="6-digit pincode"
            className={inputClass("postalCode")}
            autoComplete="postal-code"
            inputMode="numeric"
          />

          {errors.postalCode && (
            <p className="mt-1 text-xs text-red-600">
              {errors.postalCode}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Country
          </label>

          <input
            type="text"
            value={form.country}
            readOnly
            className={`${inputClass(
              "country"
            )} bg-[#F6F1EA]`}
          />
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 bg-[var(--brand-deep-forest-green)] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Processing..."
          : "Continue to Payment"}
      </button>
    </form>
  );
}