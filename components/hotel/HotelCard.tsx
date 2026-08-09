
"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Star,
  Wifi,
  Waves,
  Car,
  Utensils,
  ArrowUpRight,
  Dumbbell,
  Coffee,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface HotelCardData {
  _id: string;
  name: string;
  slug: string;
  description: string;

  propertyType: string;

  location: {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };

  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };

  rating: number;
  reviewCount: number;

  priceFrom: number;
  currency: "LKR";

  amenities: string[];

  images: string[];

  isVerified: boolean;
  isPublished: boolean;
}

interface HotelCardProps {
  hotel: HotelCardData;
}

function getAmenityIcon(amenity: string) {
  const value = amenity.toLowerCase();

  if (value.includes("wifi") || value.includes("wi-fi")) {
    return Wifi;
  }

  if (
    value.includes("pool") ||
    value.includes("beach") ||
    value.includes("water")
  ) {
    return Waves;
  }

  if (
    value.includes("parking") ||
    value.includes("car") ||
    value.includes("shuttle")
  ) {
    return Car;
  }

  if (
    value.includes("restaurant") ||
    value.includes("food") ||
    value.includes("dining")
  ) {
    return Utensils;
  }

  if (
    value.includes("gym") ||
    value.includes("fitness")
  ) {
    return Dumbbell;
  }

  if (
    value.includes("breakfast") ||
    value.includes("coffee")
  ) {
    return Coffee;
  }

  if (
    value.includes("spa") ||
    value.includes("luxury")
  ) {
    return Sparkles;
  }

  return Sparkles;
}

export default function HotelCard({
  hotel,
}: HotelCardProps) {
  const [favorite, setFavorite] = useState(false);

  const image =
    hotel.images?.length > 0
      ? hotel.images[0]
      : "/images/hotel-placeholder.jpg";

  const formattedPrice = new Intl.NumberFormat(
    "en-LK"
  ).format(hotel.priceFrom);

  const rating =
    typeof hotel.rating === "number"
      ? hotel.rating
      : 0;

  const reviewCount =
    typeof hotel.reviewCount === "number"
      ? hotel.reviewCount
      : 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.3,
      }}
      className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-2xl dark:border-white/10 dark:bg-[#111111]"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "/images/hotel-placeholder.jpg";
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Favorite */}
        <button
          type="button"
          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          onClick={() =>
            setFavorite((value) => !value)
          }
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:scale-105"
        >
          <Heart
            className={`h-5 w-5 ${
              favorite
                ? "fill-current text-[#D4AF37]"
                : ""
            }`}
          />
        </button>

        {/* Verified */}
        {hotel.isVerified && (
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            ✓ BookingLK Verified
          </div>
        )}

        {/* Property type */}
        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-black backdrop-blur">
          {hotel.propertyType
            .replaceAll("_", " ")}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="mb-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin className="h-4 w-4" />

          <span>
            {hotel.location.city},{" "}
            {hotel.location.district}
          </span>
        </div>

        {/* Name */}
        <h3 className="line-clamp-1 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          {hotel.name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
            <Star className="h-4 w-4 fill-current" />

            {rating.toFixed(1)}
          </div>

          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Amenities */}
        {hotel.amenities?.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {hotel.amenities
              .slice(0, 4)
              .map((amenity) => {
                const Icon =
                  getAmenityIcon(amenity);

                return (
                  <div
                    key={amenity}
                    title={amenity}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-300"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })}
          </div>
        )}

        {/* Bottom */}
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-white/10">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              From
            </p>

            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-semibold text-zinc-950 dark:text-white">
                LKR {formattedPrice}
              </span>

              <span className="text-xs text-zinc-500">
                / night
              </span>
            </div>
          </div>

          <Link
            href={`/hotels/${hotel.slug}`}
            className="group/button flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            View

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

