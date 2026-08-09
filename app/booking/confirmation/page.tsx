"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Hotel,
  MapPin,
  Users,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

interface BookingData {
  bookingReference: string;
  hotelName?: string;
  roomName?: string;
  hotelId?: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  nights?: number;
  roomPrice?: number;
  roomTotal?: number;
  serviceFee?: number;
  total?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
}

export default function BookingConfirmationPage() {
  const [booking, setBooking] =
    useState<BookingData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(
          "bookingConfirmation"
        );

      if (stored) {
        setBooking(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load booking:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  function copyReference() {
    if (!booking?.bookingReference) {
      return;
    }

    navigator.clipboard.writeText(
      booking.bookingReference
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function formatDate(
    value?: string
  ) {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "en-LK",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date(value));
  }

  function formatPrice(
    value?: number
  ) {
    if (
      typeof value !== "number"
    ) {
      return "0";
    }

    return new Intl.NumberFormat(
      "en-LK"
    ).format(value);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-4 py-20 dark:bg-[#050505]">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-zinc-200 dark:bg-white/10" />

          <div className="mx-auto h-10 w-72 rounded bg-zinc-200 dark:bg-white/10" />

          <div className="mx-auto h-5 w-96 max-w-full rounded bg-zinc-200 dark:bg-white/10" />

          <div className="h-96 rounded-3xl bg-zinc-200 dark:bg-white/10" />
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-4 py-20 text-zinc-950 dark:bg-[#050505] dark:text-white">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <Clock3 className="h-9 w-9 text-red-500" />
          </div>

          <h1 className="mt-7 text-3xl font-semibold">
            Booking details not found
          </h1>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            We couldn't find the booking
            confirmation on this device.
          </p>

          <Link
            href="/hotels"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            Explore hotels
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Hero */}
      <section className="border-b border-zinc-200 dark:border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            Booking confirmed
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your stay is reserved
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 dark:text-zinc-400">
            Thank you for choosing BookingLK.
            Your booking request has been
            successfully created.
          </p>

          {/* Reference */}
          <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 shadow-sm dark:border-white/10 dark:bg-[#111111]">
            <span className="text-xs text-zinc-500">
              Booking reference
            </span>

            <span className="font-mono text-sm font-semibold">
              {booking.bookingReference}
            </span>

            <button
              type="button"
              onClick={copyReference}
              className="rounded-full p-2 transition hover:bg-zinc-100 dark:hover:bg-white/10"
              aria-label="Copy booking reference"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-500" />
              )}
            </button>
          </div>

          {copied && (
            <p className="mt-3 text-xs text-emerald-500">
              Booking reference copied
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Booking details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Hotel className="h-6 w-6 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Property
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {booking.hotelName ||
                      "Your selected hotel"}
                  </h2>

                  {booking.roomName && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {booking.roomName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={
                    <CalendarDays className="h-5 w-5" />
                  }
                  label="Check-in"
                  value={formatDate(
                    booking.checkIn
                  )}
                />

                <InfoItem
                  icon={
                    <CalendarDays className="h-5 w-5" />
                  }
                  label="Check-out"
                  value={formatDate(
                    booking.checkOut
                  )}
                />

                <InfoItem
                  icon={
                    <Users className="h-5 w-5" />
                  }
                  label="Guests"
                  value={`${booking.guests || 0} ${
                    booking.guests === 1
                      ? "guest"
                      : "guests"
                  }`}
                />

                <InfoItem
                  icon={
                    <Clock3 className="h-5 w-5" />
                  }
                  label="Stay"
                  value={`${booking.nights || 0} ${
                    booking.nights === 1
                      ? "night"
                      : "nights"
                  }`}
                />
              </div>
            </div>

            {/* Status */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">
              <h2 className="text-lg font-semibold">
                Booking status
              </h2>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                <div>
                  <p className="text-sm text-zinc-500">
                    Reservation
                  </p>

                  <p className="mt-1 font-semibold">
                    {booking.status ||
                      "PENDING"}
                  </p>
                </div>

                <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {booking.paymentStatus ||
                    "PENDING"}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <MapPin className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Your destination
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Your hotel details and
                    location will be available
                    with your reservation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
              <h2 className="text-lg font-semibold">
                Price summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Room
                  </span>

                  <span>
                    LKR{" "}
                    {formatPrice(
                      booking.roomTotal
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">
                    Service fee
                  </span>

                  <span>
                    LKR{" "}
                    {formatPrice(
                      booking.serviceFee
                    )}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-4 dark:border-white/10">
                  <div className="flex items-end justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <div className="text-right">
                      <p className="text-2xl font-semibold">
                        LKR{" "}
                        {formatPrice(
                          booking.total
                        )}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {booking.currency ||
                          "LKR"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/hotels"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
              >
                Explore more hotels
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="mt-3 flex w-full items-center justify-center rounded-2xl border border-zinc-200 py-3.5 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
              >
                Back to home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="text-[#B8860B] dark:text-[#F5D76E]">
          {icon}
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}