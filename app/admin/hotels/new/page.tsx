"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Save,
  X,
  ExternalLink,
} from "lucide-react";

type PropertyType =
  | "HOTEL"
  | "RESORT"
  | "VILLA"
  | "APARTMENT"
  | "GUEST_HOUSE"
  | "BOUTIQUE_HOTEL"
  | "HOSTEL"
  | "HOMESTAY";

interface HotelForm {
  name: string;
  slug: string;
  description: string;
  propertyType: PropertyType;

  address: string;
  city: string;
  district: string;
  province: string;
  country: string;

  longitude: string;
  latitude: string;

  priceFrom: string;

  amenities: string[];
  images: string[];

  isVerified: boolean;
  isPublished: boolean;
}

const propertyTypes: {
  value: PropertyType;
  label: string;
}[] = [
  {
    value: "HOTEL",
    label: "Hotel",
  },
  {
    value: "RESORT",
    label: "Resort",
  },
  {
    value: "VILLA",
    label: "Villa",
  },
  {
    value: "APARTMENT",
    label: "Apartment",
  },
  {
    value: "GUEST_HOUSE",
    label: "Guest House",
  },
  {
    value: "BOUTIQUE_HOTEL",
    label: "Boutique Hotel",
  },
  {
    value: "HOSTEL",
    label: "Hostel",
  },
  {
    value: "HOMESTAY",
    label: "Homestay",
  },
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getSafePropertyType(
  value: unknown
): PropertyType {
  const validTypes: PropertyType[] = [
    "HOTEL",
    "RESORT",
    "VILLA",
    "APARTMENT",
    "GUEST_HOUSE",
    "BOUTIQUE_HOTEL",
    "HOSTEL",
    "HOMESTAY",
  ];

  if (
    typeof value === "string" &&
    validTypes.includes(
      value as PropertyType
    )
  ) {
    return value as PropertyType;
  }

  return "HOTEL";
}

function isGoogleDriveUrl(url: string) {
  return (
    url.includes("drive.google.com") ||
    url.includes("docs.google.com")
  );
}

function getGoogleDrivePreviewUrl(url: string) {
  try {
    const parsed = new URL(url);

    const match =
      parsed.pathname.match(
        /\/d\/([^/]+)/
      );

    if (match?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    const id =
      parsed.searchParams.get("id");

    if (id) {
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

export default function AdminNewHotelPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<HotelForm>({
      name: "",
      slug: "",
      description: "",
      propertyType: "HOTEL",

      address: "",
      city: "",
      district: "",
      province: "",
      country: "Sri Lanka",

      longitude: "",
      latitude: "",

      priceFrom: "",

      amenities: [],
      images: [],

      isVerified: false,
      isPublished: false,
    });

  const [amenityInput, setAmenityInput] =
    useState("");

  const [imageInput, setImageInput] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function updateField<
    K extends keyof HotelForm
  >(
    field: K,
    value: HotelForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(
    value: string
  ) {
    setForm((current) => ({
      ...current,

      name: value,

      slug:
        current.slug === "" ||
        current.slug ===
          createSlug(current.name)
          ? createSlug(value)
          : current.slug,
    }));
  }

  function addAmenity() {
    const value =
      amenityInput.trim();

    if (!value) return;

    const exists =
      form.amenities.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );

    if (exists) {
      setAmenityInput("");
      return;
    }

    setForm((current) => ({
      ...current,

      amenities: [
        ...current.amenities,
        value,
      ],
    }));

    setAmenityInput("");
  }

  function removeAmenity(
    index: number
  ) {
    setForm((current) => ({
      ...current,

      amenities:
        current.amenities.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  function addImage() {
    const value =
      imageInput.trim();

    if (!value) return;

    if (form.images.includes(value)) {
      setImageInput("");
      return;
    }

    setForm((current) => ({
      ...current,

      images: [
        ...current.images,
        value,
      ],
    }));

    setImageInput("");
  }

  function removeImage(
    index: number
  ) {
    setForm((current) => ({
      ...current,

      images:
        current.images.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "Hotel name is required."
      );
      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Hotel slug is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Hotel description is required."
      );
      return;
    }

    if (!form.address.trim()) {
      setError(
        "Hotel address is required."
      );
      return;
    }

    if (!form.city.trim()) {
      setError(
        "City is required."
      );
      return;
    }

    if (!form.district.trim()) {
      setError(
        "District is required."
      );
      return;
    }

    if (!form.province.trim()) {
      setError(
        "Province is required."
      );
      return;
    }

    const price =
      Number(form.priceFrom);

    if (
      form.priceFrom === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        "Enter a valid starting price."
      );
      return;
    }

    const longitude =
      Number(form.longitude);

    const latitude =
      Number(form.latitude);

    if (
      form.longitude === "" ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError(
        "Enter a valid longitude between -180 and 180."
      );
      return;
    }

    if (
      form.latitude === "" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      setError(
        "Enter a valid latitude between -90 and 90."
      );
      return;
    }

    try {
      setSaving(true);

      

      const response = await fetch(
        "/api/admin/hotels",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name:
              form.name.trim(),

            slug:
              createSlug(
                form.slug.trim()
              ),

            description:
              form.description.trim(),

            propertyType:
              form.propertyType,

            location: {
              address:
                form.address.trim(),

              city:
                form.city.trim(),

              district:
                form.district.trim(),

              province:
                form.province.trim(),

              country:
                form.country.trim() ||
                "Sri Lanka",
            },

            /*
             * GeoJSON uses:
             *
             * [longitude, latitude]
             */

            coordinates: {
              type: "Point",

              coordinates: [
                longitude,
                latitude,
              ],
            },

            rating: 0,

            reviewCount: 0,

            priceFrom: price,

            currency: "LKR",

            amenities:
              form.amenities,

            images:
              form.images,

            isVerified:
              form.isVerified,

            isPublished:
              form.isPublished,
          }),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.text();

        console.error(
          "CREATE_HOTEL_NON_JSON:",
          text
        );

        throw new Error(
          `Server returned ${response.status} instead of JSON.`
        );
      }

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            `Unable to create hotel (${response.status}).`
        );
      }

      setSuccess(
        "Hotel created successfully."
      );

      /*
       * Give the user a moment to see
       * the success message.
       */

      setTimeout(() => {
        router.push(
          "/admin/hotels"
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "CREATE_HOTEL_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create hotel."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full pb-12">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/hotels"
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to hotels
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">

              <Building2 className="h-6 w-6 text-[#D4AF37]" />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Hotel management
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Add hotel
              </h1>

            </div>

          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Add a new property to
            BookingLK with complete
            information, location,
            amenities and publishing
            settings.
          </p>

        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() =>
            router.push(
              "/admin/hotels"
            )
          }
          className="hidden rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-300 lg:inline-flex"
        >
          Cancel
        </button>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">

          <X className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            {error}
          </span>

        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">

          <Check className="h-4 w-4" />

          <span>
            {success}
          </span>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-7">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              01
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Basic information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Main details guests will see.
            </p>

          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="Hotel name"
              required
            >
              <input
                value={form.name}
                onChange={(event) =>
                  handleNameChange(
                    event.target.value
                  )
                }
                placeholder="e.g. Grand Kandy Hotel"
                className="input"
              />
            </Field>

            <Field
              label="Slug"
              required
              hint="Used in the hotel URL."
            >
              <input
                value={form.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    createSlug(
                      event.target.value
                    )
                  )
                }
                placeholder="grand-kandy-hotel"
                className="input"
              />
            </Field>

            <Field
              label="Property type"
              required
            >
              <select
                value={
                  form.propertyType
                }
                onChange={(event) =>
                  updateField(
                    "propertyType",
                    getSafePropertyType(
                      event.target.value
                    )
                  )
                }
                className="input"
              >
                {propertyTypes.map(
                  (type) => (
                    <option
                      key={
                        type.value
                      }
                      value={
                        type.value
                      }
                    >
                      {type.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            {/* PRICE */}

            <Field
              label="Starting price"
              required
              hint="Per night"
            >
              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-[4.25rem] items-center justify-center">

                  <span className="text-xs font-extrabold tracking-wide text-[#D4AF37]">
                    LKR
                  </span>

                </div>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    form.priceFrom
                  }
                  onChange={(event) =>
                    updateField(
                      "priceFrom",
                      event.target.value
                    )
                  }
                  placeholder="15000"
                  className="input price-input"
                />

              </div>
            </Field>

            <div className="lg:col-span-2">

              <Field
                label="Description"
                required
              >
                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the hotel, rooms, surroundings and guest experience..."
                  rows={6}
                  className="input resize-none"
                />
              </Field>

            </div>

          </div>

        </section>

        {/* LOCATION */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-7">

          <div className="mb-7 flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <MapPin className="h-5 w-5 text-[#D4AF37]" />

            </div>

            <div>

              <h2 className="font-bold">
                Location
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Help guests find the
                property.
              </p>

            </div>

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="sm:col-span-2">

              <Field
                label="Address"
                required
              >
                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="123 Temple Road"
                  className="input"
                />
              </Field>

            </div>

            <Field
              label="City"
              required
            >
              <input
                value={form.city}
                onChange={(event) =>
                  updateField(
                    "city",
                    event.target.value
                  )
                }
                placeholder="Kandy"
                className="input"
              />
            </Field>

            <Field
              label="District"
              required
            >
              <input
                value={form.district}
                onChange={(event) =>
                  updateField(
                    "district",
                    event.target.value
                  )
                }
                placeholder="Kandy"
                className="input"
              />
            </Field>

            <Field
              label="Province"
              required
            >
              <input
                value={form.province}
                onChange={(event) =>
                  updateField(
                    "province",
                    event.target.value
                  )
                }
                placeholder="Central"
                className="input"
              />
            </Field>

            <Field label="Country">

              <input
                value={form.country}
                onChange={(event) =>
                  updateField(
                    "country",
                    event.target.value
                  )
                }
                className="input"
              />

            </Field>

            <Field
              label="Longitude"
              required
              hint="Between -180 and 180"
            >
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={
                  form.longitude
                }
                onChange={(event) =>
                  updateField(
                    "longitude",
                    event.target.value
                  )
                }
                placeholder="80.6337"
                className="input"
              />
            </Field>

            <Field
              label="Latitude"
              required
              hint="Between -90 and 90"
            >
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={
                  form.latitude
                }
                onChange={(event) =>
                  updateField(
                    "latitude",
                    event.target.value
                  )
                }
                placeholder="7.2906"
                className="input"
              />
            </Field>

          </div>

        </section>

        {/* AMENITIES */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-7">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              02
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Amenities
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add facilities available
              at this property.
            </p>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              value={
                amenityInput
              }
              onChange={(event) =>
                setAmenityInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event.preventDefault();
                  addAmenity();
                }
              }}
              placeholder="e.g. Free WiFi"
              className="input"
            />

            <button
              type="button"
              onClick={
                addAmenity
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>

          </div>

          {form.amenities.length >
            0 && (
            <div className="mt-5 flex flex-wrap gap-2">

              {form.amenities.map(
                (
                  amenity,
                  index
                ) => (
                  <span
                    key={`${amenity}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-xs font-semibold text-[#a88416] dark:text-[#D4AF37]"
                  >

                    {amenity}

                    <button
                      type="button"
                      onClick={() =>
                        removeAmenity(
                          index
                        )
                      }
                      className="rounded-full p-0.5 transition hover:bg-[#D4AF37]/20"
                    >
                      <X className="h-3 w-3" />
                    </button>

                  </span>
                )
              )}

            </div>
          )}

        </section>

        {/* IMAGES */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-7">

          <div className="mb-7 flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <ImagePlus className="h-5 w-5 text-[#D4AF37]" />

            </div>

            <div>

              <h2 className="font-bold">
                Hotel images
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Add direct image URLs or
                Google Drive share links.
              </p>

            </div>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              value={imageInput}
              onChange={(event) =>
                setImageInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event.preventDefault();
                  addImage();
                }
              }}
              placeholder="https://example.com/hotel.jpg"
              className="input"
            />

            <button
              type="button"
              onClick={
                addImage
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />

              Add image
            </button>

          </div>

          {/* GOOGLE DRIVE INFO */}

          {imageInput &&
            isGoogleDriveUrl(
              imageInput
            ) && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">

                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

                <div>

                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Google Drive image
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Make sure the Drive
                    file is shared as
                    "Anyone with the link".
                    The system will convert
                    supported Drive links to
                    an image preview URL.
                  </p>

                </div>

              </div>
            )}

          {form.images.length >
            0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {form.images.map(
                (
                  image,
                  index
                ) => {
                  const previewUrl =
                    isGoogleDriveUrl(
                      image
                    )
                      ? getGoogleDrivePreviewUrl(
                          image
                        )
                      : image;

                  return (
                    <div
                      key={`${image}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/5"
                    >

                      <img
                        src={
                          previewUrl
                        }
                        alt={`Hotel image ${
                          index + 1
                        }`}
                        className="h-40 w-full object-cover"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.opacity =
                            "0.25";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">

                        <p className="truncate text-xs text-white">
                          Image{" "}
                          {index + 1}
                        </p>

                        {isGoogleDriveUrl(
                          image
                        ) && (
                          <p className="mt-1 text-[10px] text-[#D4AF37]">
                            Google Drive
                          </p>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* PUBLISHING */}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-7">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              03
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Control how this property
              appears on BookingLK.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Toggle
              title="Publish hotel"
              description="Make this property visible to guests."
              checked={
                form.isPublished
              }
              onChange={(value) =>
                updateField(
                  "isPublished",
                  value
                )
              }
            />

            <Toggle
              title="Verified property"
              description="Mark this property as verified."
              checked={
                form.isVerified
              }
              onChange={(value) =>
                updateField(
                  "isVerified",
                  value
                )
              }
            />

          </div>

        </section>

        {/* SUBMIT */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              router.push(
                "/admin/hotels"
              )
            }
            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-300 dark:hover:border-white/20 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-extrabold text-black shadow-lg shadow-[#D4AF37]/10 transition hover:-translate-y-0.5 hover:bg-[#e0bd4d] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Creating hotel...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />

                Save hotel
              </>
            )}

          </button>

        </div>

      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid rgb(228 228 231);
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease;
        }

        .input:focus {
          border-color: #d4af37;
          box-shadow:
            0 0 0 3px
            rgb(212 175 55 / 0.1);
        }

        .price-input {
          padding-left: 4.75rem;
          font-weight: 600;
        }

        :global(.dark) .input {
          border-color:
            rgb(255 255 255 / 0.1);
          background:
            rgb(255 255 255 / 0.025);
          color: white;
        }

        :global(.dark)
          .input::placeholder {
          color:
            rgb(161 161 170);
        }

        :global(.dark)
          .input:focus {
          border-color: #d4af37;
        }

        :global(.dark)
          .price-input {
          padding-left: 4.75rem;
        }

        select.input {
          cursor: pointer;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-3">

        <label className="text-sm font-semibold">

          {label}

          {required && (
            <span className="ml-1 text-[#D4AF37]">
              *
            </span>
          )}

        </label>

        {hint && (
          <span className="text-[11px] text-zinc-500">
            {hint}
          </span>
        )}

      </div>

      {children}

    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={`flex items-center justify-between gap-5 rounded-2xl border p-5 text-left transition ${
        checked
          ? "border-[#D4AF37]/30 bg-[#D4AF37]/5"
          : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.02]"
      }`}
    >

      <div>

        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>

      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#D4AF37]"
            : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      >

        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </div>

    </button>
  );
}