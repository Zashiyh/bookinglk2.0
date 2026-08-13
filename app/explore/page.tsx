"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Filter,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";

import HotelCard, {
  HotelCardData,
} from "@/components/hotel/HotelCard";

import ExploreFilters from "@/components/explore/ExploreFilters";
import ExploreSearch from "@/components/explore/ExploreSearch";
import SortDropdown from "@/components/explore/SortDropdown";
import { Navbar } from "@/components/navbar/navbar";
/* =========================================================
   LEAFLET MAP
   Dynamic import is important for Next.js SSR
========================================================= */

const ExploreMap = dynamic(
  () =>
    import(
      "@/components/explore/ExploreMap"
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full animate-pulse rounded-[2rem] bg-zinc-200 dark:bg-zinc-900" />
    ),
  }
);

/* =========================================================
   SORT
========================================================= */

type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "rating";

/* =========================================================
   HOTEL TYPE
========================================================= */

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

  images?: string[];

  thumbnail?: string;
};

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
   EXPLORE PAGE
========================================================= */

export default function ExplorePage() {
  /* =======================================================
     HOTELS
  ======================================================= */

  const [hotels, setHotels] =
    useState<Hotel[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     SEARCH
  ======================================================= */

  const [location, setLocation] =
    useState("");

  const [search, setSearch] =
    useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [selectedCity, setSelectedCity] =
    useState("Kandy");

  const [minPrice, setMinPrice] =
    useState(0);

  const [maxPrice, setMaxPrice] =
    useState(0);

  const [rating, setRating] =
    useState(0);

  const [propertyType, setPropertyType] =
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

  const [showFilters, setShowFilters] =
    useState(false);

  /* =======================================================
     MAP SELECTED HOTEL
  ======================================================= */

  const [
    selectedHotelId,
    setSelectedHotelId,
  ] = useState<string | null>(null);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

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

        /* CITY */

        if (
          selectedCity &&
          selectedCity !== "All"
        ) {
          params.set(
            "city",
            selectedCity
          );
        }

        /* PROPERTY TYPE */

        if (propertyType) {
          params.set(
            "propertyType",
            propertyType
          );
        }

        /* MIN PRICE */

        if (minPrice > 0) {
          params.set(
            "minPrice",
            minPrice.toString()
          );
        }

        /* MAX PRICE */

        if (maxPrice > 0) {
          params.set(
            "maxPrice",
            maxPrice.toString()
          );
        }

        /* RATING */

        if (rating > 0) {
          params.set(
            "rating",
            rating.toString()
          );
        }

        /* PAGINATION */

        params.set(
          "page",
          page.toString()
        );

        params.set(
          "limit",
          "12"
        );

        const response =
          await fetch(
            `/api/hotels?${params.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch hotels"
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch hotels"
          );
        }

        const apiHotels =
          Array.isArray(result.data)
            ? result.data
            : [];

        setHotels(
          apiHotels as Hotel[]
        );

        setTotalPages(
          Number(
            result.pagination
              ?.totalPages
          ) || 1
        );
      } catch (err) {
        console.error(
          "Explore hotels error:",
          err
        );

        setHotels([]);
        setError(
          "Unable to load hotels right now."
        );
      } finally {
        setLoading(false);
      }
    }, [
      selectedCity,
      propertyType,
      minPrice,
      maxPrice,
      rating,
      page,
    ]);

  /* =======================================================
     LOAD HOTELS
  ======================================================= */

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  /* =======================================================
     LOCATION CHANGE
  ======================================================= */

  const handleLocationChange = (
    value: string
  ) => {
    setLocation(value);

    const normalized =
      value
        .trim()
        .toLowerCase();

    const matchedCity =
      cities.find(
        (city) =>
          city.toLowerCase() ===
          normalized
      );

    if (matchedCity) {
      setSelectedCity(
        matchedCity
      );

      setPage(1);
      setSelectedHotelId(
        null
      );
    }
  };

  /* =======================================================
     CITY CHANGE
  ======================================================= */

  const handleCityChange = (
    city: string
  ) => {
    setSelectedCity(city);

    setLocation(
      city === "All"
        ? ""
        : city
    );

    setPage(1);
    setSelectedHotelId(null);
  };

  /* =======================================================
     PROPERTY TYPE
  ======================================================= */

  const handlePropertyTypeChange = (
    value: string
  ) => {
    setPropertyType(value);
    setPage(1);
    setSelectedHotelId(null);
  };

  /* =======================================================
     SEARCH + CLIENT FILTER
  ======================================================= */

  const filteredHotels =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const locationQuery =
        location
          .trim()
          .toLowerCase();

      return hotels.filter(
        (hotel) => {
          /* SEARCH */

          if (query) {
            const name =
              hotel.name
                ?.toLowerCase() ||
              "";

            const city =
              hotel.location
                ?.city
                ?.toLowerCase() ||
              "";

            const district =
              hotel.location
                ?.district
                ?.toLowerCase() ||
              "";

            const description =
              hotel.description
                ?.toLowerCase() ||
              "";

            const property =
              hotel.propertyType
                ?.toLowerCase() ||
              "";

            const matchesSearch =
              name.includes(
                query
              ) ||
              city.includes(
                query
              ) ||
              district.includes(
                query
              ) ||
              description.includes(
                query
              ) ||
              property.includes(
                query
              );

            if (
              !matchesSearch
            ) {
              return false;
            }
          }

          /* LOCATION */

          if (
            locationQuery &&
            locationQuery !==
              selectedCity.toLowerCase()
          ) {
            const city =
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

            const matchesLocation =
              city.includes(
                locationQuery
              ) ||
              district.includes(
                locationQuery
              ) ||
              address.includes(
                locationQuery
              );

            if (
              !matchesLocation
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      hotels,
      search,
      location,
      selectedCity,
    ]);

  /* =======================================================
     SORT
  ======================================================= */

  const sortedHotels =
    useMemo(() => {
      return [
        ...filteredHotels,
      ].sort((a, b) => {
        switch (sort) {
          case "price-low":
            return (
              (a.priceFrom || 0) -
              (b.priceFrom || 0)
            );

          case "price-high":
            return (
              (b.priceFrom || 0) -
              (a.priceFrom || 0)
            );

          case "rating":
            return (
              (b.rating || 0) -
              (a.rating || 0)
            );

          case "recommended":
          default:
            return (
              (b.rating || 0) -
              (a.rating || 0)
            );
        }
      });
    }, [
      filteredHotels,
      sort,
    ]);

  /* =======================================================
     MAP HOTELS
     Only hotels with valid coordinates
  ======================================================= */

  const mapHotels =
    useMemo(() => {
      return sortedHotels
        .filter((hotel) => {
          const coordinates =
            hotel.coordinates
              ?.coordinates;

          if (
            !Array.isArray(
              coordinates
            ) ||
            coordinates.length !==
              2
          ) {
            return false;
          }

          const longitude =
            coordinates[0];

          const latitude =
            coordinates[1];

          return (
            typeof longitude ===
              "number" &&
            typeof latitude ===
              "number" &&
            Number.isFinite(
              longitude
            ) &&
            Number.isFinite(
              latitude
            )
          );
        })
        .map((hotel) => ({
          _id: hotel._id,
          name: hotel.name,

          location: {
            city:
              hotel.location
                ?.city,

            district:
              hotel.location
                ?.district,

            address:
              hotel.location
                ?.address,
          },

          coordinates:
            hotel.coordinates,

          priceFrom:
            hotel.priceFrom,

          rating:
            hotel.rating,

          images:
            hotel.images,
        }));
    }, [sortedHotels]);

  /* =======================================================
     SELECTED PROPERTY LABEL
  ======================================================= */

  const selectedPropertyLabel =
    propertyTypes.find(
      (item) =>
        item.value ===
        propertyType
    )?.label || "All";

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSelectedCity("All");
    setLocation("");
    setSearch("");
    setMinPrice(0);
    setMaxPrice(0);
    setRating(0);
    setPropertyType("");
    setPage(1);
    setSelectedHotelId(null);
  };

  /* =======================================================
     MAP HOTEL SELECT
  ======================================================= */

  const handleMapHotelSelect =
    (hotel: {
      _id: string;
      name: string;
    }) => {
      setSelectedHotelId(
        hotel._id
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar/>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#111111] to-[#050505]" />

          <motion.div
            animate={{
              x: [0, 70, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[5%] top-[10%] h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[5%] top-[20%] h-96 w-96 rounded-full bg-white/[0.04] blur-[130px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pb-20">
          {/* BACK */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />

              Back
            </button>
          </motion.div>

          {/* HEADING */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl">
              <MapPin className="h-4 w-4 text-[#F5D76E]" />

              Explore Sri Lanka
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Find your
              <span className="block text-[#F5D76E]">
                perfect stay.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
              Discover hotels,
              resorts, villas and
              unique stays across
              Sri Lanka.
            </p>
          </motion.div>

          {/* SEARCH */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="mt-10"
          >
            <ExploreSearch
              location={location}
              setLocation={
                handleLocationChange
              }
              search={search}
              setSearch={setSearch}
            />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-28">
              <ExploreFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                rating={rating}
                propertyType={
                  propertyType
                }
                setMinPrice={
                  setMinPrice
                }
                setMaxPrice={
                  setMaxPrice
                }
                setRating={
                  setRating
                }
                setPropertyType={
                  handlePropertyTypeChange
                }
                onClear={
                  clearFilters
                }
              />
            </div>
          </aside>

          {/* =================================================
              MAIN
          ================================================== */}

          <div className="min-w-0 flex-1">
            {/* TOOLBAR */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black">
                  {loading
                    ? "Finding stays..."
                    : `${sortedHotels.length} stays found`}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />

                  <span>
                    {selectedCity ===
                    "All"
                      ? "Sri Lanka"
                      : selectedCity}
                  </span>

                  {propertyType && (
                    <>
                      <span>
                        •
                      </span>

                      <span>
                        {
                          selectedPropertyLabel
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* MOBILE FILTER */}

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (value) =>
                        !value
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5 text-xs font-bold lg:hidden dark:border-white/10"
                >
                  <Filter className="h-3.5 w-3.5" />

                  Filters
                </button>

                <SortDropdown
                  value={sort}
                  onChange={(value) =>
                    setSort(
                      value as SortOption
                    )
                  }
                />
              </div>
            </div>

            {/* =================================================
                MOBILE FILTER
            ================================================== */}

            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                className="mt-5 lg:hidden"
              >
                <div className="rounded-3xl border border-black/5 bg-zinc-50 p-4 dark:border-white/5 dark:bg-[#0d0d0d]">
                  {/* DESTINATION */}

                  <div className="mb-6">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Destination
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {cities.map(
                        (city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() =>
                              handleCityChange(
                                city
                              )
                            }
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                              selectedCity ===
                              city
                                ? "bg-[#D4AF37] text-black"
                                : "border border-black/10 dark:border-white/10"
                            }`}
                          >
                            {city}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* PROPERTY TYPE */}

                  <div className="border-t border-black/5 pt-6 dark:border-white/5">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Property type
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map(
                        (item) => (
                          <button
                            key={
                              item.label
                            }
                            type="button"
                            onClick={() =>
                              handlePropertyTypeChange(
                                item.value
                              )
                            }
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                              propertyType ===
                              item.value
                                ? "bg-[#D4AF37] text-black"
                                : "border border-black/10 dark:border-white/10"
                            }`}
                          >
                            {
                              item.label
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* FILTER VALUES */}

                  <div className="mt-6 border-t border-black/5 pt-6 dark:border-white/5">
                    <ExploreFilters
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      rating={rating}
                      propertyType={
                        propertyType
                      }
                      setMinPrice={
                        setMinPrice
                      }
                      setMaxPrice={
                        setMaxPrice
                      }
                      setRating={
                        setRating
                      }
                      setPropertyType={
                        handlePropertyTypeChange
                      }
                      onClear={
                        clearFilters
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters(
                        false
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-black text-black"
                  >
                    <X className="h-4 w-4" />

                    Apply filters
                  </button>
                </div>
              </motion.div>
            )}

            {/* =================================================
                REAL MAP
            ================================================== */}

            <div className="mt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-lg font-black">
                    Explore on map
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Find stays by
                    location across
                    Sri Lanka.
                  </p>
                </div>

                <div className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-[10px] font-black text-[#9a7800] dark:text-[#F5D76E]">
                  {mapHotels.length}{" "}
                  mapped
                </div>
              </div>

              {!loading &&
              mapHotels.length >
                0 ? (
                <ExploreMap
                  hotels={mapHotels}
                  selectedHotelId={
                    selectedHotelId
                  }
                  onHotelSelect={
                    handleMapHotelSelect
                  }
                />
              ) : (
                <div className="flex h-[500px] items-center justify-center rounded-[2rem] border border-black/5 bg-zinc-100 dark:border-white/5 dark:bg-[#111]">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-zinc-400" />

                    <p className="mt-3 text-sm font-bold">
                      {loading
                        ? "Loading map..."
                        : "No hotel coordinates available"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Hotels need valid
                      latitude and
                      longitude values
                      to appear on the
                      map.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                HOTEL GRID
            ================================================== */}

            {loading ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({
                  length: 6,
                }).map(
                  (_, index) => (
                    <HotelSkeleton
                      key={index}
                    />
                  )
                )}
              </div>
            ) : error ? (
              <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
                <p className="text-sm font-bold">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchHotels
                  }
                  className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-xs font-bold text-black"
                >
                  Try again
                </button>
              </div>
            ) : sortedHotels.length >
              0 ? (
              <motion.div
                layout
                className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {sortedHotels.map(
                  (
                    hotel,
                    index
                  ) => (
                    <motion.div
                      layout
                      key={
                        hotel._id
                      }
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        delay:
                          index *
                          0.05,
                      }}
                    >
                      <HotelCard
                        hotel={
                          hotel
                        }
                      />
                    </motion.div>
                  )
                )}
              </motion.div>
            ) : (
              <EmptyState
                city={
                  selectedCity
                }
                propertyType={
                  selectedPropertyLabel
                }
                onClear={
                  clearFilters
                }
              />
            )}

            {/* =================================================
                PAGINATION
            ================================================== */}

            {!loading &&
              !error &&
              sortedHotels.length >
                0 &&
              totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={
                      page <= 1
                    }
                    onClick={() => {
                      setPage(
                        (current) =>
                          current -
                          1
                      );

                      setSelectedHotelId(
                        null
                      );
                    }}
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10"
                  >
                    Previous
                  </button>

                  <div className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-black text-black">
                    {page} /{" "}
                    {totalPages}
                  </div>

                  <button
                    type="button"
                    disabled={
                      page >=
                      totalPages
                    }
                    onClick={() => {
                      setPage(
                        (current) =>
                          current +
                          1
                      );

                      setSelectedHotelId(
                        null
                      );
                    }}
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10"
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   HOTEL SKELETON
========================================================= */

function HotelSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]">
      <div className="aspect-[4/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  city,
  propertyType,
  onClear,
}: {
  city: string;
  propertyType: string;
  onClear: () => void;
}) {
  return (
    <div className="mt-10 rounded-[2rem] border border-dashed border-zinc-300 p-12 text-center dark:border-white/10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
        <SlidersHorizontal className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-xl font-black">
        No stays found
        {city !== "All"
          ? ` in ${city}`
          : ""}
        {propertyType !==
        "All"
          ? ` for ${propertyType}`
          : ""}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        We couldn't find any
        published hotels
        matching your current
        filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-bold text-black transition hover:bg-[#F5D76E]"
      >
        Explore all stays
      </button>
    </div>
  );
}