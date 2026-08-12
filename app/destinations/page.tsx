"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Mountain,
  Search,
  Sparkles,
  Trees,
  Waves,
  MapPin,
  Star,
  Building2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Category =
  | "All"
  | "Beach"
  | "Mountain"
  | "Culture"
  | "Wildlife"
  | "Adventure"
  | "City";

interface Destination {
  name: string;
  slug: string;
  province: string;
  description: string;
  image: string;
  hotels: number;
  rating: number;
  category: Category[];
  featured?: boolean;
}

const destinations: Destination[] = [
  {
    name: "Kandy",
    slug: "kandy",
    province: "Central Province",
    description:
      "Discover sacred temples, mountain views, rich culture and unforgettable stays in Sri Lanka's cultural capital.",
    image:
      "https://media.istockphoto.com/id/1307248869/photo/kandy-lake-and-city.jpg?s=612x612&w=0&k=20&c=mhMLi1I_CKBL4_ipyNPWgmuTE8RKOs8YiOazqZE-7Mg=",
    hotels: 124,
    rating: 4.8,
    category: ["Culture", "Mountain"],
    featured: true,
  },
  {
    name: "Ella",
    slug: "ella",
    province: "Uva Province",
    description:
      "Misty mountains, tea plantations, waterfalls and one of the world's most beautiful train journeys.",
    image:
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85",
    hotels: 86,
    rating: 4.9,
    category: ["Mountain", "Adventure"],
    featured: true,
  },
  {
    name: "Galle",
    slug: "galle",
    province: "Southern Province",
    description:
      "Wander through historic streets, colonial architecture and the iconic Galle Fort by the ocean.",
    image:
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
    hotels: 102,
    rating: 4.7,
    category: ["Culture", "Beach"],
    featured: true,
  },
  {
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    province: "Central Province",
    description:
      "Escape into cool mountain air, endless tea estates and peaceful highland landscapes.",
    image:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1400&q=85",
    hotels: 74,
    rating: 4.7,
    category: ["Mountain", "Adventure"],
    featured: true,
  },
  {
    name: "Mirissa",
    slug: "mirissa",
    province: "Southern Province",
    description:
      "Golden beaches, turquoise water, sunsets and laid-back coastal escapes.",
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85",
    hotels: 68,
    rating: 4.8,
    category: ["Beach"],
  },
  {
    name: "Sigiriya",
    slug: "sigiriya",
    province: "Central Province",
    description:
      "Experience the legendary Lion Rock, ancient history and breathtaking jungle landscapes.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpE1NYU30TeFFAdTzyTnublAqof6qJ-VOWF7LYEUyV6w&s=10",
    hotels: 59,
    rating: 4.8,
    category: ["Culture", "Adventure", "Wildlife"],
  },
  {
    name: "Bentota",
    slug: "bentota",
    province: "Southern Province",
    description:
      "A classic tropical getaway with beaches, rivers, resorts and water adventures.",
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1400&q=85",
    hotels: 81,
    rating: 4.6,
    category: ["Beach", "Adventure"],
  },
  {
    name: "Arugam Bay",
    slug: "arugam-bay",
    province: "Eastern Province",
    description:
      "Surf, sunshine and a relaxed coastal atmosphere on Sri Lanka's eastern shore.",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85",
    hotels: 47,
    rating: 4.7,
    category: ["Beach", "Adventure"],
  },
  {
    name: "Yala",
    slug: "yala",
    province: "Southern Province",
    description:
      "Get closer to Sri Lanka's wild side with unforgettable safari and nature experiences.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
    hotels: 42,
    rating: 4.6,
    category: ["Wildlife", "Adventure"],
  },
  {
    name: "Colombo",
    slug: "colombo",
    province: "Western Province",
    description:
      "Experience Sri Lanka's energetic capital with city life, dining, shopping and ocean views.",
    image:
      "https://media.istockphoto.com/id/1251580617/photo/background-view-of-the-colombo-city-skyline-with-modern-architecture-buildi.jpg?s=612x612&w=0&k=20&c=dYuA923PJPoIf4YEQgBSlEEMkK-HP6Sxj5Ty0DMX7KE=",
    hotels: 156,
    rating: 4.5,
    category: ["City", "Culture"],
  },
  {
    name: "Hikkaduwa",
    slug: "hikkaduwa",
    province: "Southern Province",
    description:
      "A lively beach destination known for coral reefs, surfing and coastal nightlife.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    hotels: 73,
    rating: 4.6,
    category: ["Beach", "Adventure"],
  },
  {
    name: "Anuradhapura",
    slug: "anuradhapura",
    province: "North Central Province",
    description:
      "Step into thousands of years of history through ancient cities, stupas and sacred sites.",
    image:
      "https://media.istockphoto.com/id/1178773961/photo/mihintale-in-anuradhapura.jpg?s=612x612&w=0&k=20&c=o8khB9AGw0tYglYTvBM1ZDARqGr6c627dQXjVgVRdkY=",
    hotels: 51,
    rating: 4.6,
    category: ["Culture"],
  },
];

