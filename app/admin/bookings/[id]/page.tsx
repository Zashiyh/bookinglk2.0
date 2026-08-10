
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Hotel,
  Loader2,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

interface HotelData {
  _id: string;
  name: string;
  location?: {
    city?: string;
    district?: string;
    address?: string;
  };
}

interface RoomData {
  _id: string;
  name?: string;
  roomType?: string;
  pricePerNight?: number;
  currency?: string;
}

interface BookingData {
  _id: string;
  bookingReference: string;

  hotelId: HotelData | string;
  roomId: RoomData | string;

  checkIn: string;
  checkOut: string;

  guests: number;

  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  specialRequest?: string;

  nights: number;
  roomPrice: number;
  roomTotal: number;
  serviceFee: number;
  total: number;

  currency: "LKR";

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<BookingStatus, string> = {
  PENDING:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",

  CONFIRMED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

  CANCELLED:
    "border-red-500/20 bg-red-500/10 text-red-400",

  COMPLETED:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
};

const paymentStyles: Record<PaymentStatus, string> = {
  PENDING:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",

  PAID:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

  FAILED:
    "border-red-500/20 bg-red-500/10 text-red-400",

  REFUNDED:
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const bookingId = params?.id;

  const [booking, setBooking] =
    useState<BookingData | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) return;

    let cancelled = false;

