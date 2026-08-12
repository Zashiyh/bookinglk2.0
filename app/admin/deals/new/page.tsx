"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  Image as ImageIcon,
  Loader2,
  Percent,
  Tag,
} from "lucide-react";
import Link from "next/link";

type Hotel = {
  _id: string;
  name: string;
  location?: {
    city?: string;
  };
  priceFrom?: number;
};

type DealForm = {
  hotelId: string;
  title: string;
  slug: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  originalPrice: string;
  dealPrice: string;
  startDate: string;
  endDate: string;
  maxBookings: string;
  promoCode: string;
  image: string;
  isFeatured: boolean;
  isPublished: boolean;
};

const initialForm: DealForm = {
  hotelId: "",
  title: "",
  slug: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  originalPrice: "",
  dealPrice: "",
  startDate: "",
  endDate: "",
  maxBookings: "",
  promoCode: "",
  image: "",
  isFeatured: false,
  isPublished: true,
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewDealPage() {
  const router = useRouter();

  const [form, setForm] = useState<DealForm>(initialForm);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadHotels() {
      try {
        setLoadingHotels(true);

        const response = await fetch("/api/hotels", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load hotels."
          );
        }

        const hotelData =
          result.hotels ||
          result.data ||
          [];

        setHotels(Array.isArray(hotelData) ? hotelData : []);
      } catch (err) {
        console.error("LOAD HOTELS ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load hotels."
        );
      } finally {
        setLoadingHotels(false);
      }
    }

    loadHotels();
  }, []);

  function updateField<K extends keyof DealForm>(
    field: K,
    value: DealForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: createSlug(value),
    }));
  }

  function handleHotelChange(hotelId: string) {
    const hotel = hotels.find(
      (item) => item._id === hotelId
    );

    setForm((current) => ({
      ...current,
      hotelId,
      originalPrice:
        current.originalPrice ||
        hotel?.priceFrom?.toString() ||
        "",
    }));
  }

  function calculateDealPrice() {
    const original = Number(form.originalPrice);
    const discount = Number(form.discountValue);

    if (!original || !discount) {
      return;
    }

    let price = original;

    if (form.discountType === "PERCENTAGE") {
      price =
        original -
        original * (discount / 100);
    } else {
      price = original - discount;
    }

    updateField(
      "dealPrice",
      Math.max(0, Math.round(price)).toString()
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.hotelId) {
      setError("Please select a hotel.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a deal title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!form.originalPrice) {
      setError("Please enter the original price.");
      return;
    }

    if (!form.discountValue) {
      setError("Please enter the discount value.");
      return;
    }

    if (!form.dealPrice) {
      setError("Please enter the deal price.");
      return;
    }

    if (!form.startDate) {
      setError("Please select the start date.");
      return;
    }

    if (!form.endDate) {
      setError("Please select the end date.");
      return;
    }

    if (
      new Date(form.endDate) <=
      new Date(form.startDate)
    ) {
      setError(
        "End date must be after start date."
      );
      return;
    }

    const discountValue = Number(
      form.discountValue
    );

    const originalPrice = Number(
      form.originalPrice
    );

    const dealPrice = Number(
      form.dealPrice
    );

    if (
      Number.isNaN(discountValue) ||
      discountValue < 0
    ) {
      setError("Invalid discount value.");
      return;
    }

    if (
      form.discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      setError(
        "Percentage discount cannot exceed 100%."
      );
      return;
    }

    if (
      Number.isNaN(originalPrice) ||
      originalPrice < 0
    ) {
      setError("Invalid original price.");
      return;
    }

    if (
      Number.isNaN(dealPrice) ||
      dealPrice < 0
    ) {
      setError("Invalid deal price.");
      return;
    }

    setSaving(true);

    try {
      /*
       * IMPORTANT:
       *
       * These names MUST match Deal model:
       *
       * discountType
       * discountValue
       * startDate
       * endDate
       */

      const payload = {
        hotelId: form.hotelId,

        title: form.title.trim(),

        slug:
          form.slug.trim() ||
          createSlug(form.title),

        description:
          form.description.trim(),

        discountType:
          form.discountType,

        discountValue,

        originalPrice,

        dealPrice,

        currency: "LKR",

        startDate: new Date(
          form.startDate
        ).toISOString(),

        endDate: new Date(
          form.endDate
        ).toISOString(),

        ...(form.maxBookings
          ? {
              maxBookings: Number(
                form.maxBookings
              ),
            }
          : {}),

        ...(form.promoCode.trim()
          ? {
              promoCode:
                form.promoCode
                  .trim()
                  .toUpperCase(),
            }
          : {}),

        ...(form.image.trim()
          ? {
              image: form.image.trim(),
            }
          : {}),

        isFeatured:
          form.isFeatured,

        isPublished:
          form.isPublished,
      };

      console.log(
        "CREATE DEAL PAYLOAD:",
        payload
      );

      const response = await fetch(
        "/api/admin/deals",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const text =
        await response.text();

      let result: any = null;

      try {
        result = text
          ? JSON.parse(text)
          : null;
      } catch {
        throw new Error(
          `Server returned invalid JSON (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to create deal."
        );
      }

      setSuccess(
        "Deal created successfully."
      );

      setTimeout(() => {
        router.push("/admin/deals");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error(
        "CREATE DEAL ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the deal."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/deals"
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Deals
            </Link>

            <h1 className="text-3xl font-black tracking-tight">
              Create New Deal
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Create a special offer for one
              of your hotels.
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
            <Check size={18} />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Tag
                  size={19}
                  className="text-purple-400"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Basic Information
                </h2>

                <p className="text-xs text-white/40">
                  Deal title and hotel details
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Hotel */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Hotel
                </label>

                <select
                  value={form.hotelId}
                  onChange={(event) =>
                    handleHotelChange(
                      event.target.value
                    )
                  }
                  disabled={loadingHotels}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-purple-400/50"
                >
                  <option
                    value=""
                    className="bg-[#111]"
                  >
                    {loadingHotels
                      ? "Loading hotels..."
                      : "Select a hotel"}
                  </option>

                  {hotels.map((hotel) => (
                    <option
                      key={hotel._id}
                      value={hotel._id}
                      className="bg-[#111]"
                    >
                      {hotel.name}
                      {hotel.location?.city
                        ? ` — ${hotel.location.city}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Deal Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value
                    )
                  }
                  placeholder="Summer Escape 25% Off"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-purple-400/50"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Slug
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      createSlug(
                        event.target.value
                      )
                    )
                  }
                  placeholder="summer-escape-25-off"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-purple-400/50"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe what makes this deal special..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-purple-400/50"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
                <Percent
                  size={19}
                  className="text-pink-400"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Pricing & Discount
                </h2>

                <p className="text-xs text-white/40">
                  Configure the deal price
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {/* Discount Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Discount Type
                </label>

                <select
                  value={form.discountType}
                  onChange={(event) =>
                    updateField(
                      "discountType",
                      event.target.value as
                        | "PERCENTAGE"
                        | "FIXED"
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pink-400/50"
                >
                  <option
                    value="PERCENTAGE"
                    className="bg-[#111]"
                  >
                    Percentage
                  </option>

                  <option
                    value="FIXED"
                    className="bg-[#111]"
                  >
                    Fixed Amount
                  </option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Discount
                </label>

                <input
                  type="number"
                  min="0"
                  max={
                    form.discountType ===
                    "PERCENTAGE"
                      ? "100"
                      : undefined
                  }
                  value={form.discountValue}
                  onChange={(event) =>
                    updateField(
                      "discountValue",
                      event.target.value
                    )
                  }
                  placeholder={
                    form.discountType ===
                    "PERCENTAGE"
                      ? "25"
                      : "5000"
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pink-400/50"
                />
              </div>

              {/* Original */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Original Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={(event) =>
                    updateField(
                      "originalPrice",
                      event.target.value
                    )
                  }
                  placeholder="30000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pink-400/50"
                />
              </div>

              {/* Deal Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Deal Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.dealPrice}
                  onChange={(event) =>
                    updateField(
                      "dealPrice",
                      event.target.value
                    )
                  }
                  placeholder="22500"
                  className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm outline-none focus:border-emerald-400/50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={calculateDealPrice}
              className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Calculate Deal Price
            </button>
          </section>

          {/* Dates */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Calendar
                  size={19}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Deal Period
                </h2>

                <p className="text-xs text-white/40">
                  When this offer is available
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Start Date
                </label>

                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(event) =>
                    updateField(
                      "startDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  End Date
                </label>

                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(event) =>
                    updateField(
                      "endDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Maximum Bookings
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.maxBookings}
                  onChange={(event) =>
                    updateField(
                      "maxBookings",
                      event.target.value
                    )
                  }
                  placeholder="Unlimited"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Promo Code
                </label>

                <input
                  type="text"
                  value={form.promoCode}
                  onChange={(event) =>
                    updateField(
                      "promoCode",
                      event.target.value
                    )
                  }
                  placeholder="SUMMER25"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase outline-none placeholder:text-white/20 focus:border-blue-400/50"
                />
              </div>
            </div>
          </section>

          {/* Image */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <ImageIcon
                  size={19}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Deal Image
                </h2>

                <p className="text-xs text-white/40">
                  Add an image URL for the deal
                </p>
              </div>
            </div>

            <input
              type="url"
              value={form.image}
              onChange={(event) =>
                updateField(
                  "image",
                  event.target.value
                )
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-cyan-400/50"
            />
          </section>

          {/* Publishing */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="space-y-4">

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField(
                      "isFeatured",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-purple-500"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Featured Deal
                  </span>

                  <span className="block text-xs text-white/40">
                    Show this deal in featured sections.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    updateField(
                      "isPublished",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-emerald-500"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Publish Deal
                  </span>

                  <span className="block text-xs text-white/40">
                    Make this deal visible to users.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin/deals"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/10 transition-all duration-200 hover:scale-[1.02] hover:bg-[#F5D76E] hover:shadow-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Create Deal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}