const categories = [
  {
    name: "Beach",
    icon: Waves,
    description: "Golden shores & turquoise water",
  },
  {
    name: "Mountain",
    icon: Mountain,
    description: "Misty hills & tea country",
  },
  {
    name: "Culture",
    icon: Compass,
    description: "History, temples & heritage",
  },
  {
    name: "Wildlife",
    icon: Trees,
    description: "Safaris & wild adventures",
  },
  {
    name: "Adventure",
    icon: Sparkles,
    description: "Explore beyond the ordinary",
  },
  {
    name: "City",
    icon: Building2,
    description: "Food, shopping & nightlife",
  },
];

const popularDestinations = destinations.filter(
  (destination) => destination.featured
);

/* =========================================================
   COUNT UP COMPONENT
========================================================= */

function CountUp({
  end,
  duration = 1800,
  decimals = 0,
  suffix = "",
}: {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(end * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* =========================================================
   DESTINATIONS PAGE
========================================================= */

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [search, setSearch] = useState("");

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesCategory =
        activeCategory === "All" ||
        destination.category.includes(activeCategory);

      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.province.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[720px] overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://www.thetimes.com/imageserver/image/methode%2Ftimes%2Fprod%2Fweb%2Fbin%2F693874c1-c25e-4dbf-9b95-675d788a30d6.jpg?strip=all&format=webp&resize=2360"
            alt="Sri Lanka destination"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/80" />
        </div>

        {/* Floating glow */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[25%] h-80 w-80 rounded-full bg-white/10 blur-[120px]"
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 pb-20 pt-32 sm:px-8 lg:px-10">
          <div className="max-w-4xl">

            {/* Badge */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl"
            >
              <MapPin className="h-4 w-4 text-[#F5D76E]" />

              Explore the island
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
              className="max-w-4xl text-5xl font-black tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl"
            >
              Explore

              <span className="block text-[#F5D76E]">
                Sri Lanka.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg"
            >
              From misty mountains and ancient cities to
              golden beaches and wild national parks,
              discover destinations worth remembering.
            </motion.p>

            {/* Search */}
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
                delay: 0.3,
              }}
              className="mt-9 max-w-2xl"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Search className="h-5 w-5 text-white/70" />
                </div>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search destinations..."
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-white/50 sm:text-base"
                />

                <button
                  type="button"
                  className="hidden rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#F5D76E] sm:block"
                >
                  Explore
                </button>
              </div>

              {/* Quick search */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Kandy",
                  "Ella",
                  "Galle",
                  "Mirissa",
                  "Sigiriya",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearch(item)}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75 backdrop-blur transition hover:border-[#D4AF37]/50 hover:bg-white/15 hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* =================================================
            STATS WITH COUNT UP
        ================================================= */}

        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">

            {/* Destinations */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.4,
              }}
              className="px-5 py-5 text-center sm:py-6"
            >
              <p className="text-xl font-black text-white sm:text-2xl">
                <CountUp
                  end={25}
                  duration={1800}
                  decimals={0}
                  suffix="+"
                />
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                Destinations
              </p>
            </motion.div>

            {/* Hotels */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.5,
              }}
              className="px-5 py-5 text-center sm:py-6"
            >
              <p className="text-xl font-black text-white sm:text-2xl">
                <CountUp
                  end={1000}
                  duration={2200}
                  decimals={0}
                  suffix="+"
                />
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                Hotels
              </p>
            </motion.div>

            {/* Provinces */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.6,
              }}
              className="px-5 py-5 text-center sm:py-6"
            >
              <p className="text-xl font-black text-white sm:text-2xl">
                <CountUp
                  end={9}
                  duration={1500}
                  decimals={0}
                />
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                Provinces
              </p>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.7,
              }}
              className="px-5 py-5 text-center sm:py-6"
            >
              <p className="flex items-center justify-center gap-1 text-xl font-black text-white sm:text-2xl">
                <CountUp
                  end={4.7}
                  duration={1800}
                  decimals={1}
                />
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                Average rating
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          POPULAR
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Most loved
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Popular destinations
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Places travelers keep coming back to.
              Start your next Sri Lankan adventure here.
            </p>
          </div>

          <Link
            href="/hotels"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#B8860B] dark:text-[#F5D76E]"
          >
            Find hotels

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {popularDestinations.map(
            (destination, index) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                index={index}
                featured
              />
            )
          )}
        </div>
      </section>

      {/* =====================================================
          EXPERIENCES
      ====================================================== */}

      <section className="border-y border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Travel your way
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Explore by experience
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Whether you want a quiet mountain escape or
              an action-packed beach adventure, there's a
              place waiting for you.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category.name as Category
                    )
                  }
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className={`group flex items-center gap-5 rounded-3xl border p-5 text-left transition ${
                    activeCategory === category.name
                      ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                      : "border-black/5 bg-white hover:border-[#D4AF37]/30 dark:border-white/5 dark:bg-[#111111]"
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] transition group-hover:bg-[#D4AF37] group-hover:text-black dark:text-[#F5D76E]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {category.description}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D4AF37]" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ALL DESTINATIONS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Discover more
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              All destinations
            </h2>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {filteredDestinations.length} destinations
              available to explore.
            </p>
          </div>

          {/* Filters */}
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {[
              "All",
              ...categories.map(
                (category) => category.name
              ),
            ].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category as Category
                  )
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === category
                    ? "bg-[#D4AF37] text-black"
                    : "border border-black/10 bg-white text-zinc-500 hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-[#111111] dark:text-zinc-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredDestinations.length > 0 ? (
          <motion.div
            layout
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredDestinations.map(
              (destination, index) => (
                <DestinationCard
                  key={destination.slug}
                  destination={destination}
                  index={index}
                />
              )
            )}
          </motion.div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 p-16 text-center dark:border-white/10">

            <MapPin className="mx-auto h-10 w-10 text-zinc-400" />

            <h3 className="mt-4 text-lg font-bold">
              No destinations found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try another destination or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          NEARBY / LOCATION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">

        <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-8 sm:p-12 lg:p-16">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-[90px]" />

          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                <MapPin className="h-3.5 w-3.5 text-[#F5D76E]" />

                Personalized discovery
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Find destinations

                <span className="text-[#F5D76E]">
                  {" "}
                  near you.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
                Allow BookingLK to use your location and
                we'll help you discover nearby destinations
                and hotels.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    () => {
                      window.location.href =
                        "/hotels";
                    },
                    () => {
                      window.location.href =
                        "/hotels";
                    }
                  );
                } else {
                  window.location.href = "/hotels";
                }
              }}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              <MapPin className="h-4 w-4" />

              Use my location

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="border-t border-black/5 dark:border-white/5">

        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
            Your next escape
            <br />
            starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Find the destination. Discover the perfect
            stay. Make memories across Sri Lanka.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/hotels"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              Explore hotels

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-6 py-3.5 text-sm font-bold transition hover:border-[#D4AF37] dark:border-white/10"
            >
              View deals

              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   DESTINATION CARD
========================================================= */

function DestinationCard({
  destination,
  index,
  featured = false,
}: {
  destination: Destination;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.35),
      }}
      className={`group relative overflow-hidden rounded-[1.75rem] ${
        featured
          ? "h-[420px]"
          : "h-[390px]"
      }`}
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="block h-full"
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.src =
              "/images/hotel-placeholder.jpg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10 transition group-hover:from-black/95" />

        {/* Rating */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
          <Star className="h-3.5 w-3.5 fill-[#F5D76E] text-[#F5D76E]" />

          {destination.rating}
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">

          <div className="mb-3 flex flex-wrap gap-1.5">
            {destination.category
              .slice(0, 2)
              .map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-xl"
                >
                  {category}
                </span>
              ))}
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            {destination.name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/55">
            <MapPin className="h-3.5 w-3.5" />

            {destination.province}
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/60">
            {destination.description}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

            <div className="flex items-center gap-2 text-xs text-white/65">
              <Building2 className="h-4 w-4" />

              {destination.hotels} hotels
            </div>

            <span className="flex items-center gap-1.5 text-xs font-bold text-[#F5D76E]">
              Explore

              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}