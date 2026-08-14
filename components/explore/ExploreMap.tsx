"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  Hotel as HotelIcon,
  MapPin,
  Star,
} from "lucide-react";

/* =========================================================
   HOTEL TYPE
========================================================= */

export interface ExploreMapHotel {
  _id: string;

  slug: string;

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

/* =========================================================
   PROPS
========================================================= */

interface ExploreMapProps {
  hotels: ExploreMapHotel[];

  selectedHotelId?: string | null;

  onHotelSelect?: (
    hotel: ExploreMapHotel
  ) => void;
}

/* =========================================================
   SRI LANKA CENTER
========================================================= */

const SRI_LANKA_CENTER: [number, number] = [
  7.8731,
  80.7718,
];

/* =========================================================
   CUSTOM HOTEL ICON
========================================================= */

const createHotelIcon = (
  active: boolean
) => {
  return L.divIcon({
    className: "bookinglk-hotel-marker",

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:9999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:${active ? "#F5D76E" : "#D4AF37"};
          color:#000;
          border:3px solid ${active ? "#000" : "#fff"};
          box-shadow:0 6px 20px rgba(0,0,0,.28);
          transform:${active ? "scale(1.12)" : "scale(1)"};
          transition:all .2s ease;
        "
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 21h18"/>
          <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
          <path d="M9 7h1"/>
          <path d="M14 7h1"/>
          <path d="M9 11h1"/>
          <path d="M14 11h1"/>
          <path d="M9 15h1"/>
          <path d="M14 15h1"/>
        </svg>
      </div>
    `,

    iconSize: [42, 42],

    iconAnchor: [21, 42],

    popupAnchor: [0, -42],
  });
};

/* =========================================================
   MAP FLY TO HOTEL
========================================================= */

function MapController({
  hotel,
}: {
  hotel: ExploreMapHotel | null;
}) {
  const map = useMap();

  useEffect(() => {
    const coordinates =
      hotel?.coordinates?.coordinates;

    if (
      !coordinates ||
      coordinates.length !== 2
    ) {
      return;
    }

    const longitude = coordinates[0];

    const latitude = coordinates[1];

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    map.flyTo(
      [
        latitude,
        longitude,
      ],
      13,
      {
        duration: 1,
      }
    );
  }, [
    hotel,
    map,
  ]);

  return null;
}

/* =========================================================
   MAIN MAP COMPONENT
========================================================= */

export default function ExploreMap({
  hotels,
  selectedHotelId = null,
  onHotelSelect,
}: ExploreMapProps) {
  const router = useRouter();

  /* =======================================================
     ACTIVE HOTEL
  ======================================================= */

  const [
    activeHotelId,
    setActiveHotelId,
  ] = useState<string | null>(
    selectedHotelId
  );

  /* =======================================================
     MAP STYLE
     
     false = Default map
     true  = Satellite map
  ======================================================= */

  const [
    satelliteMode,
    setSatelliteMode,
  ] = useState(false);

  /* =======================================================
     SYNC PARENT SELECTION
  ======================================================= */

  useEffect(() => {
    setActiveHotelId(
      selectedHotelId
    );
  }, [
    selectedHotelId,
  ]);

  /* =======================================================
     VALID HOTELS
  ======================================================= */

  const validHotels = useMemo(() => {
    return hotels.filter(
      (hotel) => {
        if (
          !hotel._id ||
          !hotel.slug
        ) {
          return false;
        }

        const coordinates =
          hotel.coordinates
            ?.coordinates;

        if (
          !Array.isArray(
            coordinates
          ) ||
          coordinates.length !== 2
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
      }
    );
  }, [
    hotels,
  ]);

  /* =======================================================
     ACTIVE HOTEL
  ======================================================= */

  const activeHotel =
    validHotels.find(
      (hotel) =>
        hotel._id ===
        activeHotelId
    ) ?? null;

  /* =======================================================
     SELECT HOTEL
  ======================================================= */

  const handleHotelSelect = (
    hotel: ExploreMapHotel
  ) => {
    setActiveHotelId(
      hotel._id
    );

    onHotelSelect?.(
      hotel
    );
  };

  /* =======================================================
     VIEW HOTEL
  ======================================================= */

  const handleViewHotel = (
    hotel: ExploreMapHotel
  ) => {
    const slug =
      hotel.slug?.trim();

    if (!slug) {
      console.error(
        "Hotel slug is missing:",
        hotel
      );

      return;
    }

    onHotelSelect?.(
      hotel
    );

    router.push(
      `/hotels/${encodeURIComponent(
        slug
      )}`
    );
  };

  /* =======================================================
     CLEAR SELECTION
  ======================================================= */

  const clearSelection = () => {
    setActiveHotelId(
      null
    );
  };

  /* =======================================================
     NO HOTELS
  ======================================================= */

  if (
    validHotels.length === 0
  ) {
    return (
      <div className="relative flex h-[500px] items-center justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-[#111]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <MapPin className="h-7 w-7" />
          </div>

          <h3 className="mt-5 text-lg font-black">
            No locations available
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The current hotels do
            not have valid hotel
            slugs and coordinates.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAP
  ======================================================= */

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-xl dark:border-white/10">
      <MapContainer
        center={
          SRI_LANKA_CENTER
        }
        zoom={8}
        minZoom={7}
        maxZoom={18}
        scrollWheelZoom
        className="h-[500px] w-full"
      >
        {/* =================================================
            DEFAULT MAP
        ================================================= */}

        {!satelliteMode && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* =================================================
            SATELLITE MAP
        ================================================= */}

        {satelliteMode && (
          <>
            {/* SATELLITE IMAGERY */}

            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />

            {/* LOCATION / PLACE LABELS */}

            <TileLayer
              attribution="Labels &copy; Esri"
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
              opacity={1}
            />
          </>
        )}

        {/* =================================================
            MAP CONTROLLER
        ================================================= */}

        <MapController
          hotel={
            activeHotel
          }
        />

        {/* =================================================
            HOTEL MARKERS
        ================================================= */}

        {validHotels.map(
          (
            hotel
          ) => {
            const coordinates =
              hotel.coordinates
                ?.coordinates;

            if (
              !coordinates ||
              coordinates.length !== 2
            ) {
              return null;
            }

            const longitude =
              coordinates[0];

            const latitude =
              coordinates[1];

            const isActive =
              hotel._id ===
              activeHotelId;

            return (
              <Marker
                key={
                  hotel._id
                }
                position={[
                  latitude,
                  longitude,
                ]}
                icon={createHotelIcon(
                  isActive
                )}
                eventHandlers={{
                  click: () =>
                    handleHotelSelect(
                      hotel
                    ),
                }}
              >
                <Popup>
                  <div className="w-[240px] overflow-hidden">
                    {/* IMAGE */}

                    {hotel.images?.[0] && (
                      <img
                        src={
                          hotel.images[0]
                        }
                        alt={
                          hotel.name
                        }
                        className="mb-3 h-28 w-full rounded-xl object-cover"
                      />
                    )}

                    {/* NAME */}

                    <h3 className="text-sm font-black text-zinc-900">
                      {
                        hotel.name
                      }
                    </h3>

                    {/* LOCATION */}

                    <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" />

                      <span>
                        {
                          hotel
                            .location
                            ?.city ||
                          hotel
                            .location
                            ?.district ||
                          "Sri Lanka"
                        }
                      </span>
                    </div>

                    {/* RATING + PRICE */}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg bg-[#D4AF37]/15 px-2 py-1 text-xs font-black text-[#8a6c00]">
                        <Star className="h-3 w-3 fill-current" />

                        {(
                          hotel.rating ??
                          0
                        ).toFixed(
                          1
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400">
                          From
                        </p>

                        <p className="text-sm font-black text-zinc-900">
                          LKR{" "}
                          {new Intl.NumberFormat(
                            "en-LK"
                          ).format(
                            hotel.priceFrom ??
                              0
                          )}
                        </p>
                      </div>
                    </div>

                    {/* VIEW HOTEL */}

                    <button
                      type="button"
                      onClick={() =>
                        handleViewHotel(
                          hotel
                        )
                      }
                      className="mt-3 w-full rounded-xl bg-[#D4AF37] px-3 py-2 text-xs font-black text-black transition hover:bg-[#F5D76E] active:scale-[0.98]"
                    >
                      View hotel
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          }
        )}
      </MapContainer>

      {/* =====================================================
          RESULT COUNT
      ====================================================== */}

      <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-full border border-black/10 bg-white/95 px-3 py-2 text-[10px] font-black text-zinc-800 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/95 dark:text-white sm:left-5 sm:top-5 sm:px-4 sm:text-xs">
        {validHotels.length}{" "}
        {validHotels.length ===
        1
          ? "stay"
          : "stays"}{" "}
        on map
      </div>

      {/* =====================================================
          MAP STYLE TOGGLE
      ====================================================== */}

      <div className="absolute right-4 top-4 z-[1000] sm:right-5 sm:top-5">
        <button
          type="button"
          onClick={() =>
            setSatelliteMode(
              (prev) => !prev
            )
          }
          aria-label={
            satelliteMode
              ? "Switch to default map"
              : "Switch to satellite view"
          }
          aria-pressed={
            satelliteMode
          }
          className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-2 py-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-black/80 active:scale-95"
        >
          {/* LABEL */}

          <span className="pl-1 text-[9px] font-bold tracking-wide text-white sm:text-[10px]">
            {satelliteMode
              ? "Satellite"
              : "Default"}
          </span>

          {/* TOGGLE */}

          <span
            className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-[2px] transition-all duration-300 ${
              satelliteMode
                ? "bg-[#D4AF37]"
                : "bg-white/25"
            }`}
          >
            {/* KNOB */}

            <span
              className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                satelliteMode
                  ? "translate-x-4"
                  : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* =====================================================
          CLEAR BUTTON
      ====================================================== */}

      {activeHotel && (
        <button
          type="button"
          onClick={
            clearSelection
          }
          className="absolute right-4 top-[52px] z-[1000] rounded-xl border border-black/10 bg-white/95 px-3 py-2 text-[10px] font-black text-zinc-800 shadow-xl backdrop-blur-xl transition hover:scale-105 dark:border-white/10 dark:bg-[#111]/95 dark:text-white sm:right-5 sm:top-[58px] sm:px-4 sm:text-xs"
        >
          Clear
        </button>
      )}

      {/* =====================================================
          ACTIVE HOTEL CARD
      ====================================================== */}

      {activeHotel && (
        <div className="absolute bottom-4 left-4 z-[1000] w-[300px] max-w-[calc(100%-32px)] overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/95 sm:bottom-5 sm:left-5 sm:max-w-[calc(100%-40px)]">
          {/* IMAGE */}

          {activeHotel.images?.[0] && (
            <img
              src={
                activeHotel.images[0]
              }
              alt={
                activeHotel.name
              }
              className="h-32 w-full object-cover"
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

                  {
                    activeHotel
                      .location
                      ?.city ||
                    activeHotel
                      .location
                      ?.district ||
                    "Sri Lanka"
                  }
                </p>
              </div>

              {/* RATING */}

              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#D4AF37]/15 px-2 py-1 text-xs font-black text-[#9a7800] dark:text-[#F5D76E]">
                <Star className="h-3 w-3 fill-current" />

                {(
                  activeHotel.rating ??
                  0
                ).toFixed(
                  1
                )}
              </div>
            </div>

            {/* PRICE + BUTTON */}

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] text-zinc-400">
                  From
                </p>

                <p className="text-sm font-black">
                  LKR{" "}
                  {new Intl.NumberFormat(
                    "en-LK"
                  ).format(
                    activeHotel.priceFrom ??
                      0
                  )}

                  <span className="ml-1 text-[10px] font-normal text-zinc-400">
                    / night
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleViewHotel(
                    activeHotel
                  )
                }
                className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-4 py-2 text-[10px] font-black text-black transition hover:bg-[#F5D76E] active:scale-[0.98]"
              >
                <HotelIcon className="h-3 w-3" />

                View hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}