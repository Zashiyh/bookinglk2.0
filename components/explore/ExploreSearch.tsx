"use client";

import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";

interface ExploreSearchProps {
  location: string;
  setLocation: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function ExploreSearch({
  location,
  setLocation,
  search,
  setSearch,
}: ExploreSearchProps) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-3 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#111] dark:shadow-black/40">
      <div className="grid gap-2 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto]">
        {/* Destination */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-white/[0.04]">
          <MapPin className="h-5 w-5 shrink-0 text-[#B8860B] dark:text-[#F5D76E]" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Destination
            </p>

            <input
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Where are you going?"
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Check in */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-[#B8860B] dark:text-[#F5D76E]" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Check in
            </p>

            <p className="mt-1 text-sm font-semibold">
              Add date
            </p>
          </div>
        </div>

        {/* Check out */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-[#B8860B] dark:text-[#F5D76E]" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Check out
            </p>

            <p className="mt-1 text-sm font-semibold">
              Add date
            </p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
          <Users className="h-5 w-5 shrink-0 text-[#B8860B] dark:text-[#F5D76E]" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Guests
            </p>

            <p className="mt-1 text-sm font-semibold">
              2 guests
            </p>
          </div>
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => {
            if (!location.trim() && !search.trim()) {
              setSearch("hotel");
            }
          }}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 text-sm font-black text-black transition hover:bg-[#F5D76E]"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Search keyword */}
      <div className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-zinc-400" />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search hotels, destinations..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}