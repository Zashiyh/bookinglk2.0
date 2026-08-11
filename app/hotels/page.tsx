
"use client";

import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";


import { Navbar } from "@/components/navbar/navbar";
import HotelCard, {
  HotelCardData,
} from "@/components/hotel/HotelCard";
import HotelCardSkeleton from "@/components/hotel/HotelCardSkeleton";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const [mobileFilters, setMobileFilters] = useState(false);

  // =====================================================
  // FETCH HOTELS
  // =====================================================

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (city.trim()) {
        params.set("city", city.trim());
      }

      if (minPrice) {
        params.set("minPrice", minPrice);
      }

      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      }

      if (rating) {
        params.set("rating", rating);
      }

      const queryString = params.toString();

      const response = await fetch(
        queryString
          ? `/api/hotels?${queryString}`
          : "/api/hotels",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotels.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch hotels."
        );
      }

      setHotels(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error("Hotel fetch error:", err);

      setError(
        "We couldn't load the hotels. Please try again."
      );

      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [city, minPrice, maxPrice, rating]);

  // =====================================================
  // INITIAL / FILTER FETCH
  // =====================================================

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // =====================================================
  // SORT
  // =====================================================

  const sortedHotels = useMemo(() => {
    return [...hotels].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return (
            (a.priceFrom ?? 0) -
            (b.priceFrom ?? 0)
          );

        case "price-high":
          return (
            (b.priceFrom ?? 0) -
            (a.priceFrom ?? 0)
          );

        case "rating":
          return (
            (b.rating ?? 0) -
            (a.rating ?? 0)
          );

        case "recommended":
        default:
          return (
            (b.rating ?? 0) -
            (a.rating ?? 0)
          );
      }
    });
  }, [hotels, sort]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredHotels = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return sortedHotels;
    }

    return sortedHotels.filter((hotel) => {
      const hotelName =
        hotel.name?.toLowerCase() ?? "";

      const hotelCity =
        hotel.location?.city?.toLowerCase() ?? "";

      const hotelDistrict =
        hotel.location?.district?.toLowerCase() ?? "";

      return (
        hotelName.includes(normalizedSearch) ||
        hotelCity.includes(normalizedSearch) ||
        hotelDistrict.includes(normalizedSearch)
      );
    });
  }, [search, sortedHotels]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  function clearFilters() {
    setCity("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("recommended");
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-[#050505] dark:text-white">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-zinc-200/80 bg-zinc-50/80 pb-10 pt-32 dark:border-white/10 dark:bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center text-center">

            {/* Small badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8860B] dark:text-[#F5D76E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Explore Sri Lanka
            </div>

            {/* Title */}

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find your perfect stay
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              Discover hotels, resorts, villas and
              unique stays across Sri Lanka.
            </p>

            {/* Search */}

            <div className="mt-8 flex w-full max-w-2xl items-center rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm transition focus-within:border-[#D4AF37] focus-within:shadow-md dark:border-white/10 dark:bg-[#111111]">

              <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search hotels or destinations..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="mr-1 rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">

        <div className="flex gap-8">

          {/* =================================================
              DESKTOP FILTERS
          ================================================= */}

          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28">
              <Filters
                city={city}
                setCity={setCity}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                rating={rating}
                setRating={setRating}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <section className="min-w-0 flex-1">

            {/* Toolbar */}

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {loading
                    ? "Finding stays..."
                    : `${filteredHotels.length} ${
                        filteredHotels.length === 1
                          ? "property"
                          : "properties"
                      } found`}
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* Mobile filters */}

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(true)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-50 lg:hidden dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                {/* Sort */}

                <div className="relative">

                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value)
                    }
                    className="appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
                  >
                    <option value="recommended">
                      Recommended
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Highest Rated
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                </div>
              </div>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                  <X className="h-6 w-6 text-red-500" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Something went wrong
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchHotels}
                  className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                >
                  Try again
                </button>

              </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && !error && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <HotelCardSkeleton
                      key={index}
                    />
                  )
                )}
              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
              !error &&
              filteredHotels.length === 0 && (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-[#111111]">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                    <Search className="h-6 w-6 text-[#D4AF37]" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    No stays found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Try changing your destination,
                    price range or filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                  >
                    Clear filters
                  </button>

                </div>
              )}

            {/* =================================================
                HOTEL GRID
            ================================================= */}

            {!loading &&
              !error &&
              filteredHotels.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                  {filteredHotels.map(
                    (hotel) => (
                      <HotelCard
                        key={hotel._id}
                        hotel={hotel}
                      />
                    )
                  )}

                </div>
              )}

          </section>
        </div>
      </section>

      {/* =================================================
          MOBILE FILTER DRAWER
      ================================================= */}

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFilters(false)
            }
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] border-t border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                  Refine results
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilters(false)
                }
                aria-label="Close filters"
                className="rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <Filters
              city={city}
              setCity={setCity}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              rating={rating}
              setRating={setRating}
              clearFilters={clearFilters}
            />

            <button
              type="button"
              onClick={() =>
                setMobileFilters(false)
              }
              className="mt-7 w-full rounded-2xl bg-[#D4AF37] py-3.5 font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Show results
            </button>

          </div>
        </div>
      )}

    

    </main>
  );
}

// =====================================================
// FILTER TYPES
// =====================================================

interface FiltersProps {
  city: string;
  setCity: (value: string) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  rating: string;
  setRating: (value: string) => void;

  clearFilters: () => void;
}

// =====================================================
// FILTER COMPONENT
// =====================================================

function Filters({
  city,
  setCity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  clearFilters,
}: FiltersProps) {
  return (
    <div className="space-y-7">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
            Refine
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-[#B8860B] transition hover:text-[#8B6914] dark:text-[#F5D76E]"
        >
          Clear all
        </button>

      </div>

      {/* Destination */}

      <div>

        <label
          htmlFor="destination"
          className="text-sm font-medium"
        >
          Destination
        </label>

        <input
          id="destination"
          value={city}
          onChange={(event) =>
            setCity(event.target.value)
          }
          placeholder="e.g. Kandy"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111]"
        />

      </div>

      {/* Price */}

      <div>

        <label className="text-sm font-medium">
          Price per night
        </label>

        <div className="mt-2 grid grid-cols-2 gap-2">

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(event.target.value)
            }
            placeholder="Min"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
            placeholder="Max"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />

        </div>
      </div>

      {/* Rating */}

      <div>

        <label className="text-sm font-medium">
          Rating
        </label>

        <div className="mt-3 space-y-3">

          {[
            ["5", "5.0+ only"],
            ["4", "4.0+ only"],
            ["3", "3.0+ only"],
          ].map(
            ([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
              >

                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={(event) =>
                    setRating(
                      event.target.value
                    )
                  }
                  className="h-4 w-4 accent-[#D4AF37]"
                />

                {label}

              </label>
            )
          )}

        </div>
      </div>

    </div>
  );
}

