"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  type: "ALL" | "PERCENTAGE" | "FIXED";
  setType: (
    value: "ALL" | "PERCENTAGE" | "FIXED"
  ) => void;
};

export default function DealFilters({
  search,
  setSearch,
  type,
  setType,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search deals or hotels..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-yellow-400/40"
        />
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={17}
          className="text-white/40"
        />

        {[
          ["ALL", "All Deals"],
          ["PERCENTAGE", "Percentage"],
          ["FIXED", "Fixed"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setType(
                value as
                  | "ALL"
                  | "PERCENTAGE"
                  | "FIXED"
              )
            }
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              type === value
                ? "bg-yellow-400 text-black"
                : "border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}