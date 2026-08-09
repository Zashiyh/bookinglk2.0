"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Hotel as HotelIcon,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  bookingReference: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;

  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  specialRequest?: string;

  roomPrice: number;
  roomTotal: number;
  serviceFee: number;
  total: number;

  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Hotel {
  _id: string;
  name: string;
  slug: string;

  location: {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };

  images: string[];
  rating: number;
  reviewCount: number;
}

interface Room {
  _id: string;
  name: string;
  roomType: string;
  description?: string;

  pricePerNight: number;
  maxGuests: number;

  beds: {
    type: string;
    count: number;
  }[];

  size?: number;

  amenities: string[];
  images: string[];
}

interface BookingResponse {
  booking: Booking;
  hotel: Hotel | null;
  room: Room | null;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK").format(price);
}

function formatRoomType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getStatusClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "CANCELLED":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
}

export default function BookingConfirmationPage({
  params,
}: PageProps) {
  const [bookingId, setBookingId] = useState("");

  const [data, setData] =
    useState<BookingResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        const resolvedParams =
          await params;

        setBookingId(
          resolvedParams.id
        );
      } catch (error) {
        console.error(error);

        setError(
          "Invalid booking URL."
        );

        setLoading(false);
      }
    }

    loadBooking();
  }, [params]);

  useEffect(() => {
    if (!bookingId) return;

    async function fetchBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/bookings/${encodeURIComponent(
            bookingId
          )}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Booking not found."
          );
        }

        setData(result.data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your booking."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  async function copyReference() {
    if (!data?.booking.bookingReference)
      return;

    try {
      await navigator.clipboard.writeText(
        data.booking.bookingReference
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#050505] dark:text-white">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-zinc-200 dark:bg-white/10" />

            <div className="mx-auto h-10 w-72 rounded-xl bg-zinc-200 dark:bg-white/10" />

            <div className="mx-auto h-5 w-96 max-w-full rounded-lg bg-zinc-200 dark:bg-white/10" />

            <div className="mt-12 h-48 rounded-3xl bg-zinc-200 dark:bg-white/10" />

            <div className="h-72 rounded-3xl bg-zinc-200 dark:bg-white/10" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#050505] dark:text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <Clock3 className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="mt-6 text-3xl font-semibold">
              Booking not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {error ||
                "We couldn't find this booking."}
            </p>

            <Link
              href="/my-bookings"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Find my booking
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { booking, hotel, room } =
    data;

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-900 dark:bg-[#050505] dark:text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[400px] w-[400px] rounded-full bg-[#D4AF37]/5 blur-[100px]" />
      </div>

      {/* Top navigation */}
      <nav className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </Link>

          <Link
            href="/my-bookings"
            className="text-sm font-semibold"
          >
            My bookings
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            Booking successful
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your stay is booked
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Your reservation has been created
            successfully. Keep your booking
            reference safe for future access.
          </p>

          {/* Reference */}
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Booking reference
            </p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="break-all text-xl font-bold tracking-wide">
                {booking.bookingReference}
              </span>

              <button
                type="button"
                onClick={copyReference}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:scale-105 dark:border-white/10 dark:bg-[#111111]"
                aria-label="Copy booking reference"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {copied && (
              <p className="mt-2 text-xs text-emerald-500">
                Reference copied
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Hotel */}
            {hotel && (
              <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
                <div className="grid md:grid-cols-[280px_1fr]">
                  <div className="relative min-h-[250px] bg-zinc-100 dark:bg-white/5">
                    <img
                      src={
                        hotel.images?.[0] ||
                        "/images/hotel-placeholder.jpg"
                      }
                      alt={hotel.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#F5D76E]" />
                      Verified
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>

                      {hotel.rating > 0 && (
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                          {hotel.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold">
                      {hotel.name}
                    </h2>

                    <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" />

                      <span>
                        {hotel.location.address},{" "}
                        {hotel.location.city},{" "}
                        {hotel.location.district}
                      </span>
                    </div>

                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      View property
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Stay details */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Stay details
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Your reservation dates
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-white/5">
                  <p className="text-xs text-zinc-500">
                    Check-in
                  </p>

                  <p className="mt-2 font-semibold">
                    {formatDate(
                      booking.checkIn
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-white/5">
                  <p className="text-xs text-zinc-500">
                    Check-out
                  </p>

                  <p className="mt-2 font-semibold">
                    {formatDate(
                      booking.checkOut
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-white/5">
                  <p className="text-xs text-zinc-500">
                    Guests
                  </p>

                  <p className="mt-2 font-semibold">
                    {booking.guests}{" "}
                    {booking.guests === 1
                      ? "guest"
                      : "guests"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {booking.nights}{" "}
                    {booking.nights === 1
                      ? "night"
                      : "nights"}
                  </p>
                </div>
              </div>
            </div>

            {/* Room */}
            {room && (
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
                <h2 className="text-xl font-semibold">
                  Your room
                </h2>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                  <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:w-64 dark:bg-white/5">
                    <img
                      src={
                        room.images?.[0] ||
                        "/images/hotel-placeholder.jpg"
                      }
                      alt={room.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                      {formatRoomType(
                        room.roomType
                      )}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {room.name}
                    </h3>

                    {room.description && (
                      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {room.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {room.beds?.length >
                        0 && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                          {room.beds
                            .map(
                              (bed) =>
                                `${bed.count} ${formatRoomType(
                                  bed.type
                                )}`
                            )
                            .join(" • ")}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                        <Users className="h-3.5 w-3.5" />
                        Up to {room.maxGuests}
                      </span>

                      {room.size && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                          {room.size} m²
                        </span>
                      )}
                    </div>

                    {room.amenities?.length >
                      0 && (
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {room.amenities
                          .slice(0, 6)
                          .map(
                            (amenity) => (
                              <span
                                key={
                                  amenity
                                }
                                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                              >
                                <Check className="h-3.5 w-3.5 text-[#D4AF37]" />
                                {amenity}
                              </span>
                            )
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Guest details */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <h2 className="text-xl font-semibold">
                Guest details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">
                    Guest name
                  </p>

                  <p className="mt-1 font-medium">
                    {booking.guest.firstName}{" "}
                    {booking.guest.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium">
                    {booking.guest.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Phone
                  </p>

                  <p className="mt-1 font-medium">
                    {booking.guest.phone}
                  </p>
                </div>

                {booking.specialRequest && (
                  <div>
                    <p className="text-xs text-zinc-500">
                      Special request
                    </p>

                    <p className="mt-1 font-medium">
                      {
                        booking.specialRequest
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <HotelIcon className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Price summary
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Reservation total
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-zinc-500">
                    Room × {booking.nights}{" "}
                    nights
                  </span>

                  <span className="font-medium">
                    LKR{" "}
                    {formatPrice(
                      booking.roomTotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-zinc-500">
                    Service fee
                  </span>

                  <span className="font-medium">
                    LKR{" "}
                    {formatPrice(
                      booking.serviceFee
                    )}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-5 dark:border-white/10">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        LKR{" "}
                        {formatPrice(
                          booking.total
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Payment:{" "}
                        {
                          booking.paymentStatus
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Booking status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Keep your booking reference
                  safe. You can use it anytime
                  to find your reservation.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/my-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-7 py-3.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5"
          >
            View my bookings
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Link
            href="/hotels"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            Browse more hotels
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}