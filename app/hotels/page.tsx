"use client";

import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Navbar } from "@/components/navbar/navbar";

import HotelCard, {
  HotelCardData,
} from "@/components/hotel/HotelCard";

import HotelCardSkeleton from "@/components/hotel/HotelCardSkeleton";

/* =========================================================
   TYPES
========================================================= */

type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "rating";

type Hotel = HotelCardData & {
  _id: string;

  name: string;

  description?: string;

  propertyType?: string;

  location?: {
    city?: string;
    district?: string;
    address?: string;
  };

  coordinates?: {
    type?: "Point";
    coordinates?: [number, number];
  };

  priceFrom?: number;

  rating?: number;

  reviewCount?: number;

  images?: string[];

  thumbnail?: string;

  isPublished?: boolean;

  totalRooms?: number;

  bookedRooms?: number;

  availableRooms?: number;

  hasAvailableRooms?: boolean;
};

/* =========================================================
   CONSTANTS
========================================================= */

const ITEMS_PER_PAGE = 12;

/* =========================================================
   CITIES
========================================================= */

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

/* =========================================================
   PROPERTY TYPES
========================================================= */

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

/* =========================================================
   PAGE
========================================================= */

export default function HotelsPage() {
  /* =======================================================
     HOTELS
  ======================================================= */

  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [city, setCity] =
    useState("All");

  const [propertyType, setPropertyType] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [rating, setRating] =
    useState("");

  /* =======================================================
     SORT
  ======================================================= */

  const [sort, setSort] =
    useState<SortOption>(
      "recommended"
    );

  /* =======================================================
     MOBILE FILTER
  ======================================================= */

  const [mobileFilters, setMobileFilters] =
    useState(false);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalHotels, setTotalHotels] =
    useState(0);

  /* =======================================================
     FETCH HOTELS
  ======================================================= */

  const fetchHotels =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        /* =================================================
           CITY
        ================================================= */

        if (
          city &&
          city !== "All"
        ) {
          params.set(
            "city",
            city
          );
        }

        /* =================================================
           PROPERTY TYPE
        ================================================= */

        if (propertyType) {
          params.set(
            "propertyType",
            propertyType
          );
        }

        /* =================================================
           MIN PRICE
        ================================================= */

        if (minPrice) {
          const value =
            Number(minPrice);

          if (
            Number.isFinite(value) &&
            value >= 0
          ) {
            params.set(
              "minPrice",
              value.toString()
            );
          }
        }

        /* =================================================
           MAX PRICE
        ================================================= */

        if (maxPrice) {
          const value =
            Number(maxPrice);

          if (
            Number.isFinite(value) &&
            value > 0
          ) {
            params.set(
              "maxPrice",
              value.toString()
            );
          }
        }

        /* =================================================
           RATING
        ================================================= */

        if (rating) {
          params.set(
            "rating",
            rating
          );
        }

        /* =================================================
           PAGINATION
        ================================================= */

        params.set(
          "page",
          page.toString()
        );

        /*
         * IMPORTANT
         *
         * Exactly 12 cards per page.
         */

        params.set(
          "limit",
          ITEMS_PER_PAGE.toString()
        );

        /* =================================================
           API REQUEST
        ================================================= */

        const query =
          params.toString();

        const response =
          await fetch(
            `/api/hotels?${query}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch hotels."
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch hotels."
          );
        }

        /* =================================================
           HOTEL DATA
        ================================================= */

        const apiHotels =
          Array.isArray(
            result.data
          )
            ? result.data
            : [];

        setHotels(
          apiHotels as Hotel[]
        );

        /* =================================================
           PAGINATION DATA
        ================================================= */

        const pagination =
          result.pagination;

        setTotalPages(
          Math.max(
            Number(
              pagination?.totalPages
            ) || 1,
            1
          )
        );

        setTotalHotels(
          Number(
            pagination?.total
          ) || 0
        );
      } catch (err) {
        console.error(
          "Hotel fetch error:",
          err
        );

        setHotels([]);

        setTotalHotels(0);

        setTotalPages(1);

        setError(
          "We couldn't load the hotels. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, [
      city,
      propertyType,
      minPrice,
      maxPrice,
      rating,
      page,
    ]);

  /* =======================================================
     FETCH WHEN FILTERS / PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setPage(1);
  }, [
    city,
    propertyType,
    minPrice,
    maxPrice,
    rating,
  ]);

  /* =======================================================
     SEARCH + SORT
  ======================================================= */

  const filteredHotels =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      let result =
        [...hotels];

      /* =================================================
         SEARCH
      ================================================= */

      if (query) {
        result =
          result.filter(
            (hotel) => {
              const name =
                hotel.name
                  ?.toLowerCase() ||
                "";

              const hotelCity =
                hotel.location
                  ?.city
                  ?.toLowerCase() ||
                "";

              const district =
                hotel.location
                  ?.district
                  ?.toLowerCase() ||
                "";

              const address =
                hotel.location
                  ?.address
                  ?.toLowerCase() ||
                "";

              const description =
                hotel.description
                  ?.toLowerCase() ||
                "";

              const type =
                hotel.propertyType
                  ?.toLowerCase() ||
                "";

              return (
                name.includes(query) ||
                hotelCity.includes(query) ||
                district.includes(query) ||
                address.includes(query) ||
                description.includes(query) ||
                type.includes(query)
              );
            }
          );
      }

      /* =================================================
         SORT
      ================================================= */

      result.sort(
        (a, b) => {
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
        }
      );

      return result;
    }, [
      hotels,
      search,
      sort,
    ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters =
    () => {
      setCity("All");

      setPropertyType("");

      setMinPrice("");

      setMaxPrice("");

      setRating("");

      setSearch("");

      setSort(
        "recommended"
      );

      setPage(1);
    };

  /* =======================================================
     CITY CHANGE
  ======================================================= */

  const handleCityChange =
    (value: string) => {
      setCity(value);
      setPage(1);
    };

  /* =======================================================
     PROPERTY TYPE CHANGE
  ======================================================= */

  const handlePropertyTypeChange =
    (value: string) => {
      setPropertyType(value);
      setPage(1);
    };

  /* =======================================================
     PREVIOUS PAGE
  ======================================================= */

  const handlePrevious =
    () => {
      if (page <= 1) {
        return;
      }

      setPage(
        (current) =>
          Math.max(
            current - 1,
            1
          )
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /* =======================================================
     NEXT PAGE
  ======================================================= */

  const handleNext =
    () => {
      if (
        page >= totalPages
      ) {
        return;
      }

      setPage(
        (current) =>
          Math.min(
            current + 1,
            totalPages
          )
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /* =======================================================
     PAGINATION RANGE
  ======================================================= */

  const showingFrom =
    totalHotels === 0
      ? 0
      : (page - 1) *
          ITEMS_PER_PAGE +
        1;

  const showingTo =
    Math.min(
      page *
        ITEMS_PER_PAGE,
      totalHotels
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-[#050505] dark:text-white">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-zinc-200/80 bg-zinc-50/80 pb-10 pt-32 dark:border-white/10 dark:bg-[#080808]">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center text-center">

            {/* BADGE */}

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8860B] dark:text-[#F5D76E]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              Explore Sri Lanka

            </div>

            {/* TITLE */}

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">

              Find your perfect stay

            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">

              Discover hotels, resorts,
              villas and unique stays
              across Sri Lanka.

            </p>

            {/* SEARCH */}

            <div className="mt-8 flex w-full max-w-2xl items-center rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm transition focus-within:border-[#D4AF37] focus-within:shadow-md dark:border-white/10 dark:bg-[#111111]">

              <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search hotels, destinations..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mr-1 rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">

        <div className="flex gap-8">

          {/* =================================================
              DESKTOP FILTER
          ================================================= */}

          <aside className="hidden w-72 shrink-0 lg:block">

            <div className="sticky top-28">

              <Filters
                city={city}
                setCity={
                  handleCityChange
                }
                propertyType={
                  propertyType
                }
                setPropertyType={
                  handlePropertyTypeChange
                }
                minPrice={
                  minPrice
                }
                setMinPrice={
                  (value) => {
                    setMinPrice(
                      value
                    );
                    setPage(1);
                  }
                }
                maxPrice={
                  maxPrice
                }
                setMaxPrice={
                  (value) => {
                    setMaxPrice(
                      value
                    );
                    setPage(1);
                  }
                }
                rating={
                  rating
                }
                setRating={
                  (value) => {
                    setRating(
                      value
                    );
                    setPage(1);
                  }
                }
                clearFilters={
                  clearFilters
                }
              />

            </div>

          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <section className="min-w-0 flex-1">

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

              <div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">

                  {loading
                    ? "Finding stays..."
                    : `${filteredHotels.length} ${
                        filteredHotels.length ===
                        1
                          ? "property"
                          : "properties"
                      } shown`}

                </p>

                {!loading &&
                  totalHotels >
                    0 && (
                    <p className="mt-1 text-xs text-zinc-400">

                      Showing{" "}
                      {showingFrom}
                      –
                      {showingTo} of{" "}
                      {totalHotels}{" "}
                      published
                      properties

                    </p>
                  )}

              </div>

              <div className="flex items-center gap-2">

                {/* MOBILE FILTER */}

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(
                      true
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-50 lg:hidden dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5"
                >

                  <SlidersHorizontal className="h-4 w-4" />

                  Filters

                </button>

                {/* SORT */}

                <div className="relative">

                  <select
                    value={sort}
                    onChange={(
                      event
                    ) =>
                      setSort(
                        event.target
                          .value as SortOption
                      )
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
                ACTIVE FILTER INFO
            ================================================= */}

            {(city !== "All" ||
              propertyType ||
              minPrice ||
              maxPrice ||
              rating) && (

              <div className="mb-7 flex flex-wrap items-center gap-2">

                <span className="text-xs font-medium text-zinc-400">
                  Active:
                </span>

                {city !==
                  "All" && (

                  <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#9a7800] dark:text-[#F5D76E]">
                    {city}
                  </span>

                )}

                {propertyType && (

                  <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#9a7800] dark:text-[#F5D76E]">

                    {
                      propertyTypes.find(
                        (item) =>
                          item.value ===
                          propertyType
                      )?.label
                    }

                  </span>

                )}

                {minPrice && (

                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold dark:bg-white/10">

                    Min Rs.{" "}
                    {minPrice}

                  </span>

                )}

                {maxPrice && (

                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold dark:bg-white/10">

                    Max Rs.{" "}
                    {maxPrice}

                  </span>

                )}

                {rating && (

                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold dark:bg-white/10">

                    {rating}+
                    rating

                  </span>

                )}

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="ml-1 text-xs font-semibold text-zinc-400 transition hover:text-[#B8860B] dark:hover:text-[#F5D76E]"
                >
                  Clear all
                </button>

              </div>

            )}

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
                  onClick={
                    fetchHotels
                  }
                  className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                >
                  Try again
                </button>

              </div>

            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading &&
              !error && (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                  {Array.from({
                    length: ITEMS_PER_PAGE,
                  }).map(
                    (_, index) => (

                      <HotelCardSkeleton
                        key={
                          index
                        }
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
              filteredHotels.length ===
                0 && (

                <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-[#111111]">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">

                    <Search className="h-6 w-6 text-[#D4AF37]" />

                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    No stays found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">

                    Try changing your
                    destination, price
                    range or filters.

                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
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
              filteredHotels.length >
                0 && (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                  {filteredHotels.map(
                    (hotel) => (

                      <HotelCard
                        key={
                          hotel._id
                        }
                        hotel={
                          hotel
                        }
                      />

                    )
                  )}

                </div>

              )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading &&
              !error &&
              totalPages > 1 && (

                <div className="mt-12 flex flex-col items-center gap-4">

                  {/* BUTTONS */}

                  <div className="flex items-center gap-3">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      disabled={
                        page <= 1
                      }
                      onClick={
                        handlePrevious
                      }
                      className="rounded-full border border-zinc-200 px-5 py-2.5 text-xs font-semibold transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      Previous
                    </button>

                    {/* PAGE */}

                    <div className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-xs font-black text-black">
                      {page} /{" "}
                      {totalPages}
                    </div>

                    {/* NEXT */}

                    <button
                      type="button"
                      disabled={
                        page >=
                        totalPages
                      }
                      onClick={
                        handleNext
                      }
                      className="rounded-full border border-zinc-200 px-5 py-2.5 text-xs font-semibold transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      Next
                    </button>

                  </div>

                  {/* RANGE */}

                  <p className="text-xs text-zinc-400">

                    Showing{" "}
                    {showingFrom}
                    –
                    {showingTo} of{" "}
                    {totalHotels}{" "}
                    properties

                  </p>

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

          {/* OVERLAY */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFilters(
                false
              )
            }
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* DRAWER */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[2rem] border-t border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">

            {/* HEADER */}

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
                  setMobileFilters(
                    false
                  )
                }
                aria-label="Close filters"
                className="rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* FILTERS */}

            <Filters
              city={city}
              setCity={
                handleCityChange
              }
              propertyType={
                propertyType
              }
              setPropertyType={
                handlePropertyTypeChange
              }
              minPrice={
                minPrice
              }
              setMinPrice={
                (value) => {
                  setMinPrice(
                    value
                  );
                  setPage(1);
                }
              }
              maxPrice={
                maxPrice
              }
              setMaxPrice={
                (value) => {
                  setMaxPrice(
                    value
                  );
                  setPage(1);
                }
              }
              rating={
                rating
              }
              setRating={
                (value) => {
                  setRating(
                    value
                  );
                  setPage(1);
                }
              }
              clearFilters={
                clearFilters
              }
            />

            {/* SHOW RESULTS */}

            <button
              type="button"
              onClick={() =>
                setMobileFilters(
                  false
                )
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

/* =========================================================
   FILTER TYPES
========================================================= */

interface FiltersProps {
  city: string;

  setCity: (
    value: string
  ) => void;

  propertyType: string;

  setPropertyType: (
    value: string
  ) => void;

  minPrice: string;

  setMinPrice: (
    value: string
  ) => void;

  maxPrice: string;

  setMaxPrice: (
    value: string
  ) => void;

  rating: string;

  setRating: (
    value: string
  ) => void;

  clearFilters: () => void;
}

/* =========================================================
   FILTER COMPONENT
========================================================= */

function Filters({
  city,
  setCity,
  propertyType,
  setPropertyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  clearFilters,
}: FiltersProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">

      {/* =================================================
          HEADER
      ================================================= */}

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
          onClick={
            clearFilters
          }
          className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-[#B8860B] dark:hover:text-[#F5D76E]"
        >

          <RotateCcw className="h-3 w-3" />

          Reset

        </button>

      </div>

      <div className="my-6 h-px bg-zinc-100 dark:bg-white/5" />

      {/* =================================================
          DESTINATION
      ================================================= */}

      <div>

        <label
          htmlFor="destination"
          className="text-sm font-medium"
        >
          Destination
        </label>

        <div className="relative mt-2">

          <select
            id="destination"
            value={city}
            onChange={(event) =>
              setCity(
                event.target.value
              )
            }
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-3 pr-10 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111]"
          >

            {cities.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item ===
                  "All"
                    ? "All destinations"
                    : item}
                </option>

              )
            )}

          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

        </div>

      </div>

      {/* =================================================
          PROPERTY TYPE
      ================================================= */}

      <div className="mt-7">

        <label
          htmlFor="property-type"
          className="text-sm font-medium"
        >
          Property type
        </label>

        <div className="relative mt-2">

          <select
            id="property-type"
            value={
              propertyType
            }
            onChange={(event) =>
              setPropertyType(
                event.target
                  .value
              )
            }
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-3 pr-10 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111]"
          >

            {propertyTypes.map(
              (item) => (

                <option
                  key={
                    item.value ||
                    "all"
                  }
                  value={
                    item.value
                  }
                >
                  {item.label}
                </option>

              )
            )}

          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

        </div>

      </div>

      {/* =================================================
          PRICE
      ================================================= */}

      <div className="mt-7">

        <label className="text-sm font-medium">
          Price per night
        </label>

        <div className="mt-2 grid grid-cols-2 gap-2">

          <input
            type="number"
            min="0"
            value={
              minPrice
            }
            onChange={(event) =>
              setMinPrice(
                event.target
                  .value
              )
            }
            placeholder="Min"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />

          <input
            type="number"
            min="0"
            value={
              maxPrice
            }
            onChange={(event) =>
              setMaxPrice(
                event.target
                  .value
              )
            }
            placeholder="Max"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          />

        </div>

      </div>

      {/* =================================================
          RATING
      ================================================= */}

      <div className="mt-7">

        <label className="text-sm font-medium">
          Guest rating
        </label>

        <div className="mt-3 space-y-2">

          {[
            [
              "5",
              "5.0+ rating",
            ],
            [
              "4",
              "4.0+ rating",
            ],
            [
              "3",
              "3.0+ rating",
            ],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setRating(
                    rating ===
                      value
                      ? ""
                      : value
                  )
                }
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  rating ===
                  value
                    ? "bg-[#D4AF37]/10 font-semibold text-[#9a7800] dark:text-[#F5D76E]"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/5"
                }`}
              >

                <Star
                  className={`h-4 w-4 ${
                    rating ===
                    value
                      ? "fill-current"
                      : ""
                  }`}
                />

                {label}

              </button>

            )
          )}

        </div>

      </div>

    </div>
  );
}