    async function loadBooking() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/bookings/${encodeURIComponent(
            bookingId
          )}`,
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }
        );

        const text = await response.text();

        let result: {
          success?: boolean;
          message?: string;
          data?: BookingData;
        } = {};

        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            `API returned non-JSON response. Status: ${response.status}`
          );
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              `Unable to load booking (${response.status})`
          );
        }

        if (!result.data) {
          throw new Error(
            "API returned no booking data."
          );
        }

        if (cancelled) return;

        setBooking(result.data);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "ADMIN_BOOKING_DETAILS_ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load booking."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  async function updateBooking(
    data: {
      status?: BookingStatus;
      paymentStatus?: PaymentStatus;
    },
    confirmationMessage: string
  ) {
    if (!booking) return;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `/api/admin/bookings/${encodeURIComponent(
          booking._id
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to update booking (${response.status})`
        );
      }

      if (result.data) {
        setBooking(result.data);
      }
    } catch (error) {
      console.error(
        "ADMIN_BOOKING_UPDATE_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update booking."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#D4AF37]" />

            <p className="mt-4 text-sm text-zinc-500">
              Loading booking...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/bookings")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to bookings
        </button>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <XCircle className="mx-auto h-8 w-8 text-red-400" />

          <h2 className="mt-4 text-lg font-bold">
            Unable to load booking
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const hotel =
    typeof booking.hotelId === "object"
      ? booking.hotelId
      : null;

  const room =
    typeof booking.roomId === "object"
      ? booking.roomId
      : null;

  const guestName =
    `${booking.guest?.firstName ?? ""} ${
      booking.guest?.lastName ?? ""
    }`.trim() || "Guest";

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/bookings")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to bookings
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                <CalendarDays className="h-4 w-4 shrink-0" />

                Reservation details
              </div>

              <h1 className="break-all text-3xl font-bold tracking-tight sm:text-4xl">
                {booking.bookingReference}
              </h1>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Created{" "}
                {formatDateTime(
                  booking.createdAt
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[booking.status]}`}
              >
                {booking.status}
              </span>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${paymentStyles[booking.paymentStatus]}`}
              >
                Payment:{" "}
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ACTIONS */}

        <div className="mb-8 flex flex-wrap gap-3">
          {booking.status === "PENDING" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateBooking(
                  { status: "CONFIRMED" },
                  "Confirm this booking?"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Confirm booking
            </button>
          )}

          {booking.status !== "CANCELLED" &&
            booking.status !== "COMPLETED" && (
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  updateBooking(
                    { status: "CANCELLED" },
                    "Cancel this booking?"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />

                Cancel booking
              </button>
            )}

          {booking.status === "CONFIRMED" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateBooking(
                  { status: "COMPLETED" },
                  "Mark this booking as completed?"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-2.5 text-sm font-bold text-blue-400 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />

              Mark completed
            </button>
          )}

          {booking.paymentStatus === "PENDING" && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateBooking(
                  { paymentStatus: "PAID" },
                  "Mark this payment as paid?"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2.5 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />

              Mark paid
            </button>
          )}
        </div>

        {/* MAIN CONTENT */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* LEFT */}

          <div className="min-w-0 space-y-6">

            {/* GUEST */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <Users className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Guest details
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Primary guest information
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Info
                  label="Full name"
                  value={guestName}
                />

                <Info
                  label="Email"
                  value={
                    booking.guest?.email ||
                    "—"
                  }
                />

                <Info
                  label="Phone"
                  value={
                    booking.guest?.phone ||
                    "—"
                  }
                />

                <Info
                  label="Guests"
                  value={`${booking.guests} ${
                    booking.guests === 1
                      ? "guest"
                      : "guests"
                  }`}
                />
              </div>
            </section>

            {/* HOTEL */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <Hotel className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Hotel & room
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Property and accommodation
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Info
                  label="Hotel"
                  value={
                    hotel?.name ||
                    "Hotel information unavailable"
                  }
                />

                <Info
                  label="Room"
                  value={
                    room?.name ||
                    room?.roomType ||
                    "Room information unavailable"
                  }
                />

                <Info
                  label="Room price"
                  value={formatCurrency(
                    booking.roomPrice
                  )}
                />

                {hotel?.location?.city && (
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
                      <MapPin className="h-3.5 w-3.5" />

                      Location
                    </div>

                    <p className="mt-2 break-words text-sm font-medium">
                      {hotel.location.address
                        ? `${hotel.location.address}, `
                        : ""}

                      {hotel.location.city}

                      {hotel.location.district
                        ? `, ${hotel.location.district}`
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* STAY */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Stay details
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Check-in and check-out
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <Info
                  label="Check-in"
                  value={formatDate(
                    booking.checkIn
                  )}
                />

                <Info
                  label="Check-out"
                  value={formatDate(
                    booking.checkOut
                  )}
                />

                <Info
                  label="Duration"
                  value={`${booking.nights} ${
                    booking.nights === 1
                      ? "night"
                      : "nights"
                  }`}
                />
              </div>
            </section>

            {/* SPECIAL REQUEST */}

            {booking.specialRequest && (
              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
                <h2 className="font-bold">
                  Special request
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                  {booking.specialRequest}
                </p>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="h-fit min-w-0 space-y-6 xl:sticky xl:top-6">

            {/* PRICE */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Price summary
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Booking total
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <PriceRow
                  label={`Room × ${booking.nights} ${
                    booking.nights === 1
                      ? "night"
                      : "nights"
                  }`}
                  value={formatCurrency(
                    booking.roomTotal
                  )}
                />

                <PriceRow
                  label="Service fee"
                  value={formatCurrency(
                    booking.serviceFee
                  )}
                />

                <div className="border-t border-zinc-200 pt-4 dark:border-white/10">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-right text-2xl font-extrabold text-[#D4AF37]">
                      {formatCurrency(
                        booking.total
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* STATUS */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <h2 className="font-bold">
                Booking status
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-zinc-500">
                    <Clock3 className="h-4 w-4 shrink-0" />

                    Reservation
                  </span>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-zinc-500">
                    <CreditCard className="h-4 w-4 shrink-0" />

                    Payment
                  </span>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentStyles[booking.paymentStatus]}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </section>

            {/* TIMELINE */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <h2 className="font-bold">
                Booking activity
              </h2>

              <div className="mt-5 space-y-5">
                <TimelineItem
                  title="Booking created"
                  value={formatDateTime(
                    booking.createdAt
                  )}
                />

                <TimelineItem
                  title="Last updated"
                  value={formatDateTime(
                    booking.updatedAt
                  )}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium">
        {value || "—"}
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="min-w-0 text-zinc-500">
        {label}
      </span>

      <span className="shrink-0 font-semibold">
        {value}
      </span>
    </div>
  );
}

function TimelineItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="relative border-l border-[#D4AF37]/30 pl-4">
      <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-[#D4AF37]" />

      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {value}
      </p>
    </div>
  );
}
