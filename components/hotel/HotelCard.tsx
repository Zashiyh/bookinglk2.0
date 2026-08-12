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
  BedDouble,
  CheckCircle2,
  XCircle,
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

  // =====================================================
  // ROOM AVAILABILITY
  // =====================================================

  totalRooms?: number;
  bookedRooms?: number;
  availableRooms?: number;
  hasAvailableRooms?: boolean;
}

interface HotelCardProps {
  hotel: HotelCardData;
}

function getAmenityIcon(amenity: string) {
  const value = amenity.toLowerCase();

  if (
    value.includes("wifi") ||
    value.includes("wi-fi")
  ) {
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

  /*
   * =====================================================
   * IMAGE
   * =====================================================
   */

  const image =
    hotel.images?.length > 0
      ? hotel.images[0]
      : "/images/hotel-placeholder.jpg";

  /*
   * =====================================================
   * PRICE
   * =====================================================
   */

  const formattedPrice = new Intl.NumberFormat(
    "en-LK"
  ).format(hotel.priceFrom);

  /*
   * =====================================================
   * RATING
   * =====================================================
   */

  const rating =
    typeof hotel.rating === "number"
      ? hotel.rating
      : 0;

  const reviewCount =
    typeof hotel.reviewCount === "number"
      ? hotel.reviewCount
      : 0;

  /*
   * =====================================================
   * ROOM AVAILABILITY
   * =====================================================
   */

  const availableRooms =
    typeof hotel.availableRooms === "number"
      ? hotel.availableRooms
      : 0;

  const hasRooms =
    availableRooms > 0;

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

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
      className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition-shadow hover:shadow-2xl dark:bg-[#111111] ${
        hasRooms
          ? "border-black/10 dark:border-white/10"
          : "border-red-500/20 dark:border-red-500/20"
      }`}
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
            !hasRooms ? "grayscale-[15%]" : ""
          }`}
          onError={(event) => {
            event.currentTarget.src =
              "/images/hotel-placeholder.jpg";
          }}
        />

        {/* Image gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* =================================================
            FAVORITE
        ================================================= */}

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

        {/* =================================================
            VERIFIED
        ================================================= */}

        {hotel.isVerified && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#F5D76E]" />

            BookingLK Verified
          </div>
        )}

        {/* =================================================
            PROPERTY TYPE
        ================================================= */}

        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-black backdrop-blur">
          {hotel.propertyType.replaceAll(
            "_",
            " "
          )}
        </div>

        {/* =================================================
            ROOM AVAILABILITY BADGE
        ================================================= */}

        <div className="absolute bottom-4 right-4">
          {hasRooms ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/70 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5" />

              {availableRooms}{" "}
              {availableRooms === 1
                ? "room"
                : "rooms"}{" "}
              available
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-red-400/30 bg-red-950/70 px-3 py-1.5 text-xs font-semibold text-red-300 shadow-lg backdrop-blur-md">
              <XCircle className="h-3.5 w-3.5" />

              No rooms available
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-5">
        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="mb-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin className="h-4 w-4" />

          <span>
            {hotel.location.city},{" "}
            {hotel.location.district}
          </span>
        </div>

        {/* =================================================
            HOTEL NAME
        ================================================= */}

        <h3 className="line-clamp-1 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          {hotel.name}
        </h3>

        {/* =================================================
            RATING
        ================================================= */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
            <Star className="h-4 w-4 fill-current" />

            {rating.toFixed(1)}
          </div>

          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {reviewCount.toLocaleString()}{" "}
            {reviewCount === 1
              ? "review"
              : "reviews"}
          </span>
        </div>

        {/* =================================================
            AMENITIES
        ================================================= */}

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

        {/* =================================================
            ROOM STATUS
        ================================================= */}

        <div
          className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 ${
            hasRooms
              ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/5 text-red-500"
          }`}
        >
          <BedDouble className="h-4 w-4 shrink-0" />

          {hasRooms ? (
            <span className="text-xs font-semibold">
              {availableRooms}{" "}
              {availableRooms === 1
                ? "room is"
                : "rooms are"}{" "}
              currently available
            </span>
          ) : (
            <span className="text-xs font-semibold">
              No rooms currently available
            </span>
          )}
        </div>

        {/* =================================================
            PRICE + VIEW
        ================================================= */}

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
            className={`group/button flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              hasRooms
                ? "bg-[#D4AF37] text-black hover:bg-[#F5D76E]"
                : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/15"
            }`}
          >
            {hasRooms
              ? "View"
              : "View hotel"}

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}