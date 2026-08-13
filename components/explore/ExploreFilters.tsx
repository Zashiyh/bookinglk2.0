"use client";

import { RotateCcw, SlidersHorizontal, Star } from "lucide-react";

type Props = {
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

export default function ExploreFilters({
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
    <div className="rounded-3xl border border-black/5 bg-white p-5 dark:border-white/5 dark:bg-[#111]">
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

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Price per night
        </p>

        <div className="mt-4 flex gap-2">
          <input
            type="number"
            value={minPrice}
            min={0}
            onChange={(e) =>
              setMinPrice(Number(e.target.value))
            }
            className="h-10 w-full rounded-xl border border-black/10 bg-transparent px-3 text-xs outline-none focus:border-[#D4AF37] dark:border-white/10"
          />

          <input
            type="number"
            value={maxPrice}
            min={0}
            onChange={(e) =>
              setMaxPrice(Number(e.target.value))
            }
            className="h-10 w-full rounded-xl border border-black/10 bg-transparent px-3 text-xs outline-none focus:border-[#D4AF37] dark:border-white/10"
          />
        </div>
      </div>

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
                setRating(rating === value ? 0 : value)
              }
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs transition ${
                rating === value
                  ? "bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]"
                  : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              {value}+ rating
            </button>
          ))}
        </div>
      </div>

      <div className="my-7 h-px bg-black/5 dark:bg-white/5" />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Property type
        </p>

        <div className="mt-3 space-y-2">
          {[
            "All",
            "Hotel",
            "Resort",
            "Beach",
            "Luxury",
          ].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPropertyType(type)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
                propertyType === type
                  ? "bg-[#D4AF37]/10 font-bold text-[#B8860B] dark:text-[#F5D76E]"
                  : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}