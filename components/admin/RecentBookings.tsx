"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Hotel,
} from "lucide-react";

export interface RecentBooking {
  _id: string;
  bookingReference: string;

  guest?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  hotelId?: {
    _id?: string;
    name?: string;
    location?: {
      city?: string;
    };
  };

  checkIn: string;
  checkOut: string;

  total: number;
  currency?: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  createdAt: string;
}

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(
  value: number,
  currency = "LKR"
) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function statusClasses(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

    case "COMPLETED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";

    case "CANCELLED":
      return "bg-red-500/10 text-red-500 border-red-500/20";

    default:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
}

export default function RecentBookings({
  bookings,
}: RecentBookingsProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
      <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 p-6 sm:flex-row sm:items-center dark:border-white/10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            Reservations
          </p>

          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
            Recent bookings
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Latest reservations across BookingLK.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#B8860B] transition hover:text-[#D4AF37]"
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
            <Hotel className="h-6 w-6 text-zinc-400" />
          </div>

          <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
            No bookings yet
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            New bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-white/10">
                <th className="px-6 py-4 font-medium">
                  Booking
                </th>

                <th className="px-6 py-4 font-medium">
                  Guest
                </th>

                <th className="px-6 py-4 font-medium">
                  Hotel
                </th>

                <th className="px-6 py-4 font-medium">
                  Stay
                </th>

                <th className="px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const guestName =
                  `${booking.guest?.firstName ?? ""} ${
                    booking.guest?.lastName ?? ""
                  }`.trim() || "Guest";

                return (
                  <tr
                    key={booking._id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {booking.bookingReference}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {guestName}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {booking.guest?.email ?? "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {booking.hotelId?.name ?? "Unknown hotel"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {booking.hotelId?.location?.city ?? "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {formatDate(booking.checkIn)}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        to {formatDate(booking.checkOut)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {formatCurrency(
                          booking.total,
                          booking.currency || "LKR"
                        )}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {booking.paymentStatus}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}