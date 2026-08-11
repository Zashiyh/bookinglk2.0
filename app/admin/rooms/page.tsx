"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

interface Hotel {
  _id: string;
  name: string;
  slug: string;
  location?: {
    city?: string;
    district?: string;
  };
}

interface Room {
  _id: string;
  hotelId: string;
  name: string;
  description: string;
  roomType: string;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  totalRooms: number;
  isActive: boolean;
}

interface HotelRooms {
  hotel: Hotel;
  rooms: Room[];
}

export default function AdminRoomsPage() {
  const [data, setData] = useState<HotelRooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadRooms() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/hotels?limit=50",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned ${response.status} instead of JSON.`
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load hotels."
        );
      }

      const hotels: Hotel[] = result.data || [];
      const hotelRooms: HotelRooms[] = [];

      for (const hotel of hotels) {
        try {
          const roomResponse = await fetch(
            `/api/admin/hotels/${hotel._id}/rooms`,
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

          if (!roomResponse.ok) {
            continue;
          }

          const roomContentType =
            roomResponse.headers.get("content-type") || "";

          if (
            !roomContentType.includes("application/json")
          ) {
            continue;
          }

          const roomResult =
            await roomResponse.json();

          if (roomResult.success) {
            hotelRooms.push({
              hotel,
              rooms: roomResult.data || [],
            });
          }
        } catch (roomError) {
          console.error(
            `ROOM_LOAD_ERROR_${hotel._id}:`,
            roomError
          );
        }
      }

      setData(hotelRooms);
    } catch (err) {
      console.error(
        "ADMIN_ROOMS_LOAD_ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const filteredData = data.filter(
    ({ hotel, rooms }) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      return (
        hotel.name
          .toLowerCase()
          .includes(query) ||
        hotel.location?.city
          ?.toLowerCase()
          .includes(query) ||
        hotel.location?.district
          ?.toLowerCase()
          .includes(query) ||
        rooms.some((room) =>
          room.name
            .toLowerCase()
            .includes(query)
        )
      );
    }
  );

  const totalRooms = data.reduce(
    (total, item) =>
      total + item.rooms.length,
    0
  );

  return (
    <main className="min-h-full w-full">
      {/* 
        IMPORTANT:
        This wrapper creates the same breathing room
        between sidebar/navbar and the page content.
      */}
      <div className="px-5 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pt-10 xl:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                <BedDouble className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Hotel management
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  Rooms
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Manage rooms across all BookingLK
              properties.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRooms}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}

            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Properties
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Total room types
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalRooms}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search hotel or room..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-white/[0.025]"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading rooms...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredData.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 dark:border-white/10">
              <BedDouble className="h-10 w-10 text-zinc-400" />

              <h2 className="mt-4 text-lg font-bold">
                No rooms found
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Add rooms from a hotel management
                page.
              </p>
            </div>
          )}

        {/* Hotels + Rooms */}
        {!loading &&
          filteredData.length > 0 && (
            <div className="space-y-6">
              {filteredData.map(
                ({ hotel, rooms }) => (
                  <section
                    key={hotel._id}
                    className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.025]"
                  >
                    {/* Hotel Header */}
                    <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                          <Building2 className="h-5 w-5 text-[#D4AF37]" />
                        </div>

                        <div>
                          <h2 className="font-bold">
                            {hotel.name}
                          </h2>

                          <p className="mt-1 text-xs text-zinc-500">
                            {hotel.location?.city ||
                              hotel.location?.district ||
                              "Sri Lanka"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/admin/hotels/${hotel._id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10"
                      >
                        Manage hotel
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Rooms */}
                    {rooms.length === 0 ? (
                      <div className="p-6 text-sm text-zinc-500">
                        No rooms added to this hotel yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-200 dark:divide-white/10">
                        {rooms.map((room) => (
                          <div
                            key={room._id}
                            className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50 dark:hover:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5">
                                <BedDouble className="h-5 w-5 text-zinc-500" />
                              </div>

                              <div>
                                <h3 className="font-semibold">
                                  {room.name}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                    {room.roomType}
                                  </span>

                                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                    {room.maxGuests} guests
                                  </span>

                                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                    {room.totalRooms} rooms
                                  </span>

                                  <span
                                    className={`rounded-full px-2.5 py-1 font-semibold ${
                                      room.isActive
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500"
                                    }`}
                                  >
                                    {room.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-5 lg:justify-end">
                              <div className="text-right">
                                <p className="text-xs text-zinc-500">
                                  Per night
                                </p>

                                <p className="mt-1 font-bold">
                                  {room.currency}{" "}
                                  {room.pricePerNight.toLocaleString()}
                                </p>
                              </div>

                              <Link
                                href={`/admin/hotels/${hotel._id}`}
                                className="rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-extrabold text-black transition hover:bg-[#e0bd4d]"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}