
"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Hotel as HotelIcon,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  XCircle,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";

interface BookingData {
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
  currency: "LKR";
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface HotelData {
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

interface RoomData {
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
  booking: BookingData;
  hotel: HotelData | null;
  room: RoomData | null;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK").format(price);
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

function StatusIcon({ status }: { status: string }) {
  if (status === "CONFIRMED") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "CANCELLED") {
    return <XCircle className="h-4 w-4" />;
  }

  return <Clock3 className="h-4 w-4" />;
}

export default function MyBookingsPage() {
  const [reference, setReference] = useState("");

  const [booking, setBooking] =
    useState<BookingResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function searchBooking(event?: FormEvent) {
    event?.preventDefault();

    const cleanReference = reference.trim();

    if (!cleanReference) {
      setError("Please enter your booking reference.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const response = await fetch(
        `/api/bookings/${encodeURIComponent(cleanReference)}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Booking not found."
        );
      }

      setBooking(result.data);
    } catch (error) {
      console.error("Booking search error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to find your booking."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <Navbar />

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden border-b border-zinc-200/70 bg-[var(--background)] pt-32 dark:border-white/10 sm:pt-36">
        {/* Ambient glow */}

        <div className="pointer-events-none absolute left-1/2 top-20 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Back */}

          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-[#111111] dark:text-zinc-300 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to hotels
          </Link>

          {/* Heading */}

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <HotelIcon className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              My bookings
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
              Enter your BookingLK reference to view your
              reservation details.
            </p>
          </div>

          {/* Search */}

          <form
            onSubmit={searchBooking}
            className="mx-auto mt-9 max-w-2xl"
          >
            <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center">
                <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-400" />

                <input
                  value={reference}
                  onChange={(event) =>
                    setReference(event.target.value)
                  }
                  placeholder="e.g. BLK-123456-ABC123"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Searching..." : "Find booking"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ERROR */}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <h2 className="font-semibold">
                  Booking not found
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY */}

        {!booking && !loading && !error && (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-[#111111]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <Search className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Find your reservation
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Your booking reference can be found on your
              confirmation page or booking confirmation email.
            </p>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />

            <div className="h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />
              <div className="h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />
              <div className="h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/5" />
            </div>
          </div>
        )}

        {/* BOOKING */}

        {booking && !loading && (
          <div className="space-y-6">
            {/* Booking Header */}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Booking reference
                  </p>

                  <h2 className="mt-2 break-all text-2xl font-bold tracking-tight sm:text-3xl">
                    {booking.booking.bookingReference}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Booked on{" "}
                    {formatDate(
                      booking.booking.createdAt
                    )}
                  </p>
                </div>

                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                    booking.booking.status
                  )}`}
                >
                  <StatusIcon
                    status={booking.booking.status}
                  />

                  {booking.booking.status}
                </div>
              </div>
            </div>

            {/* HOTEL */}

            {booking.hotel && (
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
                <div className="grid md:grid-cols-[280px_1fr]">
                  <div className="relative min-h-[220px] bg-zinc-100 dark:bg-white/5">
                    <img
                      src={
                        booking.hotel.images?.[0] ||
                        "/images/hotel-placeholder.jpg"
                      }
                      alt={booking.hotel.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                      <ShieldCheck className="h-4 w-4" />

                      BookingLK Verified
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold">
                      {booking.hotel.name}
                    </h2>

                    <div className="mt-3 flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

                      <span>
                        {booking.hotel.location.address},{" "}
                        {booking.hotel.location.city},{" "}
                        {booking.hotel.location.district}
                      </span>
                    </div>

                    <Link
                      href={`/hotels/${booking.hotel.slug}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      View property

                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* STAY DETAILS */}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
                <CalendarDays className="h-5 w-5 text-[#D4AF37]" />

                <p className="mt-4 text-xs text-zinc-500">
                  Check-in
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(booking.booking.checkIn)}
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
                <CalendarDays className="h-5 w-5 text-[#D4AF37]" />

                <p className="mt-4 text-xs text-zinc-500">
                  Check-out
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(booking.booking.checkOut)}
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
                <Users className="h-5 w-5 text-[#D4AF37]" />

                <p className="mt-4 text-xs text-zinc-500">
                  Guests
                </p>

                <p className="mt-1 font-semibold">
                  {booking.booking.guests} guests
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {booking.booking.nights}{" "}
                  {booking.booking.nights === 1
                    ? "night"
                    : "nights"}
                </p>
              </div>
            </div>

            {/* ROOM */}

            {booking.room && (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:w-64 dark:bg-white/5">
                    <img
                      src={
                        booking.room.images?.[0] ||
                        "/images/hotel-placeholder.jpg"
                      }
                      alt={booking.room.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                      {booking.room.roomType.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {booking.room.name}
                    </h2>

                    {booking.room.description && (
                      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {booking.room.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {booking.room.beds?.length > 0 && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                          {booking.room.beds
                            .map(
                              (bed) =>
                                `${bed.count} ${bed.type}`
                            )
                            .join(" • ")}
                        </span>
                      )}

                      <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                        Up to {booking.room.maxGuests} guests
                      </span>

                      {booking.room.size && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs dark:bg-white/5">
                          {booking.room.size} m²
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GUEST */}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <h2 className="text-xl font-semibold">
                Guest details
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">
                    Guest
                  </p>

                  <p className="mt-1 font-medium">
                    {booking.booking.guest.firstName}{" "}
                    {booking.booking.guest.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium">
                    {booking.booking.guest.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Phone
                  </p>

                  <p className="mt-1 font-medium">
                    {booking.booking.guest.phone}
                  </p>
                </div>

                {booking.booking.specialRequest && (
                  <div>
                    <p className="text-xs text-zinc-500">
                      Special request
                    </p>

                    <p className="mt-1 font-medium">
                      {booking.booking.specialRequest}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PRICE */}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <h2 className="text-xl font-semibold">
                Price summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-zinc-500">
                    Room × {booking.booking.nights}{" "}
                    {booking.booking.nights === 1
                      ? "night"
                      : "nights"}
                  </span>

                  <span className="shrink-0">
                    LKR{" "}
                    {formatPrice(
                      booking.booking.roomTotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-zinc-500">
                    Service fee
                  </span>

                  <span className="shrink-0">
                    LKR{" "}
                    {formatPrice(
                      booking.booking.serviceFee
                    )}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-5 dark:border-white/10">
                  <div className="flex items-end justify-between gap-5">
                    <span className="font-semibold">
                      Total
                    </span>

                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        LKR{" "}
                        {formatPrice(
                          booking.booking.total
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Payment:{" "}
                        {booking.booking.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/hotels"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />

                Browse more hotels
              </Link>

              <Link
                href={`/booking/confirmation/${booking.booking._id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
              >
                View confirmation

                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <Footer />
    </main>
  );
}

