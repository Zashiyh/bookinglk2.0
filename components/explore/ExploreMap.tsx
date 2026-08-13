"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Hotel as HotelIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

interface ExploreMapHotel {
  _id: string;
  name: string;

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
}

interface ExploreMapProps {
  hotels: ExploreMapHotel[];
  selectedHotelId?: string | null;
  onHotelSelect?: (
    hotel: ExploreMapHotel
  ) => void;
}

export default function ExploreMap({
  hotels,
  selectedHotelId,
  onHotelSelect,
}: ExploreMapProps) {
  const [activeHotelId, setActiveHotelId] =
    useState<string | null>(
      selectedHotelId || null
    );

  /*
   * =====================================================
   * VALID HOTELS
   * =====================================================
   */

  const validHotels = useMemo(() => {
    return hotels.filter(
      (hotel) => {
        const coordinates =
          hotel.coordinates?.coordinates;

        return (
          Array.isArray(coordinates) &&
          coordinates.length === 2 &&
          typeof coordinates[0] ===
            "number" &&
          typeof coordinates[1] ===
            "number"
        );
      }
    );
  }, [hotels]);

  /*
   * =====================================================
   * MAP POSITION
   *
   * Sri Lanka coordinate area
   * =====================================================
   */

  const getPosition = (
    hotel: ExploreMapHotel
  ) => {
    const coordinates =
      hotel.coordinates?.coordinates;

    if (
      !coordinates ||
      coordinates.length !== 2
    ) {
      return {
        left: 50,
        top: 50,
      };
    }

    const longitude =
      coordinates[0];

    const latitude =
      coordinates[1];

    /*
     * Sri Lanka approximate bounds
     */

    const minLongitude = 79.7;
    const maxLongitude = 82.0;

    const minLatitude = 5.8;
    const maxLatitude = 9.9;

    const left =
      ((longitude -
        minLongitude) /
        (maxLongitude -
          minLongitude)) *
      100;

    const top =
      100 -
      ((latitude -
        minLatitude) /
        (maxLatitude -
          minLatitude)) *
        100;

    return {
      left: Math.min(
        Math.max(left, 5),
        95
      ),
      top: Math.min(
        Math.max(top, 8),
        92
      ),
    };
  };

  /*
   * =====================================================
   * SELECT HOTEL
   * =====================================================
   */

  const handleHotelClick = (
    hotel: ExploreMapHotel
  ) => {
    setActiveHotelId(hotel._id);

    onHotelSelect?.(hotel);
  };

  /*
   * =====================================================
   * EMPTY
   * =====================================================
   */

  if (validHotels.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-[#111111]">
        <div className="flex h-[420px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
              <MapPin className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-black">
              Map unavailable
            </h3>

            <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              No hotel location coordinates
              are available for the current
              results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * ACTIVE HOTEL
   * =====================================================
   */

  const activeHotel =
    validHotels.find(
      (hotel) =>
        hotel._id === activeHotelId
    );

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#eef1ed] shadow-sm dark:border-white/10 dark:bg-[#101310]">

      {/* =================================================
          MAP BACKGROUND
      ================================================= */}

      <div className="relative h-[420px] overflow-hidden">

        {/* Terrain */}

        <div className="absolute inset-0 bg-[#edf0ea] dark:bg-[#151915]" />

        {/* Large land shapes */}

        <motion.div
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[8%] h-[75%] w-[38%] rounded-[45%] bg-[#dfe7dc] blur-[1px] dark:bg-[#1b241c]"
        />

        <motion.div
          animate={{
            scale: [1.03, 1, 1.03],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[15%] h-[65%] w-[45%] rounded-[50%] bg-[#e2e9df] dark:bg-[#1b211b]"
        />

        <div className="absolute bottom-[-20%] left-[30%] h-[55%] w-[55%] rounded-full bg-[#dce5d8] dark:bg-[#1a211a]" />

        {/* =================================================
            ROAD LINES
        ================================================= */}

        <div className="absolute left-[-10%] top-[52%] h-[2px] w-[120%] rotate-[12deg] bg-white/80 dark:bg-white/5" />

        <div className="absolute left-[15%] top-[-20%] h-[130%] w-[2px] rotate-[28deg] bg-white/80 dark:bg-white/5" />

        <div className="absolute left-[-10%] top-[35%] h-[2px] w-[120%] rotate-[-18deg] bg-white/70 dark:bg-white/5" />

        <div className="absolute left-[65%] top-[-10%] h-[120%] w-[2px] rotate-[-20deg] bg-white/70 dark:bg-white/5" />

        {/* =================================================
            MAP LABELS
        ================================================= */}

        <div className="absolute left-[12%] top-[28%] text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400/70 dark:text-white/20">
          Sri Lanka
        </div>

        <div className="absolute left-[39%] top-[63%] text-xs font-bold text-zinc-400/80 dark:text-white/20">
          Kandy
        </div>

        <div className="absolute left-[15%] top-[72%] text-xs font-bold text-zinc-400/70 dark:text-white/20">
          Colombo
        </div>

        <div className="absolute right-[15%] top-[58%] text-xs font-bold text-zinc-400/70 dark:text-white/20">
          Eastern
        </div>

        {/* =================================================
            HOTEL MARKERS
        ================================================= */}

        {validHotels.map(
          (hotel, index) => {
            const position =
              getPosition(hotel);

            const isActive =
              hotel._id ===
              activeHotelId;

            return (
              <motion.button
                key={hotel._id}
                type="button"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
                onClick={() =>
                  handleHotelClick(
                    hotel
                  )
                }
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 outline-none"
                aria-label={`View ${hotel.name}`}
              >
                {/* Pulse */}

                {isActive && (
                  <motion.div
                    animate={{
                      scale: [
                        1,
                        1.8,
                        1,
                      ],
                      opacity: [
                        0.5,
                        0,
                        0.5,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat:
                        Infinity,
                    }}
                    className="absolute inset-0 rounded-full bg-[#D4AF37]"
                  />
                )}

                {/* Marker */}

                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-xl transition ${
                    isActive
                      ? "border-black bg-[#F5D76E] text-black scale-110"
                      : "border-white bg-[#D4AF37] text-black hover:scale-110 dark:border-[#222]"
                  }`}
                >
                  <HotelIcon className="h-4 w-4" />
                </div>

                {/* Price label */}

                <div
                  className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black shadow-md transition ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white text-black dark:bg-[#202020] dark:text-white"
                  }`}
                >
                  LKR{" "}
                  {new Intl.NumberFormat(
                    "en-LK"
                  ).format(
                    hotel.priceFrom ||
                      0
                  )}
                </div>
              </motion.button>
            );
          }
        )}

        {/* =================================================
            ACTIVE HOTEL CARD
        ================================================= */}

        {activeHotel && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="absolute bottom-5 left-5 z-30 w-[280px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111111]/95"
          >
            {activeHotel.images?.[0] && (
              <img
                src={
                  activeHotel
                    .images[0]
                }
                alt={
                  activeHotel.name
                }
                className="h-28 w-full object-cover"
              />
            )}

            <div className="p-4">

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black">
                    {
                      activeHotel.name
                    }
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3 w-3" />

                    {activeHotel
                      .location
                      ?.city ||
                      "Sri Lanka"}
                  </p>
                </div>

                <div className="shrink-0 rounded-lg bg-[#D4AF37]/10 px-2 py-1 text-xs font-black text-[#B8860B] dark:text-[#F5D76E]">
                  ★{" "}
                  {(
                    activeHotel
                      .rating ||
                    0
                  ).toFixed(1)}
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between">

                <div>
                  <p className="text-[10px] text-zinc-500">
                    From
                  </p>

                  <p className="text-sm font-black">
                    LKR{" "}
                    {new Intl.NumberFormat(
                      "en-LK"
                    ).format(
                      activeHotel
                        .priceFrom ||
                        0
                    )}
                    <span className="ml-1 text-[10px] font-normal text-zinc-500">
                      / night
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onHotelSelect?.(
                      activeHotel
                    )
                  }
                  className="rounded-full bg-[#D4AF37] px-3 py-2 text-[10px] font-black text-black transition hover:bg-[#F5D76E]"
                >
                  View hotel
                </button>

              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            MAP CONTROLS
        ================================================= */}

        <div className="absolute right-5 top-5 z-30 flex flex-col gap-2">

          <button
            type="button"
            onClick={() => {
              setActiveHotelId(
                null
              );
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/90 text-zinc-700 shadow-lg backdrop-blur-xl transition hover:scale-105 dark:border-white/10 dark:bg-[#111111]/90 dark:text-white"
            aria-label="Clear map selection"
          >
            <Navigation className="h-4 w-4" />
          </button>

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        <div className="absolute left-5 top-5 z-30 rounded-full border border-black/10 bg-white/90 px-3 py-2 text-xs font-bold text-zinc-700 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#111111]/90 dark:text-white">
          {validHotels.length}{" "}
          {validHotels.length === 1
            ? "stay"
            : "stays"}{" "}
          on map
        </div>

      </div>
    </div>
  );
}