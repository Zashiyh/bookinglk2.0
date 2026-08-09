"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
  Star,
  Utensils,
  Users,
  Wifi,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Hotel {
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

interface Room {
  _id: string;
  hotelId: string;
  name: string;
  description: string;

  roomType:
    | "STANDARD"
    | "DELUXE"
    | "SUITE"
    | "FAMILY"
    | "VILLA";

  pricePerNight: number;
  currency: "LKR";

  maxGuests: number;

  beds: {
    type:
      | "SINGLE"
      | "DOUBLE"
      | "QUEEN"
      | "KING"
      | "TWIN";
    count: number;
  }[];

  size?: number;

  amenities: string[];
  images: string[];

  totalRooms: number;
  isActive: boolean;
}

interface HotelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const amenityIcons = [
  Wifi,
  Waves,
  Car,
  Coffee,
  Utensils,
];

export default function HotelDetailsPage({
  params,
}: HotelPageProps) {
  const [slug, setSlug] = useState("");

  const [hotel, setHotel] =
    useState<Hotel | null>(null);

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [roomsLoading, setRoomsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [favorite, setFavorite] =
    useState(false);

  const [activeImage, setActiveImage] =
    useState(0);

  useEffect(() => {
    async function loadPage() {
      try {
        const resolvedParams =
          await params;

        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error(error);
        setError("Invalid hotel URL.");
      }
    }

    loadPage();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function fetchHotel() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/hotels/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Hotel not found"
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Hotel not found"
          );
        }

        setHotel(result.data);
      } catch (error) {
        console.error(error);

        setError(
          "We couldn't load this hotel."
        );
      } finally {
        setLoading(false);
      }
    }

    async function fetchRooms() {
      try {
        setRoomsLoading(true);

        const response = await fetch(
          `/api/hotels/${slug}/rooms`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load rooms"
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load rooms"
          );
        }

        setRooms(result.data);
      } catch (error) {
        console.error(error);

        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    }

    fetchHotel();
    fetchRooms();
  }, [slug]);

  const galleryImages = useMemo(() => {
    if (!hotel) return [];

    if (
      hotel.images &&
      hotel.images.length > 0
    ) {
      return hotel.images;
    }

    return [
      "/images/hotel-placeholder.jpg",
    ];
  }, [hotel]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat(
      "en-LK"
    ).format(price);
  }

  function formatRoomType(
    type: string
  ) {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function formatBed(
    beds: Room["beds"]
  ) {
    return beds
      .map((bed) => {
        const type =
          bed.type
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            );

        return `${bed.count} ${type}`;
      })
      .join(" • ");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-white/10" />

            <div className="h-[420px] rounded-3xl bg-zinc-200 dark:bg-white/10" />

            <div className="space-y-4">
              <div className="h-10 w-2/3 rounded bg-zinc-200 dark:bg-white/10" />
              <div className="h-5 w-1/3 rounded bg-zinc-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 dark:bg-[#050505]">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <MapPin className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold">
            Hotel not found
          </h1>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {error ||
              "This property may no longer be available."}
          </p>

          <Link
            href="/hotels"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Top navigation */}
      <section className="border-b border-zinc-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-[#B8860B] dark:text-zinc-400 dark:hover:text-[#F5D76E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </Link>
        </div>
      </section>

      {/* Hotel Header */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                {formatRoomType(
                  hotel.propertyType
                )}
              </span>

              {hotel.isVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  BookingLK Verified
                </span>
              )}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {hotel.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                {hotel.location.city},{" "}
                {hotel.location.district}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                <strong className="text-zinc-900 dark:text-white">
                  {hotel.rating.toFixed(1)}
                </strong>
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setFavorite(
                (value) => !value
              )
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:scale-105 dark:border-white/10 dark:bg-[#111111]"
            aria-label={
              favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              className={`h-5 w-5 ${
                favorite
                  ? "fill-[#D4AF37] text-[#D4AF37]"
                  : ""
              }`}
            />
          </button>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-[#111111]">
          <div className="relative h-[300px] sm:h-[420px] lg:h-[560px]">
            <img
              src={galleryImages[activeImage]}
              alt={hotel.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      (current) =>
                        current === 0
                          ? galleryImages.length -
                            1
                          : current - 1
                    )
                  }
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      (current) =>
                        current ===
                        galleryImages.length -
                          1
                          ? 0
                          : current + 1
                    )
                  }
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-5 left-5 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
              {activeImage + 1} /{" "}
              {galleryImages.length}
            </div>
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto p-3">
              {galleryImages.map(
                (image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() =>
                      setActiveImage(index)
                    }
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 ${
                      activeImage === index
                        ? "border-[#D4AF37]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${hotel.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="min-w-0">
            {/* About */}
            <section>
              <h2 className="text-2xl font-semibold">
                About this property
              </h2>

              <p className="mt-4 max-w-3xl whitespace-pre-line leading-8 text-zinc-600 dark:text-zinc-400">
                {hotel.description}
              </p>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#D4AF37]" />

                  <div>
                    <p className="font-medium">
                      {hotel.location.address}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {hotel.location.city},{" "}
                      {hotel.location.district},{" "}
                      {hotel.location.province},{" "}
                      {hotel.location.country}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">
                Amenities
              </h2>

              {hotel.amenities.length >
              0 ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map(
                    (amenity, index) => {
                      const Icon =
                        amenityIcons[
                          index %
                            amenityIcons.length
                        ];

                      return (
                        <div
                          key={`${amenity}-${index}`}
                          className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-[#111111]"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10">
                            <Icon className="h-4 w-4 text-[#B8860B] dark:text-[#F5D76E]" />
                          </div>

                          <span className="text-sm">
                            {amenity}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  No amenities listed.
                </p>
              )}
            </section>

            {/* Rooms */}
            <section className="mt-14" id="rooms">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Available rooms
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Choose the room that best
                    fits your stay.
                  </p>
                </div>

                {!roomsLoading && (
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium dark:bg-white/5">
                    {rooms.length} room types
                  </span>
                )}
              </div>

              {roomsLoading ? (
                <div className="mt-6 space-y-4">
                  {Array.from({
                    length: 3,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-56 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10"
                    />
                  ))}
                </div>
              ) : rooms.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111111]">
                  <BedDouble className="mx-auto h-8 w-8 text-[#D4AF37]" />

                  <h3 className="mt-4 font-semibold">
                    No rooms available
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    This property currently has
                    no active rooms listed.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {rooms.map((room) => (
                    <article
                      key={room._id}
                      className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]"
                    >
                      <div className="grid md:grid-cols-[260px_1fr]">
                        {/* Room image */}
                        <div className="relative min-h-[220px] bg-zinc-100 dark:bg-[#181818]">
                          <img
                            src={
                              room.images?.[0] ||
                              "/images/hotel-placeholder.jpg"
                            }
                            alt={room.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />

                          <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                            {formatRoomType(
                              room.roomType
                            )}
                          </div>
                        </div>

                        {/* Room details */}
                        <div className="p-6">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {room.name}
                              </h3>

                              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                {room.description}
                              </p>
                            </div>

                            <div className="shrink-0">
                              <p className="text-xs text-zinc-500">
                                From
                              </p>

                              <p className="mt-1 text-xl font-semibold">
                                LKR{" "}
                                {formatPrice(
                                  room.pricePerNight
                                )}
                              </p>

                              <p className="text-xs text-zinc-500">
                                per night
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 dark:bg-white/5">
                              <BedDouble className="h-4 w-4" />
                              {formatBed(
                                room.beds
                              )}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 dark:bg-white/5">
                              <Users className="h-4 w-4" />
                              Up to{" "}
                              {room.maxGuests}{" "}
                              guests
                            </span>

                            {room.size && (
                              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 dark:bg-white/5">
                                <Maximize className="h-4 w-4" />
                                {room.size} m²
                              </span>
                            )}
                          </div>

                          {room.amenities.length >
                            0 && (
                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                              {room.amenities
                                .slice(
                                  0,
                                  5
                                )
                                .map(
                                  (
                                    amenity
                                  ) => (
                                    <span
                                      key={
                                        amenity
                                      }
                                      className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                                    >
                                      <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
                                      {
                                        amenity
                                      }
                                    </span>
                                  )
                                )}
                            </div>
                          )}

                          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                            <p className="text-xs text-zinc-500">
                              {room.totalRooms}{" "}
                              rooms available
                              in this property
                            </p>

                            <Link
                              href={`/booking/checkout?hotel=${hotel.slug}&room=${room._id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                            >
                              Book this room
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Booking card */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Starting from
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">
                  LKR{" "}
                  {formatPrice(
                    hotel.priceFrom
                  )}
                </span>

                <span className="text-sm text-zinc-500">
                  / night
                </span>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Rating
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                    {hotel.rating.toFixed(
                      1
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Reviews
                  </span>

                  <span>
                    {hotel.reviewCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Room types
                  </span>

                  <span>
                    {rooms.length}
                  </span>
                </div>
              </div>

              <a
                href="#rooms"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
              >
                View available rooms
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <p className="mt-4 text-center text-xs text-zinc-500">
                You won't be charged yet.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

