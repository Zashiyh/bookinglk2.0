"use client";

import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  MapPin,
} from "lucide-react";

type Props = {
  selectedCity: string;
  setSelectedCity: (value: string) => void;

  minPrice: number;
  maxPrice: number;
  rating: number;
  propertyType: string;

  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setRating: (value: number) => void;
  setPropertyType: (value: string) => void;

  onClear: () => void;
};

const cities = [
  "All",
  "Kandy",
  "Colombo",
  "Galle",
  "Ella",
  "Nuwara Eliya",
  "Sigiriya",
  "Bentota",
];

const propertyTypes = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Hotel",
    value: "HOTEL",
  },
  {
    label: "Resort",
    value: "RESORT",
  },
  {
    label: "Villa",
    value: "VILLA",
  },
  {
    label: "Guest House",
    value: "GUEST_HOUSE",
  },
  {
    label: "Apartment",
    value: "APARTMENT",
  },
];

export default function ExploreFilters({
  selectedCity,
  setSelectedCity,

  minPrice,
  maxPrice,
  rating,
  propertyType,

  setMinPrice,
  setMaxPrice,
  setRating,
  setPropertyType,

  onClear,
}: Props) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#111]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-black">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-400 transition hover:text-[#B8860B] dark:hover:text-[#F5D76E]"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="my-6 h-px bg-black/5 dark:bg-white/5" />

      {/* =====================================================
          DESTINATION
      ===================================================== */}

      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <MapPin className="h-3.5 w-3.5" />
          Destination
        </p>

        <div className="relative mt-3">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
            }}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-sm font-semibold text-zinc-800 outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#151515] dark:text-white"
          >
            {cities.map((city) => (
              <option
                key={city}
                value={city}
                className="bg-white text-black dark:bg-[#151515] dark:text-white"
              >
                {city}
              </option>
            ))}
          </select>

          {/* Custom arrow */}

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="m6 9 6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div className="my-7 h-px bg-black/5 dark:bg-white/5" />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Price per night
        </p>

        <div className="mt-4 flex gap-2">
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] text-zinc-400">
              Minimum
            </label>

            <input
              type="number"
              value={minPrice || ""}
              min={0}
              placeholder="Min"
              onChange={(e) =>
                setMinPrice(
                  e.target.value === ""
                    ? 0
                    : Math.max(
                        0,
                        Number(e.target.value)
                      )
                )
              }
              className="h-10 w-full rounded-xl border border-black/10 bg-transparent px-3 text-xs outline-none transition focus:border-[#D4AF37] dark:border-white/10"
            />
          </div>

          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-[10px] text-zinc-400">
              Maximum
            </label>

            <input
              type="number"
              value={maxPrice || ""}
              min={0}
              placeholder="Max"
              onChange={(e) =>
                setMaxPrice(
                  e.target.value === ""
                    ? 0
                    : Math.max(
                        0,
                        Number(e.target.value)
                      )
                )
              }
              className="h-10 w-full rounded-xl border border-black/10 bg-transparent px-3 text-xs outline-none transition focus:border-[#D4AF37] dark:border-white/10"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          RATING
      ===================================================== */}

      <div className="my-7 h-px bg-black/5 dark:bg-white/5" />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Guest rating
        </p>

        <div className="mt-3 space-y-2">
          {[4.5, 4, 3.5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setRating(
                  rating === value ? 0 : value
                )
              }
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs transition ${
                rating === value
                  ? "bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]"
                  : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />

              {value}+
              <span className="text-zinc-400">
                rating
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          PROPERTY TYPE
      ===================================================== */}

      <div className="my-7 h-px bg-black/5 dark:bg-white/5" />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Property type
        </p>

        <div className="mt-3 space-y-2">
          {propertyTypes.map((type) => (
            <button
              key={type.value || "all"}
              type="button"
              onClick={() =>
                setPropertyType(type.value)
              }
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
                propertyType === type.value
                  ? "bg-[#D4AF37]/10 font-bold text-[#B8860B] dark:text-[#F5D76E]"
                  : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}