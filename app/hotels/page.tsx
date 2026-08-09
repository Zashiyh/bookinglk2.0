"use client";

import {
  SlidersHorizontal,
  Search,
  MapPin,
  ChevronDown,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
        throw new Error("Failed to fetch hotels");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch hotels"
        );
      }

      setHotels(Array.isArray(result.data) ? result.data : []);
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

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const sortedHotels = [...hotels].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.priceFrom - b.priceFrom;

      case "price-high":
        return b.priceFrom - a.priceFrom;

      case "rating":
        return b.rating - a.rating;

      default:
        return b.rating - a.rating;
    }
  });

  const normalizedSearch = search.trim().toLowerCase();

  const filteredHotels = normalizedSearch
    ? sortedHotels.filter((hotel) => {
        const hotelName =
          hotel.name?.toLowerCase() ?? "";

        const hotelCity =
          hotel.location?.city?.toLowerCase() ?? "";

        return (
          hotelName.includes(normalizedSearch) ||
          hotelCity.includes(normalizedSearch)
        );
      })
    : sortedHotels;

  function clearFilters() {
    setCity("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Header */}
      <section className="border-b border-zinc-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />

                <span>Explore Sri Lanka</span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Find your perfect stay
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">
                Discover hotels, resorts, villas and unique
                stays across Sri Lanka.
              </p>
            </div>

            {/* Search */}
            <div className="flex w-full max-w-xl items-center rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#111111]">
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
                  className="mr-1 rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
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
          </aside>

          {/* Results */}
          <section className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
                {/* Mobile Filters */}
                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium lg:hidden dark:border-white/10 dark:bg-[#111111]"
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
                    className="appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none dark:border-white/10 dark:bg-[#111111]"
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

            {/* Error */}
            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <h2 className="text-lg font-semibold">
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

            {/* Loading */}
            {loading && !error && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <HotelCardSkeleton key={index} />
                  )
                )}
              </div>
            )}

            {/* Empty */}
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

                  <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                    Try changing your destination, price
                    range or filters.
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

            {/* Hotels */}
            {!loading &&
              !error &&
              filteredHotels.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel._id}
                      hotel={hotel}
                    />
                  ))}
                </div>
              )}
          </section>
        </div>
      </div>

      {/* Mobile Filters */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 dark:bg-[#111111]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                aria-label="Close filters"
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-white/10"
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
              onClick={() => setMobileFilters(false)}
              className="mt-6 w-full rounded-2xl bg-[#D4AF37] py-3.5 font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

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
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-[#B8860B] dark:text-[#F5D76E]"
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
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
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
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
            placeholder="Max"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium">
          Rating
        </label>

        <div className="mt-3 space-y-2">
          {[
            ["5", "5.0+ only"],
            ["4", "4.0+ only"],
            ["3", "3.0+ only"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={(event) =>
                  setRating(event.target.value)
                }
                className="accent-[#D4AF37]"
              />

              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}